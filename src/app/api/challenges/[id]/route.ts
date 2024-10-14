import { NextRequest, NextResponse } from "next/server";

// GET challenge information
export async function GET(request: NextRequest) {
  await request.json();
  return NextResponse.json({ msg: "Hello from server" });
}
