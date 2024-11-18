import { NextRequest, NextResponse } from "next/server";
import { selectUsersSchema, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { error, processCreateUserRequest } from "../../util";

// // GET assignment info
// export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> })
// {
//   try {
//       return NextResponse.json(
//         { data: await getUser((await context.params).id) },
//         { status: HttpStatusCode.Ok }
//       );
//     } catch (ex) {
//       return NextResponse.json(
//         {
//           message: `Error: ${ex}\n`,
//         },
//         {
//           status: HttpStatusCode.InternalServerError,
//         }
//       );
//     }
// }

// Create new user
export async function PUT(request: NextRequest) {
  return await processCreateUserRequest(request);
}
// Modify user data -- detailed
export async function POST(request: NextRequest) {
  try {
    const body = selectUsersSchema.parse(await request.json());

    const exists =
      (await db.selectDistinct().from(users).where(eq(users.id, body.id)))
        .length > 0;

    if (!exists) return processCreateUserRequest(request);

    await db.insert(users).values(body).onConflictDoUpdate({
      target: users.id,
      set: body,
    });

    return NextResponse.json({
      message: `Updated user:\n${JSON.stringify(body)}`,
    });
  } catch (ex) {
    return error(`processing update request failed: ${ex}`);
  }
}
