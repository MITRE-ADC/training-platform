import { deleteAssignmentForUser, getAssignmentsByUser } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { CHECK_UNAUTHORIZED_BY_UID } from "../../auth";


/**
 * Handles the GET request to retrieve assignments for a specific user.
 *
 * @param request - The incoming Next.js request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter, representing the user ID.
 *
 * @returns A `NextResponse` object containing:
 * - A JSON response with the user's assignments and a status of `HttpStatusCode.Ok` (200) if successful.
 * - An error response with a status of `HttpStatusCode.InternalServerError` (500) if an exception occurs.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const data = await getAssignmentsByUser(user_id);
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
 * Handles the DELETE request to remove an assignment for a specific user.
 *
 * @param request - The incoming Next.js request object.
 * @param context - The context object containing route parameters.
 * @param context.params - A promise resolving to an object with the `id` parameter, representing the user ID.
 *
 * @returns A `NextResponse` object containing:
 * - A JSON response with the result of the deletion and a status of `HttpStatusCode.Ok` (200) if successful.
 * - An error response with a status of `HttpStatusCode.BadRequest` (400) if the assignment ID is missing.
 * - An error response with a status of `HttpStatusCode.InternalServerError` (500) if an exception occurs.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
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
