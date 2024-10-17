import { integer, pgTable, varchar, boolean, date, foreignKey } from "drizzle-orm/pg-core";
import { eq, or } from "drizzle-orm";
import { LargeNumberLike } from "crypto";

export interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface Courses {
  user_id: number;
  course_number: number;
  status: string;
  due_date: Date;
  assigned_date: Date;
}

export interface Assignments {
  webgoat_id: number;
  assignment_name: string;
  assignment_id: number;
  course_id: string;
}

export interface User_Assignments {
  completed: boolean;
  user_id: number;
  assignment_id: number;
}

export interface User_Courses{
  user_id: number;
  course_id: number;
  status: string;
  due_date: Date;
  assigned_date: Date;
}





export const locateUser = (user: User) =>
  or(eq(users.user_id, user.user_id), eq(users.email, user.email));


export const users = pgTable("users", {
  user_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const courses = pgTable("courses", {
  course_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  course_name: varchar({ length: 255 }).notNull(),
});

export const assignments = pgTable("assignments", {
  webgoat_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  assignment_name: varchar({ length: 255}).notNull(),
  assignment_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  course_id: integer().notNull().references(() => courses.course_id),
});

export const user_assignments = pgTable("user_assignments", {
  completed: boolean().notNull(),
  user_id: integer().notNull().references(() => users.user_id), // Foreign key to users table
  assignment_id: integer().notNull().references(() => assignments.assignment_id), // Foreign key to assignments table
});

export const user_courses = pgTable("user_courses", {
  user_id: integer().notNull().references(() => users.user_id), 
  course_id: integer().notNull().references(() => courses.course_id),
  status: varchar({ length: 255 }).notNull(),
  due_date: date().notNull(),
  assigned_date: date().notNull()
});


