import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { processLinkCourseRequest } from "../util";
import { getAllUserCourses } from "@/db/queries";

/*
* Handles the GET request to retrieve all user courses.
*
* @returns A `NextResponse` object containing the user courses data in JSON format with an HTTP status of 200 (OK),
*          or an error response in case of failure.
*/
export async function GET() {
  try {
    const res = await getAllUserCourses();
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

/*
* Handles the POST request to link a course to a user.
*
* @param request - The incoming HTTP request object.
*
* @returns A `NextResponse` object containing the linked course data in JSON format with an HTTP status of 201 (Created),
*          or an error response in case of failure.
*/
export async function POST(request: NextRequest) {
  return processLinkCourseRequest(request);
}
