import { NextRequest, NextResponse } from "next/server";
import { error } from "../../util";
import { HttpStatusCode } from "axios";
import { register_user } from "../util";

/**
 * Updates data in the DB for a user's progress
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    console.log("Registering user in webgoat");
    const username = request.nextUrl.searchParams?.get("name");
    const password = request.nextUrl.searchParams?.get("password");

    if (!username || !password)
      return error("Please specify a name and password");

    const err = await register_user(username, password);
    if (err) return err;

    return NextResponse.json(
      {
        message:
          "Registered user in webgoat successfully; make sure to link to user record with the appropriate route (e.g. POST api/users)",
      },
      { status: HttpStatusCode.Created }
    );
  } catch (ex) {
    return error(`${ex}`);
  }
}
