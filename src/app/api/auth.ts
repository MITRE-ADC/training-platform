import { getCurrentUser } from "@/lib/auth-middleware";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { error } from "./util";

/**
 * returns a response to send to user if they are not admin, undefined if admin
 */
export async function CHECK_ADMIN() {
  const result = await fetch("/api/auth");
  if (result && result.status == HttpStatusCode.Ok) {
    const body = await result.json();
    if (body && body.isAdmin && body.isAdmin == true) {
      return undefined;
    }
  }
  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}
/**
 * returns a response to send to user if they are unauthoried, undefined if authorized (passed user_email matches current session)
 */
export async function CHECK_UNAUTHORIZED(user_email: string) {
  // admin also can see this
  if (!CHECK_ADMIN()) {
    return undefined;
  }
  const result = await fetch("/api/auth");
  if (result && result.status == HttpStatusCode.Ok) {
    const body = await result.json();
    if (body && body.user && body.user.email == user_email) {
      return undefined;
    }
  }
  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}

export async function CHECK_UNAUTHORIZED_BY_UID(user_id: string) {
  // admin also can see this
  if (!CHECK_ADMIN()) {
    return undefined;
  }
  const result = await fetch("/api/auth");
  if (result && result.status == HttpStatusCode.Ok) {
    const body = await result.json();
    if (body && body.user && body.user.id == user_id) {
      return undefined;
    }
  }
  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}

// export async function CHECK_UNAUTHORIZED_BY_NAME(username: string) {
//   // admin also can see this
//   if (!CHECK_ADMIN()) {
//     return undefined;
//   }
//   const result = await fetch("/api/auth");
//   if (result && result.status == HttpStatusCode.Ok) {
//     const body = await result.json();
//     if (body && body.user && body.user.name == username) {
//       return undefined;
//     }
//   }
//   return error(`unauthorized`, HttpStatusCode.Unauthorized);
// }

/**
 * returns a response to send to user if they are not logged in as a valid user, undefined if they are ANY user
 */
export async function CHECK_SESSION() {
  const result = await fetch("/api/auth");
  if (result && result.status == HttpStatusCode.Ok) {
    const body = await result.json();
    if (body && body.user) {
      return undefined;
    }
  }
  return error(`unauthorized`, HttpStatusCode.Unauthorized);
}
