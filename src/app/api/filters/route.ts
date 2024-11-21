import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import {
  assignments,
  courses,
  users,
  user_assignments,
  user_courses,
} from "@/db/schema";
import { inArray, and, sql } from "drizzle-orm";
import { db } from "@/db";

// Main API endpoint for filtering on admin dash
// example URL: localhost:3000/api/filters?query="John Doe"&course_filters="Course 4,Course3"&status_filters="In Progress"
export async function GET(request: NextRequest) {
  // const search_strings = request.nextUrl.searchParams?.get("search_string")?.split(',') || []; // NOT SURE HOW TO IMPLEMENT
  const course_filter =
    request.nextUrl.searchParams?.get("course_filter")?.split(",") || [];
  const assignment_filter =
    request.nextUrl.searchParams?.get("assignment_filter")?.split(",") || [];
  const status_filter = request.nextUrl.searchParams?.get("status_filter")?.split(',') || [];

  console.log(course_filter);
  console.log(assignment_filter);
  console.log(status_filter);

  let query;
  const conditions = [];
  if (course_filter.length > 0) {
    const courseIds = await db
      .select({ course_id: courses.course_id })
      .from(courses)
      .where(inArray(courses.course_name, course_filter))
      .execute();

    const filteredCourseIds = courseIds.map((row) => row.course_id);
    const userCourses = await db
      .select({ user_id: user_courses.user_id })
      .from(user_courses)
      .where(inArray(user_courses.course_id, filteredCourseIds)) // Users taking any of the specified courses
      .groupBy(user_courses.user_id)
      .having(
        sql`COUNT(DISTINCT ${user_courses.course_id}) = ${filteredCourseIds.length}`
      )
      .execute();

    const filteredUserIdsForCourses = userCourses.map((row) => row.user_id);
    conditions.push(inArray(users.id, filteredUserIdsForCourses));
  }

  if (assignment_filter.length > 0) {
    const assignmentIds = await db
      .select({ assignment_id: assignments.assignment_id })
      .from(assignments)
      .where(inArray(assignments.assignment_name, assignment_filter))
      .execute();

    const filteredAssignmentIds = assignmentIds.map((row) => row.assignment_id);

    const userAssignments = await db
      .select({ user_id: user_assignments.user_id })
      .from(user_assignments)
      .where(inArray(user_assignments.assignment_id, filteredAssignmentIds))
      .groupBy(user_assignments.user_id)
      .having(
        sql`COUNT(DISTINCT ${user_assignments.assignment_id}) = ${filteredAssignmentIds.length}`
      )
      .execute();

    const filteredUserIdsForAssignments = userAssignments.map(
      (row) => row.user_id
    );
    conditions.push(inArray(users.id, filteredUserIdsForAssignments));
  }

  // Implementing the status filter
  if (status_filter.length > 0) {
    const validStatusFilters: ("Not Started" | "In Progress" | "Completed")[] = status_filter as (
        | "Not Started"
        | "In Progress"
        | "Completed"
      )[];

      const userCoursesWithStatus = await db
    .select({
      user_id: user_courses.user_id,
    })
    .from(user_courses) 
    .where(inArray(user_courses.course_status, validStatusFilters))
    .execute();

  const filteredUserIdsForStatus = userCoursesWithStatus.map((row) => row.user_id);
  conditions.push(inArray(users.id, filteredUserIdsForStatus));
  }

  if (conditions.length > 0) {
    query = db
      .select()
      .from(users)
      .where(and(...conditions));
  }

  if (query === undefined) {
    const usersResult = db.select().from(users).execute();
    return NextResponse.json(
      { data: usersResult },
      { status: HttpStatusCode.Ok }
    );
  }

  const usersResult = await query.execute();
  return NextResponse.json(
    { data: usersResult },
    { status: HttpStatusCode.Ok }
  );
}
