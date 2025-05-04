import { getAllCourses } from "@/db/queries";
import { processCreateCourseRequest } from "@/app/api/util";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

/*
 * @description This route is used to get all courses and create a new course.
 * @route GET /api/courses
 * @route POST /api/courses
 * @returns {object} - The list of courses or the created course object.
 */
export async function GET() {
  try {
    return NextResponse.json(
      { data: await getAllCourses() },
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
 * @description This route is used to create a new course.
 * @route POST /api/courses
 * @returns {object} - The created course object.
 */
export async function POST(request: NextRequest) {
  return await processCreateCourseRequest(request);
}
