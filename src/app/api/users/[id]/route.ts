import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { locateUser, User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function processCreateUserRequest(request: NextRequest) {
  const user_email = request.nextUrl.searchParams?.get("user_email");
  console.log(user_email);

  // TODO: password: special finagling with auth
  // Pick out (only) initialization data for use
  const user: Pick<User, "email" | "first_name" | "last_name"> =
    (await request.json()) || { email: user_email };
  console.log(user);

  return await db
    .insert(users)
    .values(user)
    .returning()
    .catch(reason =>
      NextResponse.json(
        {
          message: `Error inserting user ${user} into database: \n\t${reason}`,
        },
        { status: HttpStatusCode.InternalServerError }
      )
    )
    .then(user =>
      NextResponse.json(
        { message: `Succesfully inserted: \n\t${user}` },
        { status: HttpStatusCode.Created }
      )
    );
}

// Get data for a single user -- detailed
export async function GET(request: NextRequest) {
  // using email as the primary key
  const user_email = request.nextUrl.searchParams?.get("user_email");
  console.log(user_email);

  return NextResponse.json(
    { message: "Not Implemented" },
    { status: HttpStatusCode.NotImplemented }
  );
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
