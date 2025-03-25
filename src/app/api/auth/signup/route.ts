import { db } from "@/db/index";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import {
  getUserByEmail,
  getUserIDByEmailUnsecure,
  userEmailExists,
} from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import type { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hash } from "bcrypt-ts";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const { name, email, password } = await req.json();

    // console.log("Beginning of api/auth/signup");
    // console.log(name);
    // console.log(email);
    // console.log(password);

    try {
      const x = await userEmailExists(email);
      if (x) {
        return NextResponse.json(
          { error: "This Email Has Already Been Registered" },
          { status: HttpStatusCode.BadRequest }
        );
      }

      function generateRandom(length: number) {
        return randomBytes(length)
          .toString("base64url")
          .toLowerCase()
          .replace("_", "-")
          .slice(0, length);
      }

      // Generating a random alphanumeric username between 10-13 characters
      let webgoatusername = generateRandom(Math.floor(Math.random() * 4) + 10);
      let existingUser = await db
        .select()
        .from(users)
        .where(eq(users.webgoatusername, webgoatusername))
        .limit(1);
      // console.log("generated random");

      // Collision checking for username
      while (existingUser.length > 0) {
        webgoatusername = generateRandom(Math.floor(Math.random() * 4) + 10);
        existingUser = await db
          .select()
          .from(users)
          .where(eq(users.webgoatusername, webgoatusername))
          .limit(1);
      }

      // Generating a random alphanumeric username between 6-10 characters
      const webgoatpassword = generateRandom(Math.floor(Math.random() * 5) + 6);

      // To-do: must salt and hash user and password

      // Inserting the new user and generated wg username and password
      await db.insert(users).values({
        name: name,
        email: email,
        pass: password,
        webgoatusername: webgoatusername,
        webgoatpassword: webgoatpassword,
      });
      // console.log("inserted user entry into database");

      // await addUser({name: name, email: email, pass: password});
      // const exists = await userEmailExists(email);
      // if (exists) {
      //   const user = (await getUserByEmail(email)) as User;
      //   console.log("passed getuserbyemail");
      //   console.log(user);
      //   const maxAge = 24 * 3600 * 7;
      //   setJwtCookie(user.id, maxAge);
      // }

      // const exists = await userEmailExists(email);
      // if (exists) {
      const user = (await getUserIDByEmailUnsecure(email)) as User;
      // console.log("passed getuserbyemail");
      // console.log(user);
      // console.log("userId: ")
      // console.log(user.id);
      const maxAge = 24 * 3600 * 7;
      setJwtCookie(user.id, maxAge);
      // }

      await cookies();
      // console.log("we are gucci");
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
