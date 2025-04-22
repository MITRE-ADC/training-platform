import { cookies } from "next/headers";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
const { default: jwt } = await import("jsonwebtoken");

import { users } from "@/db/schema";
import type { User } from "../db/schema";
import { NextRequest } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

const JWT_SECRET = "change_to_something_else"; // Define your secret in env variables
const admin_email = process.env.ADMIN_USER_EMAIL;

export type SessionValidationResult =
  | { user: Omit<User, "pass"> }
  | { user: null };
// ...

export type SessionValidationAdminResult =
  | { user: Omit<User, "pass">; isAdmin: boolean }
  | { user: null; isAdmin: boolean };
// ...

export async function validateJwtToken(
  token: string
): Promise<SessionValidationResult> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userID: string;
      exp: number;
    };

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userID));

    if (result.length < 1) {
      return { user: null };
    }

    const user: Omit<User, "pass"> = result[0];

    // Extend expiration if token is near expiry (15 days or less remaining)
    const expiresIn = 1000 * 60 * 60 * 24 * 30; // 30 days
    if (Date.now() >= decoded.exp * 1000 - 1000 * 60 * 60 * 24 * 15) {
      const newToken = jwt.sign({ userID: decoded.userID }, JWT_SECRET, {
        expiresIn,
      });
      await setJwtCookie(newToken, expiresIn);
    }

    return { user: user };
  } catch (error) {
    console.error(error);
    return { user: null };
  }
}

export async function setJwtCookie(
  userID: string,
  maxAge: number
): Promise<void> {
  const cookieStore = await cookies();
  const expiresIn = 1000 * 60 * 60 * 24 * 30;
  const token = jwt.sign({ userID: userID }, JWT_SECRET, { expiresIn });
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  });
}

export async function deleteJwtCookie(): Promise<void> {
  const cookieStore =await  cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function setWebGoatCookie(
  jsessionid: string,
  maxAge: number
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("webgoat-session", jsessionid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  });
}

export async function deleteWebGoatCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("webgoat-session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function getCurrentUser(
  cookieStore: ReadonlyRequestCookies | RequestCookies
): Promise<SessionValidationResult> {
  const token = cookieStore.get("session")?.value ?? null;
  if (token == null) {
    return { user: null };
  }
  const result = await validateJwtToken(token);

  return result;
}

export async function getCurrentUserAndAdmin(
  cookieStore: ReadonlyRequestCookies | RequestCookies
): Promise<SessionValidationAdminResult> {
  const token = cookieStore.get("session")?.value ?? null;
  if (token == null) {
    return { user: null, isAdmin: false };
  }
  const result = await validateJwtToken(token);

  if (result.user == null) {
    return { user: null, isAdmin: false };
  }

  return { user: result.user, isAdmin: result.user.email == admin_email };
}

export async function getUserInfo(
  cookieStore: NextRequest["cookies"]
): Promise<SessionValidationResult> {
  const result = getCurrentUser(cookieStore);
  return result;
}
