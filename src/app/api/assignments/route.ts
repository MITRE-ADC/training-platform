import { getAllAssignments } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { processCreateAssignmentRequest } from "../util";

/*
 * GET /api/assignments
 * @returns {Promise<NextResponse>} - A JSON response containing all assignments or an error message.
 * @throws {Error} - If there is an internal server error.
 * @description This function handles the GET request to retrieve all assignments from the database.
 * It returns a JSON response with the assignment data or an error message if an exception occurs.
 */

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
