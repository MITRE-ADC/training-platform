import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import {eq, or } from "drizzle-orm"

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const locateUser = (user: User) => or(eq(users.id, user.id), eq(users.email, user.email))

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
