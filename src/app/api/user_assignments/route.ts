import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getAllUserAssignments } from "@/db/queries";

// GET method for all trainings
export async function GET() {
  try {
    return NextResponse.json(
      { data: await getAllUserAssignments() },
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
