import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "../db/index";
import { eq, or } from "drizzle-orm";

var jwt = require('jsonwebtoken');
import { users } from "@/db/schema";
import type { User}  from "../db/schema"
import { NextRequest } from "next/server";

const JWT_SECRET = "change_to_something_else"; // Define your secret in env variables

export type SessionValidationResult =
	| { user: User }
	| { user: null };
// ...

export async function validateJwtToken(token: string): Promise<SessionValidationResult> {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userID: string, exp: number };
		console.log("THE USER ID IS " + decoded.userID)
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, decoded.userID));

		if (result.length < 1) {
			console.log("User not found")
			return { user: null} ;
		}
		console.log("User found")

		const user = result[0];

		// Extend expiration if token is near expiry (15 days or less remaining)
		const expiresIn = 1000 * 60 * 60 * 24 * 30; // 30 days
		if (Date.now() >= decoded.exp * 1000 - 1000 * 60 * 60 * 24 * 15) {
			const newToken = jwt.sign({ userID: decoded.userID }, JWT_SECRET, { expiresIn });
			await setJwtCookie(newToken, expiresIn);
		}

		return { user: user };
	} catch (error) {
		// Token verification failed or token expired
		return { user: null };
	}
}

export async function setJwtCookie(userID: string, maxAge: number): Promise<void> {
	const cookieStore = await cookies();
	console.log("THE USER ID IS "+userID)
	const expiresIn = 1000 * 60 * 60 * 24 * 30;
	var token = jwt.sign({ userID: userID,
	}, JWT_SECRET,{ expiresIn });
	cookieStore.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge,
		path: "/"
	});
}

export async function deleteJwtCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/"
	});
}

export async function getCurrentUser(cookieStore: NextRequest["cookies"]): Promise<SessionValidationResult> {
	// const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value ?? null;
	console.log("I AM YOUR TOKEN!" + token)
	if (token == null) {
		return { user: null };
	}
	const result = await validateJwtToken(token);

	return result;
};