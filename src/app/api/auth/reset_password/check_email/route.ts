import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { userEmailExistsNoAuth, addCode } from "@/db/queries";

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
