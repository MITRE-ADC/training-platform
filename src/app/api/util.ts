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
import {
  CHECK_ADMIN,
  CHECK_SESSION,
  CHECK_UNAUTHORIZED,
  CHECK_UNAUTHORIZED_BY_UID,
} from "./auth";

export function error(
  message: string,
  status: number = HttpStatusCode.BadRequest
) {
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

  return processLinkAssignment(
    body?.user_id ?? user_id!,
    body?.assignment_id ?? parseInt(assignment_id!)
  );
}

export async function processLinkAssignment(
  _user_id: string,
  _assignment_id: number
) {
  const err = await CHECK_SESSION();
  if (err) return err;

  const exists = await userIdExists(_user_id);
  if (exists instanceof NextResponse) return exists;

  // if (!(await userIdExists(_user_id))) return error("User not found");

  if (!(await assignmentIdExists(_assignment_id)))
    return error("Assignment not found");

  if (await userAssignmentExists(_assignment_id, _user_id))
    return error("Record already exists!");

  const result = await addUserAssignment({
    user_id: _user_id,
    assignment_id: _assignment_id,
    completed: false,
  });

  if (result instanceof NextResponse) return result;

  if (result.length == 0)
    return error("unknown", HttpStatusCode.InternalServerError);

  return NextResponse.json(
    { data: result[0] },
    { status: HttpStatusCode.Created }
  );
}

export async function processLinkCourse(course: AddUserCourse) {
  if (!course.user_id) return error("Must provide user id");

  const err = await CHECK_UNAUTHORIZED_BY_UID(course.user_id);
  if (err) return err;

  const exists = await userIdExists(course.user_id);
  if (exists instanceof NextResponse) return exists;

  if (!exists) return error("User does not exist");

  if (!(await courseIdExists(course.course_id)))
    return error("Course not found");

  const _userCourseExists = await userCourseExists(
    course.course_id,
    course.user_id
  );

  if (_userCourseExists instanceof NextResponse) return _userCourseExists;

  if (_userCourseExists) return error("Record already exists!");

  const result = await addUserCourse({
    user_id: course.user_id,
    course_id: course.course_id,
    course_status: course.course_status,
    assigned_date: course.assigned_date,
    due_date: course.due_date,
  });

  if (result instanceof NextResponse) return result;

  if (result.length == 0)
    return error("unknown", HttpStatusCode.InternalServerError);

  return NextResponse.json(
    { data: result[0] },
    { status: HttpStatusCode.Created }
  );
}

export async function processLinkCourseRequest(request: NextRequest) {
  const user_id = request.nextUrl.searchParams?.get("user_id");
  const course_id = request.nextUrl.searchParams?.get("course_id");
  let body: AddUserCourse | undefined = undefined;

  try {
    body = await request.json();
  } catch (ex) {
    console.log(`Error reading request body: ${ex}`);
  }

  if ((!user_id || !course_id) && (!body || !body.user_id || !body.course_id)) {
    return error(
      "Request requires user_id and course_id in body or request parameters"
    );
  }

  const _user_id = body?.user_id ?? user_id!;
  const _course_id = body?.course_id ?? parseInt(course_id!);
  const _assigned_date = body?.assigned_date ?? new Date();
  const _due_date = body?.due_date ?? new Date();

  return processLinkCourse({
    assigned_date: _assigned_date,
    course_id: _course_id,
    course_status: "Not Started",
    due_date: _due_date,
    user_id: _user_id,
  });
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

  const user_name = body?.name || request.nextUrl.searchParams?.get("name");
  const user_email = body?.email || request.nextUrl.searchParams?.get("email");
  const webgoat_username =
    body?.webgoatusername ||
    request.nextUrl.searchParams?.get("webgoatusername");
  const webgoat_password =
    body?.webgoatpassword ||
    request.nextUrl.searchParams?.get("webgoatpassword");
  const password_hash = body?.pass || request.nextUrl.searchParams?.get("pass");

  if (!user_name)
    return error(
      "Please provide query paramater user_name for the created account\n"
    );

  if (!user_email)
    return error(
      "Please provide query parameter user_email for the created account\n"
    );

  if (!webgoat_username)
    return error(
      "Please provide query paramater webgoat_username for the created account\n"
    );

  if (!webgoat_password)
    return error(
      "Please provide query parameter webgoat_password for the created account\n"
    );

  if (!password_hash)
    return error(
      "Please provide a hashed password as query paramter pass to associate with the created account\n"
    );

  const exists = await userEmailExists(user_email);
  if (exists)
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
      webgoatusername: webgoat_username,
      webgoatpassword: webgoat_password,
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
        { message: `Succesfully inserted: \n\t${JSON.stringify(user)}` },
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

  return processCreateCourse(body?.course_name ?? course_name!);
}

export async function processCreateCourse(course_name: string) {
  const err = await CHECK_SESSION();
  if (err) return err;
  if (await courseNameExists(course_name)) return error("Course exists");

  const result = await addCourse({
    course_name: course_name,
  });
  if (result instanceof NextResponse) return result;
  else
    return NextResponse.json(
      { data: result[0] },
      { status: HttpStatusCode.Created }
    );
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

  return processCreateAssignment(
    body?.assignment_name ?? assignment_name!,
    body?.webgoat_info ?? webgoat_info!,
    body?.course_id ?? parseInt(course_id!)
  );
}

export async function processUpdateUser(body: User) {
  const exists = await userIdExists(body.id);

  if (!exists) return error("user does not exist", HttpStatusCode.NotFound);

  const err = await CHECK_UNAUTHORIZED(body.email);
  if (err) return err;

  await db.insert(users).values(body).onConflictDoUpdate({
    target: users.id,
    set: body,
  });

  return NextResponse.json(
    {
      data: body,
    },
    {
      status: HttpStatusCode.Ok,
    }
  );
}

export async function processCreateAssignment(
  assignment_name: string,
  webgoat_info: string,
  course_id: number
) {
  const err = await CHECK_SESSION();
  if (err) return err;

  if (!(await courseIdExists(course_id)))
    return error("Course does not exist", HttpStatusCode.NotFound);

  if (await assignmentNameExists(assignment_name))
    return error(
      "Assignment with same name already exists",
      HttpStatusCode.Conflict
    );

  const result = await addAssignment({
    course_id: course_id,
    assignment_name: assignment_name,
    webgoat_info: webgoat_info,
  });
  if (result instanceof NextResponse) return result;
  else
    return NextResponse.json(
      { data: result[0] },
      { status: HttpStatusCode.Created }
    );
  /* const [first] = await addAssignment({
    course_id: course_id,
    assignment_name: assignment_name,
    webgoat_info: webgoat_info,
  }); */
}
