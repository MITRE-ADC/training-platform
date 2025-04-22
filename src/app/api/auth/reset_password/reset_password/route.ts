import { getCode, updateUserPassword } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  if (req.method == "POST") {
    const { email, code, password } = await req.json();
    try {
      // Verifying that the code matches the most recent code in the database.
      const fetchedCode = await getCode(email);
      if (fetchedCode.code != code) {
        return NextResponse.json(
          { error: "Incorrect code. Contact your admin to get the code." },
          { status: HttpStatusCode.BadRequest }
        );
      }

      // Checking that the code is not expired.
      const now = new Date();
      if (fetchedCode.expiration_time < now) {
        //The expired date is in the past.
        return NextResponse.json(
          {
            error:
              "The code is expired. Go back to the previous page to regenerate a new code.",
          },
          { status: HttpStatusCode.UnprocessableEntity }
        );
      }

      // Updating the password in the database.
      try {
        // Hashing the password.
        const hashedpassword = await bcrypt.hash(password, 10);

        await updateUserPassword(email, hashedpassword);
      } catch (error) {
        return NextResponse.json(
          { error: "Error While Trying to Reset Password" },
          { status: HttpStatusCode.InternalServerError }
        );
      }

      const response = NextResponse.json({ status: HttpStatusCode.Ok });

      return response;
    } catch (error) {
      return NextResponse.json(
        { error: "Reset Password Failed" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  } else {
    return NextResponse.json(
      { error: "405 (custom) Method Not Allowed" },
      { status: HttpStatusCode.MethodNotAllowed }
    );
  }
}
