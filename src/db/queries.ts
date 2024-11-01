import { eq } from "drizzle-orm";
import { db } from "./index";
import { courses, users, User, Course, Assignment, User_Assignment, User_Course } from "./schema";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";

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
    .where(eq(users.user_id, user.user_id));
}

// Delete a user
export async function deleteUser(id: number) {
  return await db.delete(users).where(eq(users.user_id, id));
}

export async function userExists(id: number) {
  return await db.select().from(users).where(eq(users.user_id, id));
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


export async function createCourse(courseName: string) {
  return await db.insert(courses).values({ course_name: courseName });
}

// Retrieve course
export async function getCourse(courseId: number) {
  return await db.select().from(courses).where(eq(courses.course_id, courseId));
}

// Update course
 //export async function updateCourse(courseId: number, updatedFields: Partial<Course>) {
  //return await db.update(courses).set(updatedFields).where(eq(courses.course_id, courseId));
//}

// Delete course
export async function deleteCourse(courseId: number) {
  return await db.delete(courses).where(eq(courses.course_id, courseId));
}

// Create a user assignment
export async function createUserAssignment(userAssignment: User_Assignment) {
  return await db.insert(userAssignment).values(userAssignment);
}

// Delete user assignment
export async function deleteUserAssignment(id : number){
  
}











