import { db } from "@/db/index";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getUserIDByEmailNoAuth, userEmailExists } from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import type { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

/*
 * POST /api/auth/signup
 * @description This route is used to sign up a new user by creating a new user in the database and setting a JWT cookie.
 * @returns {NextResponse} - A JSON response indicating the success or failure of the signup operation.
 */
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
      // Generate a random alphanumeric string of a given length
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

      // Collision checking for webgoat username
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

      // Hashing the password
      const hashedpassword = await bcrypt.hash(password, 10);

      // Inserting the new user and generated wg username and password
      await db.insert(users).values({
        name: name,
        email: email,
        pass: hashedpassword,
        webgoatusername: webgoatusername,
        webgoatpassword: webgoatpassword,
      });

      const user = (await getUserIDByEmailNoAuth(email)) as User;

      const maxAge = 24 * 3600 * 7;
      setJwtCookie(user.id, maxAge);

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
