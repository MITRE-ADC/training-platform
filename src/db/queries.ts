import { and, eq } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  courses,
  Course,
  assignments,
  user_assignments,
  user_courses,
  AddUser,
  AddCourse,
  AddAssignment,
  AddUserAssignment,
  statusEnumSchema,
  AddUserCourse,
} from "./schema";
import {
  CHECK_ADMIN,
  CHECK_SESSION,
  CHECK_UNAUTHORIZED,
  CHECK_UNAUTHORIZED_BY_UID,
} from "@/app/api/auth";
import { NextResponse } from "next/server";

// Users

/**
 * gets complete (including sensitive) data on ALL uesrs -- must be admin to use
 *
 */
export async function getAllUsers() {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db.select().from(users);
}

export async function addUser(user: AddUser) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db.insert(users).values(user).returning();
}

// since we need email not id this is a quick fix
export async function getAssignmentsByUser(user_id: string) {
  const user = (await db.select().from(users).where(eq(users.id, user_id)))[0];

  if (!user) {
    return undefined;
  }

  const err = await CHECK_UNAUTHORIZED(user.email);
  if (err) return err;

  return await db
    .select()
    .from(user_assignments)
    .where(eq(user_assignments.user_id, user_id));
}

// // Update a user
// export async function updateUser(user: User) {
//   return await db
//     .update(users)
//     .set(user)
//     .where(eq(users.id, user.user_id));
// }

// export async function userEmailExists(email: string) {
//   return await db.select().from(users).where(eq(users.email, email)).limit(1);
// }

// export async function updateUser(user: User) {
//   return await db
//     .update(users)
//     .set(user)
//     .where(eq(users.user_id, user.user_id));
// }

// export async function deleteUser(id: number) {
//   return await db.delete(users).where(eq(users.user_id, id));
// }

export async function userIdExists(id: string) {
  const err = await CHECK_SESSION();
  if (err) return err;

  return (await db.$count(db.select().from(users).where(eq(users.id, id)))) > 0;
}

export async function userEmailExists(email: string) {
  const exists =
    (await db.$count(db.select().from(users).where(eq(users.email, email)))) >
    0;
  if (exists) {
    const error = getUserByEmail(email); // will check unauthorized and return err if that's the case
    if (error instanceof NextResponse) return error;
  }

  return exists;
}

export async function userNameExists(name: string) {
  const exists =
    (await db.$count(db.select().from(users).where(eq(users.name, name)))) > 0;
  if (exists) {
    const error = getUserByName(name); // will check unauthorized and return err if that's the case
    if (error instanceof NextResponse) return error;
  }

  return exists;
}

export async function courseIdExists(id: number) {
  // TODO: see below
  return (
    (await db.$count(
      db.select().from(courses).where(eq(courses.course_id, id))
    )) > 0
  );
}

export async function courseNameExists(course_name: string) {
  const err = await CHECK_SESSION();
  if (err) return err;
  // TODO: see below
  return (
    (await db.$count(
      db.select().from(courses).where(eq(courses.course_name, course_name))
    )) > 0
  );
}

export async function aggregateUserCoursesStatusByUser() {
  const err = await CHECK_ADMIN();
  if (err) return err;
  const data = (
    await db.execute(
      `
      SELECT 
        user_id,
        CASE
          WHEN due_date < CURRENT_DATE THEN 'Overdue'
          ELSE course_status::TEXT
        END AS course_status_group,
        CAST(COUNT(*) AS int) as count
      FROM user_courses
      GROUP BY
        user_id,
        CASE
          WHEN due_date < CURRENT_DATE THEN 'Overdue'
          ELSE course_status::TEXT
        END

      ORDER BY user_id ASC;
      `
    )
  ).rows;

  interface Analysis {
    completed: number;
    in_progress: number;
    not_started: number;
    overdue: number;
  }

  interface Entry {
    user_id: string;
    analysis: Analysis;
  }
  const res: Entry[] = [];
  let lastId: string | null = null;
  data.forEach((element) => {
    if (String(element["user_id"]) != lastId) {
      lastId = String(element["user_id"]);
      const newEntry = {
        user_id: String(element["user_id"]),
        analysis: {
          completed: 0,
          in_progress: 0,
          not_started: 0,
          overdue: 0,
        },
      };
      switch (element["course_status_group"]) {
        case "Completed": {
          newEntry["analysis"]["completed"] = Number(element["count"]);
          break;
        }
        case "In Progress": {
          newEntry["analysis"]["in_progress"] = Number(element["count"]);
          break;
        }
        case "Not Started": {
          newEntry["analysis"]["not_started"] = Number(element["count"]);
          break;
        }
        case "Overdue": {
          newEntry["analysis"]["overdue"] = Number(element["count"]);
          break;
        }
      }
      res.push(newEntry);
    } else {
      const entry = res[res.length - 1];

      switch (element["course_status_group"]) {
        case "Completed": {
          entry["analysis"]["completed"] = Number(element["count"]);
          break;
        }
        case "In Progress": {
          entry["analysis"]["in_progress"] = Number(element["count"]);
          break;
        }
        case "Not Started": {
          entry["analysis"]["not_started"] = Number(element["count"]);
          break;
        }
        case "Overdue": {
          entry["analysis"]["overdue"] = Number(element["count"]);
          break;
        }
      }
    }
  });

  return res;
}

export async function assignmentWebgoatIdExists(webgoat_info: string) {
  // const err = await CHECK_SESSION();
  // if (err) return err;
  // TODO: see below
  return (
    (await db.$count(
      db
        .select()
        .from(assignments)
        .where(eq(assignments.webgoat_info, webgoat_info))
    )) > 0
  );
}

export async function userAssignmentIdExists(id: number) {
  // TODO: determine which auth check to run -- generally auth'd in?
  return (
    (await db.$count(
      db
        .select()
        .from(user_assignments)
        .where(eq(user_assignments.user_assignment_id, id))
    )) > 0
  );
}

export async function userAssignmentWebgoatIdExists(
  user_id: string,
  webgoat_info: string
) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return (
    (await db.$count(
      db
        .select()
        .from(assignments)
        .innerJoin(
          user_assignments,
          eq(user_assignments.assignment_id, assignments.assignment_id)
        )
        .where(
          and(
            eq(user_assignments.user_id, user_id),
            eq(assignments.webgoat_info, webgoat_info)
          )
        )
    )) > 0
  );
}

export async function userAssignmentExists(
  assignment_id: number,
  user_id: string
) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return (
    (await db.$count(
      db
        .select()
        .from(user_assignments)
        .where(
          and(
            eq(user_assignments.assignment_id, assignment_id),
            eq(user_assignments.user_id, user_id)
          )
        )
    )) > 0
  );
}

export async function getUserAssignmentByWebgoatId(
  user_id: string,
  webgoat_info: string
) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return (
    await db
      .select({
        user_assignment_id: user_assignments.user_assignment_id,
        user_id: user_assignments.user_id,
        assignment_id: user_assignments.assignment_id,
        completed: user_assignments.completed,
      })
      .from(assignments)
      .innerJoin(
        user_assignments,
        eq(user_assignments.assignment_id, assignments.assignment_id)
      )
      .where(
        and(
          eq(user_assignments.user_id, user_id),
          eq(assignments.webgoat_info, webgoat_info)
        )
      )
  )[0];
}

// Courses
export async function getAllCourses() {
  return await db.select().from(courses);
}

export async function getCoursesByUser(user_id: string) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  // if (err) return err; TODO:

  return await db
    .select()
    .from(user_courses)
    .where(eq(user_courses.user_id, user_id));
}

export async function getAllUserCourses() {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db.select().from(user_courses);
}

export async function userCourseExists(course_id: number, user_id: string) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return (
    (await db.$count(
      db
        .select()
        .from(user_courses)
        .where(
          and(
            eq(user_courses.course_id, course_id),
            eq(user_courses.user_id, user_id)
          )
        )
    )) > 0
  );
}

export async function addUserCourse(userCourse: AddUserCourse) {
  const err = await CHECK_ADMIN();
  if (err) return err;
  userCourse.assigned_date = new Date(userCourse.assigned_date);
  userCourse.due_date = new Date(userCourse.due_date);
  return await db.insert(user_courses).values(userCourse).returning();
}

export async function updateUserCourseStatus(
  user_id: string,
  course_id: number,
  status: typeof statusEnumSchema._type
) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return await db
    .update(user_courses)
    .set({ course_status: status })
    .where(
      and(
        eq(user_courses.user_id, user_id),
        eq(user_courses.course_id, course_id)
      )
    );
}

export async function deleteUserCourse(user_id: string, course_id: number) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return await db
    .delete(user_courses)
    .where(
      and(
        eq(user_courses.user_id, user_id),
        eq(user_courses.course_id, course_id)
      )
    );
}

export async function updateUserCourseDueDate(
  user_id: string,
  course_id: number,
  date: Date
) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return await db
    .update(user_courses)
    .set({ due_date: date })
    .where(
      and(
        eq(user_courses.user_id, user_id),
        eq(user_courses.course_id, course_id)
      )
    )
    .returning();
}

export async function deleteCourseForUser(user_id: string, course_id: number) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db
    .delete(user_courses)
    .where(
      and(
        eq(user_courses.user_id, user_id),
        eq(user_courses.course_id, course_id)
      )
    );
}

export async function assignmentIdExists(id: number) {
  const err = await CHECK_SESSION();
  if (err) return err;
  return (
    (await db.$count(
      db.select().from(assignments).where(eq(assignments.assignment_id, id))
    )) > 0
  );
}

export async function deleteAssignment(assignmentId: number) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db
    .delete(assignments)
    .where(eq(assignments.assignment_id, assignmentId));
}

export async function deleteAssignmentForUser(
  user_id: string,
  assignment_id: number
) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db
    .delete(user_assignments)
    .where(
      and(
        eq(user_assignments.user_id, user_id),
        eq(user_assignments.assignment_id, assignment_id)
      )
    );
}

export async function getAllAssignments() {
  return await db.select().from(assignments);
}

export async function getAssignmentsByCourse(courseId: number) {
  return await db
    .select()
    .from(assignments)
    .where(eq(assignments.course_id, courseId));
}

export async function getAllUserAssignments() {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db.select().from(user_assignments);
}

export async function assignmentNameExists(name: string) {
  return (
    (await db.$count(
      db.select().from(assignments).where(eq(assignments.assignment_name, name))
    )) > 0
  );
}

export async function addUserAssignment(userAssignment: AddUserAssignment) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(userAssignment.user_id);
  if (err) return err;

  return await db.insert(user_assignments).values(userAssignment).returning();
}

export async function updateUserAssignment(
  user_id: string,
  assignment_id: number,
  completed: boolean
) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return await db
    .update(user_assignments)
    .set({ completed })
    .where(
      and(
        eq(user_assignments.user_id, user_id),
        eq(user_assignments.assignment_id, assignment_id)
      )
    );
}

export async function deleteUserAssignment(
  user_id: string,
  assignment_id: number
) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return await db
    .delete(user_assignments)
    .where(
      and(
        eq(user_assignments.user_id, user_id),
        eq(user_assignments.assignment_id, assignment_id)
      )
    );
}

export async function getCourseByName(course_name: string) {
  return (
    await db.select().from(courses).where(eq(courses.course_name, course_name))
  )[0];
}

/**
 * gets CURRENTLY LOGGED IN user's complete (including sensitive) data given their email
 */
export async function getUserByEmail(user_email: string) {
  const { id, pass, ...userFields } = (
    await db.select().from(users).where(eq(users.email, user_email))
  )[0];

  const err = await CHECK_SESSION();
  if (err) return err;

  return { ...userFields };
}

/**
 * gets ANY user's complete (including sensitive) data given their id requiring a user to be logged in
 */
export async function getCompleteUser(user_id: string) {
  const err = await CHECK_UNAUTHORIZED_BY_UID(user_id);
  if (err) return err;

  return (await db.select().from(users).where(eq(users.id, user_id)))[0];
}

/**
 * gets ANY user's data given their id requiring a user to be logged in
 */
export async function getUser(user_id: string) {
  const err = await CHECK_SESSION();
  if (err) return err;

  const { id, pass, ...userFields } = (
    await db.select().from(users).where(eq(users.id, user_id))
  )[0];
  return { ...userFields };
}

/**
 * checks ANY user's password against the passed-in password, without passing back unprotected data
 */
export async function checkUserPassword(
  user_email: string,
  user_password: string
) {
  const user = (
    await db.select().from(users).where(eq(users.email, user_email))
  )[0];

  return user.pass == user_password;
}

/**
 * gets ANY user's complete (including sensitive) information requiring a user to be logged in (but not necessarily the same one whose data is requested)
 */
export async function getCompleteUserByEmail(user_email: string) {
  const err = await CHECK_SESSION();
  if (err) return err;

  const user = (
    await db.select().from(users).where(eq(users.email, user_email))
  )[0];
  return user;
}

/**
 * gets ANY user's complete (including sensitive) information without requiring a user to be logged in
 * NOTE: this function is dangerous, use with care and only for authentication
 */
export async function getCompleteUserByEmailNoAuth(user_email: string) {
  const user = (
    await db.select().from(users).where(eq(users.email, user_email))
  )[0];

  return user;
}

/**
 * gets ANY user's data given their user_name
 */
export async function getUserByName(user_name: string) {
  const { id, pass, ...userFields } = (
    await db.select().from(users).where(eq(users.name, user_name))
  )[0];

  const err = await CHECK_SESSION();
  if (err) return err;

  return { ...userFields };
}

/**
 * gets ANY user's complete (including sensitive) data given their user_name
 * only user can see their own or admin
 */
export async function getCompleteUserByName(user_name: string) {
  const user = (
    await db.select().from(users).where(eq(users.name, user_name))
  )[0];

  if (!user) {
    return undefined;
  }

  const err = await CHECK_UNAUTHORIZED(user.email);
  if (err) return err;

  return user;
}

export async function deleteCourse(courseId: number) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db.delete(courses).where(eq(courses.course_id, courseId));
}

export async function addCourse(course: AddCourse) {
  const err = await CHECK_SESSION();
  if (err) return err;

  return await db.insert(courses).values(course).returning();
}

export async function updateCourse(course: Course) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db
    .update(courses)
    .set(course)
    .where(eq(courses.course_id, course.course_id));
}

export async function updateCourseDueDate(course_id: number, date: Date) {
  const err = await CHECK_ADMIN();
  if (err) return err;

  return await db
    .update(user_courses)
    .set({ due_date: date })
    .where(eq(user_courses.course_id, course_id));
}

export async function getAssignment(assignmentId: number) {
  return (
    await db
      .select()
      .from(assignments)
      .where(eq(assignments.assignment_id, assignmentId))
  )[0];
}

export async function getAssignmentByWebgoatId(webgoat_info: string) {
  const err = await CHECK_SESSION();
  if (err) return err;
  return (
    await db
      .select()
      .from(assignments)
      .where(eq(assignments.webgoat_info, webgoat_info))
  )[0];
}

export async function addAssignment(assignment: AddAssignment) {
  const err = await CHECK_SESSION();
  if (err) return err;

  return await db.insert(assignments).values(assignment).returning();
}
