import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { processLinkCourseRequest } from "../util";
import { getAllUserCourses } from "@/db/queries";
import { CHECK_ADMIN } from "../auth";

// Get data for a single user -- detailed
export async function GET() {
  try {
      const err = await CHECK_ADMIN()
      if(err)
        return err;

    return NextResponse.json(
      { data: await getAllUserCourses() },
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
