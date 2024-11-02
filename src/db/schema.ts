import { integer, pgTable, varchar, boolean, timestamp} from "drizzle-orm/pg-core";
import { eq, or } from "drizzle-orm";

export interface User {
  user_id: number;
  name: string;
  email: string;
  pass: string;
}
export type AddUser = Omit<User, "user_id">;

export interface Course {
  course_id: number;
  course_name: string;
}
export type AddCourse = Omit<Course, "course_id">;

export interface Assignment {
  assignment_id: number;
  assignment_name: string;
  course_id: number;
  webgoat_info: string;
}
export type AddAssignment = Omit<Assignment, "assignment_id">;

export interface User_Assignment {
  user_assignment_id: number; 
  user_id: number;
  assignment_id: number;
  completed: boolean;
}
export type AddUserAssignment = Omit<User_Assignment, "user_assignment_id">;

export interface User_Course {
  user_course_id: number; 
  user_id: number;
  course_id: number;
  course_status: string;
  due_date: Date;
  assigned_date: Date;
}
export type AddUserCourse = Omit<User_Course, "user_course_id">;

export const locateUser = (user: User) =>
  or(eq(users.user_id, user.user_id), eq(users.email, user.email));

export const users = pgTable("users", {
  user_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  pass: varchar({ length: 255 }).notNull(),
});

export const courses = pgTable("courses", {
  course_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  course_name: varchar({ length: 255 }).notNull(),
});

export const assignments = pgTable("assignments", {
  webgoat_info: varchar({ length: 255 }).notNull(),
  assignment_name: varchar({ length: 255 }).notNull(),
  assignment_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  course_id: integer()
    .notNull()
    .references(() => courses.course_id),
});

export const user_assignments = pgTable("user_assignments", {
  user_assignment_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  completed: boolean().notNull(),
  user_id: integer()
    .notNull()
    .references(() => users.user_id), 
  assignment_id: integer()
    .notNull()
    .references(() => assignments.assignment_id), 
});

export const user_courses = pgTable("user_courses", {
  user_course_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.user_id),
  course_id: integer()
    .notNull()
    .references(() => courses.course_id),
  course_status: varchar({ length: 255 }).notNull(),
  due_date: timestamp("due_date", {mode: "date"}).notNull(),
  assigned_date: timestamp("due_date", {mode: "date"}).notNull(),
});
