import { and, eq } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  courses,
  User,
  Assignment,
  User_Assignment,
  User_Course,
  assignments,
  user_assignments,
  user_courses,
} from "./schema";

// Fetch all users
export async function getAllUsers() {
  return await db.select().from(users);
}

// Add a new user
export async function addUser(user: User) {
  return await db.insert(users).values(user);
}

// Update a user
export async function updateUser(user: User) {
  return await db
    .update(users)
    .set(user)
    .where(eq(users.id, user.user_id));
}

// Delete a user
export async function deleteUser(id: string) {
  return await db.delete(users).where(eq(users.id, id));
}

export async function userExists(id: string) {
  return await db.select().from(users).where(eq(users.id, id));
}

export async function courseExists(id: number) {
  return await db.select().from(courses).where(eq(courses.course_id, id));
}

// Fetch all courses
export async function getAllCourses() {
  return await db.select().from(courses);
}

// Add a new course
export async function addCourse(course: Course) {
  return await db.insert(courses).values(course);
}

// Update a course
export async function updateCourse(course: Course) {
  return await db
    .update(courses)
    .set(course)
    .where(eq(courses.course_id, course.course_id));
}


// Fetch all courses
export async function getAllCourses() {
  return await db.select().from(courses);
}

// Add a new course
export async function addCourse(course: Course) {
  return await db.insert(courses).values(course);
}

// Update a course
export async function updateCourse(course: Course) {
  return await db
    .update(courses)
    .set(course)
    .where(eq(courses.course_id, course.course_id));
}

// Delete a user
export async function deletecourse(id: number) {
  return await db.delete(courses).where(eq(courses.course_id, id));
}

// Courses

export async function createCourse(courseName: string) {
  return await db.insert(courses).values({ course_name: courseName });
}

export async function getCourse(courseId: number) {
  return await db.select().from(courses).where(eq(courses.course_id, courseId));
}

// Update course
 //export async function updateCourse(courseId: number, updatedFields: Partial<Course>) {
  //return await db.update(courses).set(updatedFields).where(eq(courses.course_id, courseId));
//}

export async function deleteCourse(courseId: number) {
  return await db.delete(courses).where(eq(courses.course_id, courseId));
}

// Assignment
export async function getAllAssignments() {
  return await db.select().from(assignments);
}

export async function getAssignmentsByCourse(courseId: number) {
  return await db
    .select()
    .from(assignments)
    .where(eq(assignments.course_id, courseId));
}

export async function addAssignment(assignment: Assignment) {
  return await db.insert(assignments).values({
    course_id: assignment.course_id,
    assigntment_id: assignment.assignment_id,
    assignment_name: assignment.assignment_name,
    webgoat_id: assignment.webgoat_id,
  });
}

export async function deleteAssignment(assignmentId: number) {
  return await db
    .delete(assignments)
    .where(eq(assignments.assignment_id, assignmentId));
}

// User assignment
export async function getAllUserAssignments() {
  return await db.select().from(user_assignments);
}

export async function getAssignmentsByUser(userId: number) {
  return await db
    .select()
    .from(user_assignments)
    .where(eq(user_assignments.user_id, userId));
}

export async function addUserAssignment(userAssignment: User_Assignment) {
  return await db.insert(user_assignments).values([userAssignment]);
}

export async function updateUserAssignment(
  userId: number,
  assignmentId: number,
  completed: boolean
) {
  return await db
    .update(user_assignments)
    .set({ completed })
    .where(
      and(
        eq(user_assignments.user_id, userId),
        eq(user_assignments.assignment_id, assignmentId)
      )
    );
}

export async function deleteUserAssignment(
  userId: number,
  assignmentId: number
) {
  return await db
    .delete(user_assignments)
    .where(
      and(
        eq(user_assignments.user_id, userId),
        eq(user_assignments.assignment_id, assignmentId)
      )
    );
}

// User courses
export async function getAllUserCourses() {
  return await db.select().from(user_courses);
}

export async function getCoursesByUser(userId: number) {
  return await db
    .select()
    .from(user_courses)
    .where(eq(user_courses.user_id, userId));
}

export async function addUserCourse(userCourse: User_Course) {
  return await db.insert(user_courses).values({
    user_id = userCourse.user_id,
    course_id = userCourse.course_id,
    course_status = userCourse.course_status
    due_date: userCourse.due_date.toISOString(),
    assigned_date: userCourse.assigned_date.toISOString(),
  });
}

export async function updateUserCourseStatus(
  userId: number,
  courseId: number,
  status: string
) {
  return await db
    .update(user_courses)
    .set({ course_status })
    .where(
      and(
        eq(user_courses.user_id, userId),
        eq(user_courses.course_id, courseId)
      )
    );
}

export async function deleteUserCourse(userId: number, courseId: number) {
  return await db
    .delete(user_courses)
    .where(
      and(
        eq(user_courses.user_id, userId),
        eq(user_courses.course_id, courseId)
      )
    );
}
