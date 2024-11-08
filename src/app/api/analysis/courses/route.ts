import { aggregateUserCoursesStatusByUser } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

// return number of completed/in progress/not started for every user
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { data: await aggregateUserCoursesStatusByUser() },
    { status: HttpStatusCode.Ok }
  );
}
