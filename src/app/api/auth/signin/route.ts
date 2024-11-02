import { NextResponse } from "next/server";
import { signIn } from "@/db/auth";

//adding a new user to the system
export async function POST(request: Request) {
  // await request.json();
  // return NextResponse.json({ msg: "Hello" });
  return signIn(request);
}
