import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

import { processCreateUserRequest } from "../util";
import { getAllUsers } from "@/db/queries";

export async function GET() {
  try {
    const result = await getAllUsers();
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ data: result }, { status: HttpStatusCode.Ok });
  } catch (ex) {
    return NextResponse.json(
      {
        message: `Error: ${ex}\n`,
      },
      {
        status: HttpStatusCode.InternalServerError,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  return await processCreateUserRequest(request);
}
