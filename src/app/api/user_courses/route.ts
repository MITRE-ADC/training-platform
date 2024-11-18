import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { processLinkCourseRequest } from "../util";
import { getAllUserCourses } from "@/db/queries";

// Get data for a single user -- detailed
export async function GET() {
  try {
      const res = await getAllUserCourses()
      if(res)
        return res;

    return NextResponse.json(
      { data: res },
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

//// Create new user
//export async function PUT(request: NextRequest) {
//  return await processLinkCourseRequest(request);
//}
//
// Modify user data -- detailed
export async function POST(request: NextRequest) {
  return processLinkCourseRequest(request);
}
