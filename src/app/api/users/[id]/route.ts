import { HttpStatusCode } from "axios";
import { CHECK_ADMIN, CHECK_UNAUTHORIZED_BY_UID } from "../../auth";
import { NextRequest, NextResponse } from "next/server";
import {
  deleteAllFromUser,
  getCompleteUser,
  getUser,
  userIdExists,
} from "@/db/queries";
import { error, processCreateUserRequest, processUpdateUser } from "../../util";
import { User } from "@/db/schema";

/**
 * Handles the GET request to retrieve user data by ID.
 *
 * @param request - The incoming HTTP request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter.
 *
 * @returns A `NextResponse` object containing the user data in JSON format with an HTTP status of 200 (OK),
 *          or an error response in case of failure.
 */
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

/*
* Handles the PUT request to create a new user.
*
* @param request - The incoming HTTP request object.
*
* @returns A `NextResponse` object containing the created user data in JSON format with an HTTP status of 201 (Created),
*          or an error response in case of failure.
*/
export async function PUT(request: NextRequest) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await processCreateUserRequest(request);
}

/* 
* Handles the POST request to update user data by ID.
*
* @param request - The incoming HTTP request object.
* @param context - The context object containing route parameters.
* @param context.params - A promise resolving to an object with the `id` parameter.
* @returns A `NextResponse` object containing the updated user data in JSON format with an HTTP status of 200 (OK),
*          or an error response in case of failure.
*/
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
      let user = await getCompleteUser(user_id);
      if (user instanceof NextResponse) return user;

      user = { ...user, ...body };
      return processUpdateUser(user);
    }
  } catch (ex) {
    return error(`processing update request failed: ${ex}`);
  }
}

/**
 * Handles the DELETE request to delete all data associated with a user by ID.
 *
 * @param request - The incoming HTTP request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter.
 *
 * @returns A `NextResponse` object indicating the status of the deletion operation,
 *          or an error response in case of failure.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const exists = await userIdExists(user_id);
    if (exists instanceof NextResponse) {
      return exists;
    }

    await deleteAllFromUser(user_id);
    return NextResponse.json({
      status: HttpStatusCode.Ok,
    });
  } catch (e) {
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
