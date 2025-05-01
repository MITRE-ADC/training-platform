import { NextRequest, NextResponse } from "next/server";
import { error } from "../../util";
import { HttpStatusCode } from "axios";
import { register_user } from "../util";
import { CHECK_SESSION } from "../../auth";
import { getUserByEmail } from "@/db/queries";
import type { User } from "@/db/schema";

/*
* @swagger
* /api/webgoat/register:
*   post:
*     summary: Register a user in WebGoat
*     description: Register a user in WebGoat with the provided email.
*     tags:
*       - webgoat
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*                 description: The email of the user to register.
*     responses:
*       201:
*         description: User registered successfully.
*       400:
*         description: Bad Request. Missing or invalid parameters.
*/
export async function POST(request: NextRequest) {
  if (request.method == "POST") {
    try {
      const err2 = await CHECK_SESSION();
      if (err2) return err2;

      const { email } = await request.json();

      if (!email) {
        return error("Please specify an email.");
      }
      const user = (await getUserByEmail(email)) as User;

      const webgoat_username = user.webgoatusername;
      const webgoat_password = user.webgoatpassword;

      const err = await register_user(webgoat_username, webgoat_password);
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
