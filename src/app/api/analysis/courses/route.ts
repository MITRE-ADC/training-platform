import { aggregateUserCoursesStatusByUser } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

// return number of completed/in progress/not started for every user
export async function GET() {
  const res = await aggregateUserCoursesStatusByUser();

  return NextResponse.json({ data: res }, { status: HttpStatusCode.Ok });
}