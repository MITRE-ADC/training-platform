import { assignmentIdExists, getAssignment } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { error } from "../../util";

/*
  * GET /api/assignments/:id
  * @param {number} id - The ID of the assignment to retrieve.
  * @returns {Promise<NextResponse>} - A JSON response containing the assignment data or an error message.
  * @throws {Error} - If the assignment does not exist or if there is an internal server error.
  */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: number }> }
) {
  try {
    const id = (await context.params).id;
    const exists = assignmentIdExists(id);
    if (!exists) return error("Assignment does not exist");

    return NextResponse.json(
      // Return the assignment data as JSON
      { data: await getAssignment(id) },
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
