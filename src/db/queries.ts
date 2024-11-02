import { eq } from "drizzle-orm";
import { db } from "./index";
import { courses, Course, users, User } from "./schema";

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

// Delete a user
export async function deletecourse(id: number) {
  return await db.delete(courses).where(eq(courses.course_id, id));
}
