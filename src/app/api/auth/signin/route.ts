import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import {
  checkUserPassword,
  getUserByEmail,
  getCompleteUserByEmailNoAuth,
  userEmailExists,
} from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import type { User } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { email, password } = await req.json();
    try {
      console.log("\n entering userEmailExists\n");
      const exists = await userEmailExists(email);
      console.log("\npassed userEmailExists\n");
      if (!exists) {
        return NextResponse.json(
          { error: "This Email Has Not Been Registered" },
          { status: HttpStatusCode.BadRequest }
        );
      }

      if (await checkUserPassword(email, password)) {
        const maxAge = 24 * 3600 * 7;
        const user = await getCompleteUserByEmailNoAuth(email); // FLAG: necessary?
        setJwtCookie(user.id, maxAge);

        await cookies();
        const response = NextResponse.json(
          { email: email, isAdmin: email == process.env.ADMIN_USER_EMAIL },
          { status: HttpStatusCode.Ok }
        );

        return response;
      }
      return NextResponse.json(
        { error: "Wrong Password or Username" },
        { status: HttpStatusCode.BadRequest }
      );
    } catch (error) {
      console.log(error);
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
