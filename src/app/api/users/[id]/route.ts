import { NextRequest, NextResponse } from "next/server";
import { error, processCreateUserRequest, processUpdateUser } from "../../util";
import { getUser, userIdExists } from "@/db/queries";
import { User } from "@/db/schema";
import { HttpStatusCode } from "axios";
import { CHECK_ADMIN, CHECK_UNAUTHORIZED } from "../../auth";

// GET assignment info
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log(request.url);
    const user_id = (await context.params).id;
    const err = await CHECK_UNAUTHORIZED(user_id);
    if (err) return err;

    return NextResponse.json(
      { data: await getUser((await context.params).id) },
      { status: HttpStatusCode.Ok }
    );
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
    const err = await CHECK_UNAUTHORIZED(user_id);
    if (err) return err;

    const body: User = await request.json();

    const exists = userIdExists(user_id);

    if (!exists) return processCreateUserRequest(request);
    else return processUpdateUser(body);
  } catch (ex) {
    return error(`processing update request failed: ${ex}`);
  }
}
