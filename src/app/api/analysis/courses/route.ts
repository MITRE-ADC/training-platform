import { aggregateUserCoursesStatusByUser } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

// return number of completed/in progress/not started for every user
export async function GET() {
  return NextResponse.json(
    { data: await aggregateUserCoursesStatusByUser() },
    { status: HttpStatusCode.Ok }
  );
}
