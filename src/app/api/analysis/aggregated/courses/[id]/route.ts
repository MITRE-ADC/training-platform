import { aggregateUserCoursesAssignmentsForUser } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const id = (await context.params).id;
  const res = await aggregateUserCoursesAssignmentsForUser(id);

  return NextResponse.json({ data: res }, { status: HttpStatusCode.Ok });
}
