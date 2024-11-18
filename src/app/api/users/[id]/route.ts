import { NextRequest, NextResponse } from "next/server";
import { selectUsersSchema, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { error, processCreateUserRequest } from "../../util";
import { getUserByEmail } from "@/db/queries";
import { HttpStatusCode } from "axios";

// Get data for a single user -- detailed
export async function GET(request: NextRequest) {
  const user_email = request.nextUrl.searchParams?.get("user_email");
  if (!user_email)
    return NextResponse.json(
      { message: "API Route Error" },
      { status: HttpStatusCode.BadRequest }
    );

  const user = await getUserByEmail(user_email);
  if (users == null) {
    return NextResponse.json(
      { message: "No user with the given email." },
      { status: HttpStatusCode.NotFound }
    );
  }

  return NextResponse.json({ data: user }, { status: HttpStatusCode.Ok });
}

// Create new user
export async function PUT(request: NextRequest) {
  return await processCreateUserRequest(request);
}
// Modify user data -- detailed
export async function POST(request: NextRequest) {

  try{
    const body = selectUsersSchema.parse(await request.json());

    const exists =
      (await db.selectDistinct().from(users).where(eq(users.id, body.id)))
        .length > 0;

    if (!exists) return processCreateUserRequest(request);

    await db.insert(users).values(body).onConflictDoUpdate({
      target: users.id,
      set: body
    });

    return NextResponse.json({message: `Updated user:\n${JSON.stringify(body)}`})
  }
  catch(ex){
    return error(`processing update request failed: ${ex}`)
  }
}
