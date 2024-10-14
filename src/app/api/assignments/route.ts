import { NextRequest, NextResponse } from "next/server";

// GET all assignments info
export async function GET(request: NextRequest) {
  await request.json();
  return NextResponse.json({ msg: "Hello from server" });
}