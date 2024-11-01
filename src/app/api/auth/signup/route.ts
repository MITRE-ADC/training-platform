// import {bcyptjs} from "bcryptjs";
import { db } from "@/db/index";
import { accounts, users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const { name, email, password } = await req.json();
    // const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await db
        .insert(users)
        .values({ name: name, email: email, pass: password });
      return NextResponse.json({ user: user });
    } catch (error) {
      // res.status(500).json({ error: "User creation failed" });
      console.log(error);
      throw new Error("User creation failed");
    }
  } else {
    // res.status(405).end(); // Method Not Allowed
    throw new Error("405 Fail");
  }
}
