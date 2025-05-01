import {
  deleteCourseForUser,
  getCoursesByUser,
  updateUserCourseDueDate,
  userIdExists,
} from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { CHECK_ADMIN, CHECK_UNAUTHORIZED } from "@/app/api/auth";
import { error, processLinkCourse } from "../../util";
import { AddUserCourse } from "@/db/schema";

/**
 * Handles the GET request to retrieve courses for a user by ID.
 *
 * @param request - The incoming HTTP request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter.
 *
 * @returns A `NextResponse` object containing the user courses data in JSON format with an HTTP status of 200 (OK),
 *          or an error response in case of failure.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const res = await getCoursesByUser((await context.params).id);
    if (res instanceof NextResponse) return res;

    return NextResponse.json({ data: res }, { status: HttpStatusCode.Ok });
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
 * Handles the POST request to link a course to a user.
 *
 * @param request - The incoming HTTP request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter.
 *
 * @returns A `NextResponse` object containing the linked course data in JSON format with an HTTP status of 201 (Created),
 *          or an error response in case of failure.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Check if the user is authorized to link a course
  const user_id = (await context.params).id;
  const err = await CHECK_ADMIN();
  if (err) return err;

  const course_id = request.nextUrl.searchParams?.get("course_id");
  const assigned_date = request.nextUrl.searchParams?.get("assigned_date");
  const due_date = request.nextUrl.searchParams?.get("assigned_date");
  let body: AddUserCourse | undefined = undefined;

  try {
    const json = await request.json();
    body = json;
  } catch (ex) {
    console.log(`Error reading request body: ${ex}`);
  }

  // Check if user_id and course_id are provided in the request body or parameters
  if ((!user_id || !course_id) && (!body || !body.user_id || !body.course_id))
    return error(
      `Request requires user_id and course_id in body or request parameters`
    );

  // Check if the parameters exist in the request body, and if not, use the values from the request parameters
  const _user_id = body?.user_id ?? user_id!;
  const _course_id = body?.course_id ?? parseInt(course_id!);
  const _assigned_date =
    body?.assigned_date ??
    ((assigned_date && new Date(assigned_date!)) || new Date());
  const _due_date =
    body?.due_date ?? ((due_date && new Date(due_date!)) || new Date());

  return processLinkCourse({
    assigned_date: _assigned_date,
    course_id: _course_id,
    course_status: "Not Started",
    due_date: _due_date,
    user_id: _user_id,
  });
}

/**
 * Handles the DELETE request to unassign a course from a user.
 *
 * @param request - The incoming HTTP request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter.
 *
 * @returns A `NextResponse` object containing the unassigned course data in JSON format with an HTTP status of 200 (OK),
 *          or an error response in case of failure.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check if the user is authorized to unassign a course
    const user_id = (await context.params).id;
    const err = await CHECK_ADMIN();
    if (err) return err;

    const { course_id } = await request.json();
    if (!course_id) {
      return NextResponse.json(
        {
          error: "Missing Course ID",
        },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    return NextResponse.json(
      {
        data: deleteCourseForUser(user_id, course_id),
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

/**
 * Handles the PUT request to update a user's course due date.
 *
 * @param request - The incoming HTTP request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter.
 *
 * @returns A `NextResponse` object containing the updated course data in JSON format with an HTTP status of 200 (OK),
 *          or an error response in case of failure.
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
        data: updateUserCourseDueDate(id, course_id, new Date(due_date)),
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
