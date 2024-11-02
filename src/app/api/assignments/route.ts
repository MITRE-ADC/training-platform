import { getAllAssignments } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

// GET all assignments info
export async function GET() {
  try {
    return NextResponse.json(
      { data: await getAllAssignments() },
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
