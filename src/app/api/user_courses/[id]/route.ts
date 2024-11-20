import { deleteCourseForUser, getCoursesByUser } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { CHECK_UNAUTHORIZED } from "@/app/api/auth";

// GET assignment info
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const err = await CHECK_UNAUTHORIZED(user_id);
    if (err) return err;
    const res = await getCoursesByUser((await context.params).id);
    if (res instanceof NextResponse) return res;

    console.log(request.url);
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = (await context.params).id;
    const err = await CHECK_UNAUTHORIZED(user_id);
    if (err) return err;
    const res = await getCoursesByUser((await context.params).id);
    if (res instanceof NextResponse) return res;

    const { course_id } = await request.json();
    if (!course_id) {
      return NextResponse.json({
        error: "Missing Course ID"
      }, {
        status: HttpStatusCode.BadRequest
      });
    }

    return NextResponse.json(
      {
        data: deleteCourseForUser(user_id, course_id)
      }, {
        status: HttpStatusCode.Ok
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