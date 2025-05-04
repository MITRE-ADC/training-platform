import {
  getAssignmentsByUser,
  updateCourseDueDate,
  userIdExists,
} from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { error } from "../../util";

/* 
  * @description This route is used to get all assignments for a user.
  * @route GET /api/courses/[id]
  * @returns {object} - The list of assignments for the user.
  */
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
      { data: await getAssignmentsByUser(id) }, // Get all assignments for a user
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

/*
  * @description This route is used to update the due date of a course.
  * @route PUT /api/courses/[id]
  * @returns {object} - The updated course object.
  */

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
    // Check if course_id and due_date are provided in the request body, if not return error
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

    // Check if course_id is a valid course ID, if not return error
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
