import { cookies } from "next/headers";
import { cache } from "react";
import jwt from "jsonwebtoken";

const JWT_SECRET = "temp_key_for_now"; // Define your secret in env variables

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
// ...

export async function validateJwtToken(token: string): Promise<SessionValidationResult> {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, exp: number };
		const result = await db
			.select({ user: userTable, session: sessionTable })
			.from(sessionTable)
			.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
			.where(eq(sessionTable.userId, decoded.userId));

		if (result.length < 1) {
			return { session: null, user: null };
		}

		const { user, session } = result[0];

		// Extend expiration if token is near expiry (15 days or less remaining)
		const expiresIn = 1000 * 60 * 60 * 24 * 30; // 30 days
		if (Date.now() >= decoded.exp * 1000 - 1000 * 60 * 60 * 24 * 15) {
			const newToken = jwt.sign({ userId: session.userId }, JWT_SECRET, { expiresIn });
			await setJwtCookie(newToken, expiresIn);
		}

		return { session, user };
	} catch (error) {
		// Token verification failed or token expired
		return { session: null, user: null };
	}
}

export async function setJwtCookie(userID: string, maxAge: number): Promise<void> {
	const cookieStore = await cookies();
	var token = userID;
	var token = jwt.sign({ userID: userID, exp: maxAge }, process.env.JWT_SECRET);
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

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value ?? null;
	if (!token) {
		return { session: null, user: null };
	}
	const result = await validateJwtToken(token);
	return result;
});