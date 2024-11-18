import { getAssignmentsByUser } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { CHECK_UNAUTHORIZED } from "../../auth";

// GET assignment info
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
      const user_id = (await context.params).id
      const err = await CHECK_UNAUTHORIZED(user_id)
      if(err)
        return err;

      return NextResponse.json(
        { data: await getAssignmentsByUser((await context.params).id) },
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
