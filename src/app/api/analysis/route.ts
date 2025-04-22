import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await request.json();
  return NextResponse.json({ msg: "Placeholder" });
}