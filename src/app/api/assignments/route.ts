import { getAllAssignments } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { processCreateAssignmentRequest } from "../util";

export async function GET() {
  try {
    return NextResponse.json(
      { data: await getAllAssignments() },
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

export async function POST(request: NextRequest) {
  return processCreateAssignmentRequest(request);
}
