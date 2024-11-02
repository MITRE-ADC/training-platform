import { NextRequest, NextResponse } from "next/server";

// GET all assignments info
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { data: { body: "Hello from server" } },
    { status: 200 }
  );
}
