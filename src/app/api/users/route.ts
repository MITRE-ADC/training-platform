import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

import { processCreateUserRequest } from "../util";
import { getAllUsers } from "@/db/queries";

export async function GET() {
  try {
    let result = await getAllUsers();
    if (result instanceof NextResponse) return result;

    result = result.filter((x) => x.email != process.env.ADMIN_USER_EMAIL);

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
