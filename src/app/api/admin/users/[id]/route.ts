import { NextResponse } from "next/server";

// GET user information
export async function GET(request: Request) {
  await request.json();
  return NextResponse.json({ msg: "Hello from server" });
}
