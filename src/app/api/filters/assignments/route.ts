import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { user_assignments, assignments, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { assignmentNameExists } from "@/db/queries";

// Get data for all users taking the specified assignment
export async function GET(request: NextRequest) {
  const assignment_name = request.nextUrl.searchParams?.get("assignment_name");
  console.log(assignment_name);

  if (assignment_name === null) {
    return NextResponse.json(
      {
        message: `Error: No assignment param.\n`,
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );
  } else if (!assignmentNameExists(assignment_name)) {
    return NextResponse.json(
      {
        message: `Error: No assignment found.\n`,
      },
      {
        status: HttpStatusCode.NotFound,
      }
    );
  }

  const assignmentResult = await db
    .select({
      assignment_id: assignments.assignment_id,
    })
    .from(assignments)
    .where(eq(assignments.assignment_name, assignment_name))
    .execute();

  if (assignmentResult.length < 1) {
    return NextResponse.json(
      {
        message: `Error: No assignment found.\n`,
      },
      {
        status: HttpStatusCode.NotFound,
      }
    );
  }

  const assignmentId = assignmentResult[0].assignment_id;

  // Get all the user ids
  const userAssignmentsResult = await db
    .select({
      user_id: user_assignments.user_id,
    })
    .from(user_assignments)
    .where(eq(user_assignments.assignment_id, assignmentId))
    .execute();

  const userIds = userAssignmentsResult.map((row) => row.user_id);
  // Get all the rows in the users table
  if (userIds.length === 0) {
    return [];
  }

  const usersResult = await db
    .select()
    .from(users)
    .where(inArray(users.user_id, userIds))
    .execute();

  return NextResponse.json(
    { data: usersResult },
    { status: HttpStatusCode.Ok }
  );
}
