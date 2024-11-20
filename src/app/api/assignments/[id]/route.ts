import {
  assignmentIdExists,
  deleteAssignmentForUser,
  getAssignment,
  getAssignmentsByUser,
  userIdExists,
} from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { error } from "../../util";
import { CHECK_UNAUTHORIZED } from "../../auth";

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const err = await CHECK_UNAUTHORIZED(user_id);
    if (err) return err;

    const { assignment_id } = await request.json();
    if (!assignment_id) {
      return NextResponse.json(
        {
          error: "Missing Assignment ID",
        },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    return NextResponse.json(
      {
        data: deleteAssignmentForUser(user_id, assignment_id),
      },
      {
        status: HttpStatusCode.Ok,
      }
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
