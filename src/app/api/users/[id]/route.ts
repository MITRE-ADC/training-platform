import { HttpStatusCode } from "axios";
import {
  CHECK_ADMIN,
  CHECK_UNAUTHORIZED,
  CHECK_UNAUTHORIZED_BY_UID,
} from "../../auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteAllFromUser, getCompleteUser, getUser, userIdExists } from "@/db/queries";
import { error, processCreateUserRequest, processUpdateUser } from "../../util";
import { User } from "@/db/schema";
import { deleteUser } from "@/app/admin/dashboard/dashboardServer";

// GET assignment info
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const result = await getUser(user_id);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ data: result }, { status: HttpStatusCode.Ok });
  } catch (ex) {
    return NextResponse.json(
      {
        message: `Error: ${ex}\n`,
      },
      {
        status: HttpStatusCode.InternalServerError,
      }
    );
  }
}

// Create new user
export async function PUT(request: NextRequest) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await processCreateUserRequest(request);
}

// Modify user data -- detailed
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
    if (err) return err;

    const body: User = await request.json();

    const exists = await userIdExists(user_id);
    if (exists instanceof NextResponse) return exists;

    if (!exists) return processCreateUserRequest(request);
    else {
      // fill in non-updated info
      let user = await getCompleteUser(user_id);
      if (user instanceof NextResponse) return user;

      user = { ...user, ...body };
      return processUpdateUser(user);
    }
  } catch (ex) {
    return error(`processing update request failed: ${ex}`);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id
    const exists = await userIdExists(user_id);
    if (exists instanceof NextResponse) {
      console.log("user id doesn't exist");
      return exists;
    }
    // IMPLEMENT IN QUERIES
    await deleteAllFromUser(user_id)
    return NextResponse.json(
      {
        status: HttpStatusCode.Ok,
      }
    );

  } catch (e){
    return NextResponse.json(
      {
        message: `Error: ${e}\n`,
      },
      {
        status: HttpStatusCode.InternalServerError,
      }
    );
  }
}
