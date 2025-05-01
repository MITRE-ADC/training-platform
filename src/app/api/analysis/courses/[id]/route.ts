import { aggregateUserCoursesStatusForUser } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

// return number of completed/in progress/not started for every user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const id = (await context.params).id;
  const res = await aggregateUserCoursesStatusForUser(id);

  return NextResponse.json({ data: res }, { status: HttpStatusCode.Ok });
}
