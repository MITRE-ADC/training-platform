import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

import { processCreateUserRequest } from "../util";
import { getAllUsers } from "@/db/queries";

/**
 * Handles the GET request to retrieve all users from the database.
 *
 * This function fetches all user records using the `getAllUsers` function,
 * filters out the admin user (identified by the `ADMIN_USER_EMAIL` environment variable),
 * and returns the remaining users in a JSON response with an HTTP 200 status code.
 *
 * If an error occurs during the process, it returns a JSON response with the error message
 * and an HTTP 500 status code.
 *
 * @returns {Promise<NextResponse>} A JSON response containing the list of users or an error message.
 */
export async function GET() {
  try {
    let result = await getAllUsers();
    if (result instanceof NextResponse) return result;

    result = result.filter((x) => x.email != process.env.ADMIN_USER_EMAIL);

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

/**
 * Handles the POST request to create a new user.
 *
 * This function processes the incoming request to create a new user
 * by calling the `processCreateUserRequest` function.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response indicating the result of the user creation process.
 */
export async function POST(request: NextRequest) {
  return await processCreateUserRequest(request);
}
