import {
  integer,
  pgTable,
  varchar,
  text,
  primaryKey,
  timestamp,
  boolean,
  date,
  // foreignKey,
} from "drizzle-orm/pg-core";
import { eq, or } from "drizzle-orm";
import { db } from "./index";
// import { AdapterAccountType } from "next-auth/adapters"

type AdapterAccountType = "oauth" | "email" | "credentials";

export interface User {
  user_id: number;
  name: string;
  email: string;
  pass: string;
}

export interface Course {
  course_id: number;
  course_name: string;
}

export interface Assignment {
  assignment_id: number;
  assignment_name: string;
  course_id: string;
  webgoat_info: number;
}

export interface User_Assignment {
  user_id: number;
  assignment_id: number;
  completed: boolean;
}

export interface User_Course {
  user_id: number;
  course_id: number;
  course_status: string;
  due_date: Date;
  assigned_date: Date;
}

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
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),});

export const courses = pgTable("courses", {
  course_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  course_name: varchar({ length: 255 }).notNull(),
});

export const assignments = pgTable("assignments", {
  webgoat_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  assignment_name: varchar({ length: 255 }).notNull(),
  assignment_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  course_id: integer()
    .notNull()
    .references(() => courses.course_id),
});

export const user_assignments = pgTable("user_assignments", {
  completed: boolean().notNull(),
  user_id: integer()
    .notNull()
    .references(() => users.id), // Foreign key to users table
  assignment_id: integer()
    .notNull()
    .references(() => assignments.assignment_id), // Foreign key to assignments table
});

export const user_courses = pgTable("user_courses", {
  user_id: integer()
    .notNull()
    .references(() => users.id),
  course_id: integer()
    .notNull()
    .references(() => courses.course_id),
  status: varchar({ length: 255 }).notNull(),
  due_date: date().notNull(),
  assigned_date: date().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);
