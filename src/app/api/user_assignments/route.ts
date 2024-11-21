import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getAllUserAssignments } from "@/db/queries";
import { processLinkAssignmentRequest } from "../util";
import { CHECK_ADMIN } from "../auth";

// GET method for all trainings
export async function GET() {
  try {
    const data = await getAllUserAssignments();
    if (data instanceof NextResponse) return data;

    return NextResponse.json({ data: data }, { status: HttpStatusCode.Ok });
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
  return processLinkAssignmentRequest(request);
}
