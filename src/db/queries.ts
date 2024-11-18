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
  // AddUserCourse,
  AddUserAssignment,
  statusEnumSchema,
  AddUserCourse,
} from "./schema";

// Users
export async function getAllUsers() {
  return await db.select().from(users);
}

export async function addUser(user: AddUser) {
  return await db.insert(users).values(user).returning();
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
  return (await db.$count(db.select().from(users).where(eq(users.id, id)))) > 0;
}
export async function userEmailExists(email: string) {
  return (
    (await db.$count(db.select().from(users).where(eq(users.email, email)))) > 0
  );
}

export async function userNameExists(name: string) {
  return (
    (await db.$count(db.select().from(users).where(eq(users.name, name)))) > 0
  );
}

export async function courseIdExists(id: number) {
  return (
    (await db.$count(
      db.select().from(courses).where(eq(courses.course_id, id))
    )) > 0
  );
}

export async function courseNameExists(course_name: string) {
  return (
    (await db.$count(
      db.select().from(courses).where(eq(courses.course_name, course_name))
    )) > 0
  );
}

export async function assignmentWebgoatIdExists(webgoat_info: string) {
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
  return await db
    .select()
    .from(user_courses)
    .where(eq(user_courses.user_id, user_id));
}

export async function getAllUserCourses() {
  return await db.select().from(user_courses);
}

export async function userCourseExists(course_id: number, user_id: string) {
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
  return await db.insert(user_courses).values(userCourse).returning();
}

export async function updateUserCourseStatus(
  user_id: string,
  course_id: number,
  status: typeof statusEnumSchema._type
) {
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
  return (
    (await db.$count(
      db.select().from(assignments).where(eq(assignments.assignment_id, id))
    )) > 0
  );
}

export async function deleteAssignment(assignmentId: number) {
  return await db
    .delete(assignments)
    .where(eq(assignments.assignment_id, assignmentId));
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
  return await db.select().from(user_assignments);
}

export async function getAssignmentsByUser(user_id: string) {
  return await db
    .select()
    .from(user_assignments)
    .where(eq(user_assignments.user_id, user_id));
}

export async function assignmentNameExists(name: string) {
  return (
    (await db.$count(
      db.select().from(assignments).where(eq(assignments.assignment_name, name))
    )) > 0
  );
}

export async function addUserAssignment(userAssignment: AddUserAssignment) {
  return await db.insert(user_assignments).values(userAssignment).returning();
}

export async function updateUserAssignment(
  user_id: string,
  assignment_id: number,
  completed: boolean
) {
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

export async function getUser(user_id: string) {
  return await db.select().from(users).where(eq(users.id, user_id));
}

export async function getUserByEmail(user_email: string) {
  return (await db.select().from(users).where(eq(users.email, user_email)))[0];
}

export async function getUserByName(user_name: string) {
  return (await db.select().from(users).where(eq(users.name, user_name)))[0];
}

export async function deleteCourse(courseId: number) {
  return await db.delete(courses).where(eq(courses.course_id, courseId));
}

export async function addCourse(course: AddCourse) {
  return await db.insert(courses).values(course).returning();
}

export async function updateCourse(course: Course) {
  return await db
    .update(courses)
    .set(course)
    .where(eq(courses.course_id, course.course_id));
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
  return (
    await db
      .select()
      .from(assignments)
      .where(eq(assignments.webgoat_info, webgoat_info))
  )[0];
}

export async function addAssignment(assignment: AddAssignment) {
  return await db.insert(assignments).values(assignment).returning();
}
