import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { user_courses, courses, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { courseNameExists } from "@/db/queries";

// Get data for all users taking the specified assignment
export async function GET(request: NextRequest) {
  const course_name = request.nextUrl.searchParams?.get("course_name");
  console.log(course_name);

  if (course_name === null || !courseNameExists(course_name)) {
    return NextResponse.json(
      {
        message: `Error: No course found.\n`,
      },
      {
        status: HttpStatusCode.NotFound,
      }
    );
  }

  const courseResult = await db
    .select({
      course_id: courses.course_id,
    })
    .from(courses)
    .where(eq(courses.course_name, course_name))
    .execute();

  if (courseResult.length < 1) {
    return NextResponse.json(
      {
        message: `Error: No course found.\n`,
      },
      {
        status: HttpStatusCode.NotFound,
      }
    );
  }

  const courseId = courseResult[0].course_id;

  // Get all the user ids
  const userCoursesResult = await db
    .select({
      user_id: user_courses.user_id,
    })
    .from(user_courses)
    .where(eq(user_courses.course_id, courseId))
    .execute();

  const userIds = userCoursesResult.map((row) => row.user_id);
  // Get all the rows in the users table
  if (userIds.length === 0) {
    return [];
  }

  const usersResult = await db
    .select()
    .from(users)
    .where(inArray(users.user_id, userIds))
    .execute();

  return NextResponse.json(
    { data: usersResult },
    { status: HttpStatusCode.Ok }
  );
}
