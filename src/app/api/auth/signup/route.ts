// import {bcyptjs} from "bcryptjs";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getUserByEmail, userEmailExists } from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import type { User } from "@/db/schema";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const { name, email, password } = await req.json();

    try {
      const x = await userEmailExists(email);
      if (x) {
        return NextResponse.json(
          { error: "This Email Has Already Been Registered" },
          { status: HttpStatusCode.BadRequest }
        );
      }

      await db
        .insert(users)
        .values({
          name: name,
          email: email,
          pass: password,
          webgoatusername: name.replaceAll(" ", "").toLowerCase(),
          webgoatpassword: password,
        });

      // await addUser({name: name, email: email, pass: password});
      const exists = await userEmailExists(email);
      if (exists) {
        const user = (await getUserByEmail(email)) as User;
        const maxAge = 24 * 3600 * 7;
        setJwtCookie(user.id, maxAge);
      }

      await cookies();
      return NextResponse.json(
        { name: name, email: email },
        { status: HttpStatusCode.Ok }
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
