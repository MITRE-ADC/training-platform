import { db } from "@/db";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  // User_Course,
  users,
  // user_courses,
  User,
  AddUserCourse,
  AddCourse,
  AddAssignment,
  AddUserAssignment,
} from "@/db/schema";
import {
  courseNameExists,
  userIdExists,
  addUserCourse,
  addCourse,
  courseIdExists,
  userCourseExists,
  userEmailExists,
  addAssignment,
  assignmentNameExists,
  userAssignmentExists,
  addUserAssignment,
  assignmentIdExists,
} from "@/db/queries";

function error(message: string, status: number = HttpStatusCode.BadRequest) {
  return NextResponse.json(
    { error: `Error: ${message}\n` },
    { status: status }
  );
}

export async function processLinkAssignmentRequest(request: NextRequest) {
  const user_id = request.nextUrl.searchParams?.get("user_id");
  const assignment_id = request.nextUrl.searchParams?.get("assignment_id");

  let body: AddUserAssignment | undefined = undefined;
  try {
    body = await request.json();
  } catch (ex) {
    console.log(`Error reading request body: ${ex}`);
  }

  if (
    (!user_id || !assignment_id) &&
    (!body || !body.user_id || !body.assignment_id)
  )
    return error(
      `Request requires user_id and course_id in body or request parameters`
    );

  const _user_id = body?.user_id ?? parseInt(user_id!);
  const _assignment_id = body?.assignment_id ?? parseInt(assignment_id!);

  if (!(await userIdExists(_user_id))) return error("User not found");
  if (!(await assignmentIdExists(_assignment_id)))
    return error("Assignment not found");

  if (await userAssignmentExists(_assignment_id, _user_id))
    return error("Record already exists!");

  const [first] = await addUserAssignment({
    user_id: _user_id,
    assignment_id: _assignment_id,
    completed: false,
  });
  return NextResponse.json({ data: first }, { status: HttpStatusCode.Created });
}

export async function processLinkCourseRequest(request: NextRequest) {
  const user_id = request.nextUrl.searchParams?.get("user_id");
  const course_id = request.nextUrl.searchParams?.get("course_id");
  const assigned_date = request.nextUrl.searchParams?.get("assigned_date");
  const due_date = request.nextUrl.searchParams?.get("assigned_date");

  let body: AddUserCourse | undefined = undefined;
  try {
    body = await request.json();
  } catch (ex) {
    console.log(`Error reading request body: ${ex}`);
  }

  if ((!user_id || !course_id) && (!body || !body.user_id || !body.course_id))
    return error(
      `Request requires user_id and course_id in body or request parameters`
    );

  const _user_id = body?.user_id ?? parseInt(user_id!);
  const _course_id = body?.course_id ?? parseInt(course_id!);
  const _assigned_date =
    body?.assigned_date ??
    ((assigned_date && new Date(assigned_date!)) || new Date());
  const _due_date =
    body?.due_date ?? ((due_date && new Date(due_date!)) || new Date());

  if (!(await userIdExists(_user_id))) return error("User not found");
  if (!(await courseIdExists(_course_id))) return error("Course not found");

  if (await userCourseExists(_course_id, _user_id))
    return error("Record already exists!");

  const [first] = await addUserCourse({
    user_id: _user_id,
    course_id: _course_id,
    course_status: "Not Started",
    assigned_date: _assigned_date,
    due_date: _due_date,
  });
  return NextResponse.json({ data: first }, { status: HttpStatusCode.Created });
}

export async function processCreateUserRequest(request: NextRequest) {
  let body: User | undefined = undefined;
  try {
    body = await request.json();
  } catch (ex) {
    console.log(
      `Error reading request body; send JSON body of user to initialize: ${ex}`
    );
  }

  const user_name =
    body?.name || request.nextUrl.searchParams?.get("user_name");
  const user_email =
    body?.email || request.nextUrl.searchParams?.get("user_email");
  const password_hash = body?.pass || request.nextUrl.searchParams?.get("pass");

  if (!user_name)
    return error(
      "Please provide query paramater user_name for the created account\n"
    );

  if (!user_email)
    return error(
      "Please provide query parameter user_email for the created account\n"
    );

  if (!password_hash)
    return error(
      "Please provide a hashed password as query paramter pass to associate with the created account\n"
    );

  if (await userEmailExists(user_email))
    return error(
      "User with this email already exists",
      HttpStatusCode.Conflict
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

export async function processCreateCourseRequest(request: NextRequest) {
  const course_name = request.nextUrl.searchParams?.get("course_name");

  let body: AddCourse | undefined = undefined;
  try {
    body = await request.json();
  } catch (ex) {
    console.log(`Error reading request body: ${ex}`);
  }

  if (!course_name && (!body || !body.course_name))
    return error(`Request requires course_name in body or request parameters`);

  const _course_name = body?.course_name ?? course_name!;

  if (await courseNameExists(_course_name)) return error("Course exists");

  const [first] = await addCourse({
    course_name: _course_name,
  });
  return NextResponse.json({ data: first }, { status: HttpStatusCode.Created });
}

export async function processCreateAssignmentRequest(request: NextRequest) {
  const course_id = request.nextUrl.searchParams?.get("course_id");
  const webgoat_info = request.nextUrl.searchParams?.get("webgoat_info");
  const assignment_name = request.nextUrl.searchParams?.get("assignment_name");

  let body: AddAssignment | undefined = undefined;
  try {
    body = await request.json();
  } catch (ex) {
    console.log(`Error reading request body: ${ex}`);
  }

  if (
    (!assignment_name || !course_id || !webgoat_info) &&
    (!body || !body.assignment_name || !body.webgoat_info || !body.course_id)
  )
    return error(
      `Request requires assignment_name, course_id, webgoat_info in body or request parameters`
    );

  const _assignment_name = body?.assignment_name ?? assignment_name!;
  const _webgoat_info = body?.webgoat_info ?? webgoat_info!;
  const _course_id = body?.course_id ?? parseInt(course_id!);

  if (!(await courseIdExists(_course_id)))
    return error("Course does not exist", HttpStatusCode.NotFound);

  if (await assignmentNameExists(_assignment_name))
    return error(
      "Assignment with same name already exists",
      HttpStatusCode.Conflict
    );

  const [first] = await addAssignment({
    course_id: _course_id,
    assignment_name: _assignment_name,
    webgoat_info: _webgoat_info,
  });
  return NextResponse.json({ data: first }, { status: HttpStatusCode.Created });
}
