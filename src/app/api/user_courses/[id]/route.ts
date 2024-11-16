import { getAssignmentsByUser, getCoursesByUser } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

// GET assignment info
export async function GET(request: NextRequest, context: { params: Promise<{ id: number }> }) 
{
  try {
      return NextResponse.json(
        { data: await getCoursesByUser((await context.params).id) },
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
