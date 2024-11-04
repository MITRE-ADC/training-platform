import { getAllCourses } from "@/db/queries";
import { processCreateCourseRequest } from "@/app/api/util";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

// GET assignment info
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

export async function POST(request: NextRequest) {
  return await processCreateCourseRequest(request);
}
