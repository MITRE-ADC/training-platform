import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getAllUserAssignments } from "@/db/queries";
import { processLinkAssignmentRequest } from "../util";

/**
 * Handles the GET request to retrieve all user assignments.
 *
 * @returns A `NextResponse` object containing the user assignments data in JSON format with an HTTP status of 200 (OK),
 *          or an error response in case of failure.
 */
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

/**
 * Handles the POST request to link an assignment to a user.
 *
 * @param request - The incoming HTTP request object.
 *
 * @returns A `NextResponse` object containing the linked assignment data in JSON format with an HTTP status of 201 (Created),
 *          or an error response in case of failure.
 */
export async function POST(request: NextRequest) {
  return processLinkAssignmentRequest(request);
}
