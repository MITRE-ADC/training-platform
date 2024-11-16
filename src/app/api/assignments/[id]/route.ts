import { getAssignmentsByUser, userIdExists } from "@/db/queries";
import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { error } from "../../util";

// GET assignment info
export async function GET(context: { params: Promise<{ id: string }> }) 
{
  try {
    const id = (await context.params).id
    if(!userIdExists(id))
      return error("User does not exist")
    
      return NextResponse.json(
        { data: await getAssignmentsByUser(id) },
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
