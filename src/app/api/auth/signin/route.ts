import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import {
  checkUserPassword,
  getCompleteUserByEmailNoAuth,
  userEmailExists,
} from "@/db/queries";
import { setJwtCookie, setWebGoatCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import { login_user } from "@/app/api/webgoat/util";

/*
  This route handles the login process for users. It checks if the user exists
  and if the password is correct. If both are valid, it sets the JWT and WebGoat
  cookies for the user.

  @param {Request} req - The request object containing the user's email and password.
  @returns {NextResponse} - A response object indicating success or failure.
*/

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { email, password } = await req.json();
    try {
      const exists = await userEmailExists(email);
      if (!exists) {
        return NextResponse.json(
          { error: "This Email Has Not Been Registered" },
          { status: HttpStatusCode.BadRequest }
        );
      }

      if (await checkUserPassword(email, password)) {
        const maxAge = 24 * 3600 * 7;
        const user = await getCompleteUserByEmailNoAuth(email);

        // Need to log the user into WebGoat here and then store the WG cookie
        const { cookie: webgoat_cookie, response: response2 } =
          await login_user(user.webgoatusername, user.webgoatpassword);
        const jsessionId = webgoat_cookie.split(";")[0]; // Just the "JSESSIONID=..."
        await setWebGoatCookie(jsessionId, maxAge);
        await setJwtCookie(user.id, maxAge);
        const isAdmin = email == process.env.ADMIN_USER_EMAIL
        await cookies();
        const response = NextResponse.json(
          { email: email, isAdmin: isAdmin },
          { status: HttpStatusCode.Ok }
        );

        return response;
      }
      return NextResponse.json(
        { error: "Wrong Password or Username" },
        { status: HttpStatusCode.BadRequest }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "User Creation Failed" },
        { status: HttpStatusCode.BadRequest }
      );
    }
  } else {
    return NextResponse.json(
      { error: "405 (custom) Method Not Allowed" },
      { status: HttpStatusCode.MethodNotAllowed }
    );
  }
}
