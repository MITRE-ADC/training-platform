// import {bcyptjs} from "bcryptjs";
import { db } from "@/db/index";
import { accounts, users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const { name, email, password } = await req.json();

    try {
      const user = await db
        .insert(users)
        .values({ name: name, email: email, pass: password });
      return NextResponse.json({ name: name, email: email });
    } catch (error) {
      return NextResponse.json({error: "User Creation Failed"}, {status: 400})
    }
  } else {
    throw new Error("405 (custom) Method Not Allowed");
  }
}
