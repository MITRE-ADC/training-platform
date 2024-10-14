import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

// GET method for a single training
export async function GET(request: NextRequest) {
  console.log(request.body);

  return NextResponse.json(
    { message: "Not Implemented" },
    { status: HttpStatusCode.NotImplemented }
  );
}
