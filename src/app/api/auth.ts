import { getCurrentUser } from "@/lib/auth-middleware";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { error } from "./util";

/**
 * returns a response to send to user if they are not admin, undefined if admin
 */
export async function CHECK_ADMIN() {
  const cookieStore = cookies();
  const result = await getCurrentUser(cookieStore);
  if (result.user && result.user.email == process.env.ADMIN_USER_EMAIL)
    return undefined;

  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}
/**
 * returns a response to send to user if they are unauthoried, undefined if authorized (passed user_id matches current session)
 */
export async function CHECK_UNAUTHORIZED(user_id: string) {
  const cookieStore = cookies();
  const result = await getCurrentUser(cookieStore);
  if (result.user && result.user.email == process.env.ADMIN_USER_EMAIL)
    return undefined;

  if (!(result && result.user && result.user.id == user_id)) {
    return error(`unauthorized`, HttpStatusCode.Unauthorized);
  }

  return undefined;
}

/**
 * returns a response to send to user if they are not logged in as a valid user, undefined if they are ANY user
 */
export async function CHECK_SESSION() {
  const cookieStore = cookies();
  const result = await getCurrentUser(cookieStore);
  if (!result || !result.user)
    return error(`unauthorized`, HttpStatusCode.Unauthorized);
  else return undefined;
}
