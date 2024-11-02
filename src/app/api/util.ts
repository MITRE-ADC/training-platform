import { db } from "@/db";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { User_Course, users, user_courses } from "@/db/schema";
import { userExists, courseExists } from "@/db/queries";

export async function processLinkCourseRequest(request: NextRequest) {
  const user_id = request.nextUrl.searchParams?.get("user_id");
  const course_id = request.nextUrl.searchParams?.get("course_id");

  const body: User_Course = await request.json();
  let _user_id = -1;
  if (user_id == null) _user_id = body.user_id;
  else _user_id = parseInt(user_id);

  let _course_id = -1;
  if (course_id == null) _course_id = body.course_id;
  else _course_id = parseInt(course_id);

  // TODO: password: special finagling with auth
  // Pick out (only) initialization data for use
  if (_user_id == -1 || !userExists(_user_id))
    return NextResponse.json(
      {
        message: `Error: user not found`,
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  // TODO: password: special finagling with auth
  // Pick out (only) initialization data for use
  if (_course_id == -1 || !courseExists(_course_id))
    return NextResponse.json(
      {
        message: `Error: user not found`,
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  body.user_id = _user_id;
  body.course_id = _course_id;

  return await db
    .insert(user_courses)
    .values(body)
    .returning()
    .catch((reason) =>
      NextResponse.json(
        {
          message: `Error inserting ${body} into database: \n\t${reason}`,
        },
        { status: HttpStatusCode.InternalServerError }
      )
    )
    .then((result) =>
      NextResponse.json(
        { message: `Succesfully inserted: \n\t${result}` },
        { status: HttpStatusCode.Created }
      )
    );
}

export async function processCreateUserRequest(request: NextRequest) {
  const user_name = request.nextUrl.searchParams?.get("user_name");
  const user_email = request.nextUrl.searchParams?.get("user_email");
  const password_hash = request.nextUrl.searchParams?.get("pass");

  if (!user_name)
    return NextResponse.json(
      {
        error:
          "Please provide query paramater user_name for the created account\n",
      },
      { status: HttpStatusCode.BadRequest }
    );

  if (!user_email)
    return NextResponse.json(
      {
        error:
          "Please provide query parameter user_email for the created account\n",
      },
      { status: HttpStatusCode.BadRequest }
    );

  if (!password_hash)
    return NextResponse.json(
      {
        error:
          "Please provide a hashed password as query paramter pass to associate with the created account\n",
      },
      { status: HttpStatusCode.BadRequest }
    );

  // TODO: password: special finagling with auth
  // Pick out (only) initialization data for use

  return await db
    .insert(users)
    .values({
      name: user_name,
      email: user_email,
      pass: password_hash,
    })
    .returning()
    .catch((reason) =>
      NextResponse.json(
        {
          error: `Error inserting user into database: \n\t${reason}`,
        },
        { status: HttpStatusCode.InternalServerError }
      )
    )
    .then((user) =>
      NextResponse.json(
        { message: `Succesfully inserted: \n\t${user}` },
        { status: HttpStatusCode.Created }
      )
    );
}
