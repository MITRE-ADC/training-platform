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
import { CHECK_ADMIN } from "@/app/api/auth";

/*
 * @description This route is used to filter users based on course, assignment, and status.
 * @route GET /api/filters
 * @returns {object} - The filtered list of users.
 */
export async function GET(request: NextRequest) {
  if (await CHECK_ADMIN()) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: HttpStatusCode.MethodNotAllowed }
    );
  }
  // Get the filters from the request
  let course_filter =
    request.nextUrl.searchParams
      ?.get("course_filter")
      ?.replaceAll('"', "")
      .split(",") || [];
  let assignment_filter =
    request.nextUrl.searchParams
      ?.get("assignment_filter")
      ?.replaceAll('"', "")
      .split(",") || [];
  let status_filter =
    request.nextUrl.searchParams
      ?.get("status_filter")
      ?.replaceAll('"', "")
      .split(",") || [];

  // if the filter is empty, set it to an empty array
  if (course_filter.length == 1 && course_filter[0].length == 0)
    course_filter = [];
  if (assignment_filter.length == 1 && assignment_filter[0].length == 0)
    assignment_filter = [];
  if (status_filter.length == 1 && status_filter[0].length == 0)
    status_filter = [];

  let query;
  const conditions = [];

  // If course_filter is not empty, filter users based on courses
  if (course_filter.length > 0) {
    const courseIds = await db
      .select({ course_id: courses.course_id })
      .from(courses)
      .where(inArray(courses.course_name, course_filter))
      .execute();

    // Find the course IDs of the specified courses
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
    // Get the user IDs of users taking all specified courses
    const filteredUserIdsForCourses = userCourses.map((row) => row.user_id);
    // Add the condition to filter users based on the filtered user IDs
    conditions.push(inArray(users.id, filteredUserIdsForCourses));
  }

  // If assignment_filter is not empty, filter users based on assignments
  if (assignment_filter.length > 0) {
    const assignmentIds = await db
      .select({ assignment_id: assignments.assignment_id })
      .from(assignments)
      .where(inArray(assignments.assignment_name, assignment_filter))
      .execute();

    // Find the assignment IDs of the specified assignments
    const filteredAssignmentIds = assignmentIds.map((row) => row.assignment_id);
    // Get the user IDs of users who have all specified assignments
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
    // Add the condition to filter users based on the filtered user IDs
    conditions.push(inArray(users.id, filteredUserIdsForAssignments));
  }

  // Implementing the status filter
  if (status_filter.length > 0) {
    const validStatusFilters: ("Not Started" | "In Progress" | "Completed")[] =
      status_filter as ("Not Started" | "In Progress" | "Completed")[];

    // Get the user IDs of users who have the specified status
    const userCoursesWithStatus = await db
      .select({
        user_id: user_courses.user_id,
      })
      .from(user_courses)
      .where(inArray(user_courses.course_status, validStatusFilters))
      .execute();

    const filteredUserIdsForStatus = userCoursesWithStatus.map(
      (row) => row.user_id
    );
    conditions.push(inArray(users.id, filteredUserIdsForStatus));
  }

  // If there are conditions, create the query with the conditions
  if (conditions.length > 0) {
    query = db
      .select()
      .from(users)
      .where(and(...conditions));
  }

  // If no filters are provided, return all users
  if (query === undefined) {
    const usersResult = db.select().from(users).execute();
    return NextResponse.json(
      { data: usersResult },
      { status: HttpStatusCode.Ok }
    );
  }

  // Execute the query and return the filtered users
  const usersResult = await query.execute();
  return NextResponse.json(
    { data: usersResult },
    { status: HttpStatusCode.Ok }
  );
}
