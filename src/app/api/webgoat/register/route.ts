import { NextRequest, NextResponse } from "next/server";
import { error } from "../../util";
import { HttpStatusCode } from "axios";
import { register_user } from "../util";
import { CHECK_SESSION } from "../../auth";
import { getUserByEmail } from "@/db/queries";
import type { User } from "@/db/schema";

/**
 * Updates data in the DB for a user's progress
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  if (request.method == "POST") {
      try {
      const err2 = await CHECK_SESSION();
      if (err2) return err2;
      console.log("Registering user in webgoat");
      // const webgoat_username = request.nextUrl.searchParams?.get("name");
      // const webgoat_password = request.nextUrl.searchParams?.get("password");
      // console.log(webgoat_username);
      // console.log(webgoat_password);
      // const email = request.nextUrl.searchParams?.get("email")
      // console.log(request.nextUrl);
      // console.log(email);
      const { email } = await request.json();
      console.log(email);
      // if (!webgoat_username || !webgoat_password)
      //   return error("Please specify a name and password");
      if (!email) {
        return error("Please specify an email.")
      }
      const user = (await getUserByEmail(email)) as User;

      const webgoat_username = user.webgoatusername;
      const webgoat_password = user.webgoatpassword;

      console.log("\nwebgoat_username, webgoat_password: \n")
      console.log(webgoat_username);
      console.log(webgoat_password);

      console.log("entering register_user")
      const err = await register_user(webgoat_username, webgoat_password);
      console.log("exiting register_user")
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
  } else {
    return NextResponse.json(
      { error: "405 (custom) Method Not Allowed" },
      { status: HttpStatusCode.MethodNotAllowed }
    );
  }
}
