import {
  integer,
  pgTable,
  varchar,
  text,
  primaryKey,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { eq, or } from "drizzle-orm";
import { db } from "./index";
// import { AdapterAccountType } from "next-auth/adapters"

type AdapterAccountType = "oauth" | "email" | "credentials";

export interface User {
  user_id: number;
  email: string;
  name: string;
  pass: string;
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
  pass: varchar({ length: 255 }).notNull(),
  emailVerified: timestamp("emailverified", { mode: "date" }),
  image: text("image"),
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
