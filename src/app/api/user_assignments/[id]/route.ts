import { getAssignmentsByUser } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

// GET assignment info
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    return NextResponse.json(
      { data: await getAssignmentsByUser((await context.params).id) },
      { status: HttpStatusCode.Ok }
    );
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
