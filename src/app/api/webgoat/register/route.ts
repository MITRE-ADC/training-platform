import { NextRequest, NextResponse } from "next/server";
import { error } from "../../util";
// import { register_user } from "../util";
import { HttpStatusCode } from "axios";
import { CHECK_ADMIN } from "../../auth";

/**
 * Updates data in the DB for a user's progress
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    const err = await CHECK_ADMIN();
    if (err) return err;

    const username = request.nextUrl.searchParams?.get("name");
    const password = request.nextUrl.searchParams?.get("password");

    if (!username || !password)
      return error("Please specify a name and password");

    // const ok = await register_user(username, password);
    // if(!ok)
    //   return error("Error registering user");
    //

    return NextResponse.json(
      { message: "Created user" },
      { status: HttpStatusCode.Created }
    );
  } catch (ex) {
    return error(`${ex}`);
  }
}
