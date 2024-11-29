import {
  assignmentIdExists,
  deleteAssignmentForUser,
  getAssignment,
  userIdExists,
} from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { error } from "../../util";

// GET assignment info
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: number }> }
) {
  try {
    console.log(request);
    const id = (await context.params).id;
    const exists = assignmentIdExists(id);
    if (!exists) return error("Assignment does not exist");

    return NextResponse.json(
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
