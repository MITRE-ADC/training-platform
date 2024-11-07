import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { locateUser, User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { processCreateUserRequest } from "../../util";
import { getUserByEmail } from "@/db/queries";

// Get data for a single user -- detailed
export async function GET(request: NextRequest) {
  const user_email = request.nextUrl.searchParams?.get("user_email");
  if (!user_email)
    return NextResponse.json(
      { message: "API Route Error" },
      { status: HttpStatusCode.BadRequest }
    );

  const users = await getUserByEmail(user_email);
  if (users.length == 0) {
    return NextResponse.json(
      { message: "No user with the given email." },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json({ data: users[0] }, { status: HttpStatusCode.Ok });
}

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
