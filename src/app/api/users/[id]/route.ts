import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { locateUser, User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { processCreateUserRequest } from "../../util";

// // GET assignment info
// export async function GET(request: NextRequest, context: { params: Promise<{ id: number }> }) 
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
  const user_email = request.nextUrl.searchParams?.get("user_email");
  console.log(user_email);

  const body: User = await request.json();
  console.log(body);

  const exists =
    (await db.selectDistinct().from(users).where(eq(users.email, body.email)))
      .length > 0;

  if (!exists) return processCreateUserRequest(request);

  db.update(users).set(body).where(locateUser(body));
}
