import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { userEmailExistsNoAuth, addCode } from "@/db/queries";

/**
 * Handles the POST request for the reset password functionality.
 *
 * This function validates the provided email address, checks if it exists in the database,
 * generates a 6-digit verification code, and stores it along with its expiration time.
 * If the email does not exist or any error occurs during the process, an appropriate
 * error response is returned.
 *
 * @param req - The incoming HTTP request object.
 * @returns A JSON response indicating the result of the operation:
 * - If the email does not exist: `{ error: "Email Not Found" }` with a 404 status.
 * - If the code generation or database operation fails: `{ error: "Code Generation Failed" }` with a 400 status.
 * - If the email validation fails: `{ error: "Email Validation Failed" }` with a 400 status.
 * - If the method is not POST: `{ error: "405 (custom) Method Not Allowed" }` with a 405 status.
 * - On success: A response with a 200 status.
 */
export async function POST(req: Request) {
  if (req.method == "POST") {
    const { email } = await req.json();
    try {
      const exists = await userEmailExistsNoAuth(email);
      if (!exists) {
        return NextResponse.json(
          { error: "Email Not Found" },
          { status: HttpStatusCode.NotFound }
        );
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const now = new Date();
      const expiration_time = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      try {
        await addCode({
          code: code,
          user_email: email,
          expiration_time: expiration_time,
        });
      } catch (error) {
        return NextResponse.json(
          { error: "Code Generation Failed " },
          { status: HttpStatusCode.BadRequest }
        );
      }

      const response = NextResponse.json({ status: HttpStatusCode.Ok });

      return response;
    } catch (error) {
      return NextResponse.json(
        { error: "Email Validation Failed" },
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
