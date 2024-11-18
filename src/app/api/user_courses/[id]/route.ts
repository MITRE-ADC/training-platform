import { getCoursesByUser } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { CHECK_UNAUTHORIZED } from "@/app/api/auth";

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

      console.log(request.url)
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
