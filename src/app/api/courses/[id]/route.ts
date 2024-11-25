import {
  getAssignmentsByUser,
  updateCourseDueDate,
  userIdExists,
} from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { error } from "../../util";

// GET assignment info
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await context.params).id;
    const exists = await userIdExists(id);
    if (exists instanceof NextResponse) return exists;
    if (!exists) {
      return error("User does not exist");
    }

    return NextResponse.json(
      { data: await getAssignmentsByUser(id) },
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await context.params).id;
    const exists = await userIdExists(id);
    if (exists instanceof NextResponse) return exists;
    if (!exists) {
      return error("User does not exist");
    }
    const { course_id, due_date } = await request.json();
    if (!course_id || !due_date) {
      return NextResponse.json(
        {
          error: "Missing Course ID or Due Date field",
        },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    return NextResponse.json(
      {
        data: updateCourseDueDate(course_id, new Date(due_date)),
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
