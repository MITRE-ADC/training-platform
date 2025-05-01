import { getCurrentUser } from "@/lib/auth-middleware";
import { getCurrentUserAndAdmin } from "@/lib/auth-middleware";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { error } from "./util";

/**
 * 
 * @returns undefined if user is admin, error response if not
 */
export async function CHECK_ADMIN() {
  const cookieStore = await cookies();
  const user = await getCurrentUserAndAdmin(cookieStore);

  if (user.isAdmin) return undefined;

  return error(`unauthorized as admin`, HttpStatusCode.Unauthorized);
}
/**
 * @returns a response to send to user if they are unauthoried, undefined if authorized (passed user_email matches current session)
 */
export async function CHECK_UNAUTHORIZED(user_email: string) {
  if ((await CHECK_ADMIN()) === undefined) {
    return undefined;
  }

  const cookieStore = await cookies();
  const user = await getCurrentUserAndAdmin(cookieStore);
  if (user.user != null && user.user.email == user_email) {
    return undefined;
  }

  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}

/**
 * @returns a response to send to user if they are unauthoried, undefined if authorized (passed user_id matches current session)
 */
export async function CHECK_UNAUTHORIZED_BY_UID(user_id: string) {
  if ((await CHECK_ADMIN()) === undefined) {
    return undefined;
  }

  const cookieStore = await cookies();
  const user = await getCurrentUserAndAdmin(cookieStore);
  if (user.user != null && user.user.id == user_id) {
    return undefined;
  }

  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}

/**
 * returns a response to send to user if they are not logged in as a valid user, undefined if they are ANY user
 */
export async function CHECK_SESSION() {
  const cookieStore = await cookies();
  const result = await getCurrentUserAndAdmin(cookieStore);
  if (result.user != null) {
    return undefined;
  }
  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}
