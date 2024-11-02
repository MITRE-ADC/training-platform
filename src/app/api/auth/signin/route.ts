import { NextResponse } from "next/server";
import { signIn } from "@/db/auth";
import { HttpStatusCode } from "axios";

// adding a new user to the system
export async function POST(request: Request) {
  console.log(signIn);
  return NextResponse.json({message: "placeholder"}, {status: HttpStatusCode.Ok});
}
