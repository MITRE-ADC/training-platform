import { getAllCourses } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

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
