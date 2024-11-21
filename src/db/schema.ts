import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  date,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { eq, or } from "drizzle-orm";
import { db } from "./index";

export async function locateUser(user: User) {
  const existingUsers = await db
    .select()
    .from(users)
    .where(or(eq(users.email, user.email), eq(users.name, user.name)));

  return existingUsers.length > 0;
}

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  pass: varchar({ length: 255 }).notNull(),
  emailVerified: timestamp("emailverified", { mode: "date" }),
  image: text("image"),
});

export const selectUsersSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUsersSchema>;
export type AddUser = Omit<User, "id">;

export const courses = pgTable("courses", {
  course_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  course_name: varchar({ length: 255 }).notNull(),
});

export const selectCoursesSchema = createSelectSchema(courses);
export type Course = z.infer<typeof selectCoursesSchema>;
export type AddCourse = Omit<Course, "course_id">;

export const assignments = pgTable("assignments", {
  assignment_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  assignment_name: varchar({ length: 255 }).notNull(),
  course_id: integer()
    .notNull()
    .references(() => courses.course_id),
  webgoat_info: varchar({ length: 255 }).notNull(),
});

export const selectAssignmentsSchema = createSelectSchema(assignments);
export const insertAssignmentsSchema = createInsertSchema(assignments);
export type Assignment = z.infer<typeof selectAssignmentsSchema>;
export type AddAssignment = Omit<Assignment, "assignment_id">;

export const user_assignments = pgTable("user_assignments", {
  user_assignment_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  completed: boolean().notNull(),
  user_id: text()
    .notNull()
    .references(() => users.id), // Foreign key to users table
  assignment_id: integer()
    .notNull()
    .references(() => assignments.assignment_id),
});

export const selectUserAssignmentsSchema = createSelectSchema(user_assignments);
export type User_Assignment = z.infer<typeof selectUserAssignmentsSchema>;
export type AddUserAssignment = Omit<User_Assignment, "user_assignment_id">;

const statusEnum = pgEnum("c_status", [
  "Not Started",
  "In Progress",
  "Completed",
]);

// https://github.com/drizzle-team/drizzle-orm/discussions/1914
export const statusEnumSchema = z.enum(statusEnum.enumValues);

export const user_courses = pgTable("user_courses", {
  user_id: text(),
  course_id: integer()
    .notNull()
    .references(() => courses.course_id),
  course_status: statusEnum(),
  due_date: date("due_date", { mode: "date" }).notNull(),
  assigned_date: date("assigned_date", { mode: "date" }).notNull(),
});

export const selectUserCoursesSchema = createSelectSchema(user_courses);
export type User_Course = z.infer<typeof selectUserCoursesSchema>;
export type AddUserCourse = Omit<User_Course, "user_course_id">;

const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
