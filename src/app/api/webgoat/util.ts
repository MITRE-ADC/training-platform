import { NextResponse } from "next/server";
import { error } from "../util";

export const URL_webgoat_login = "http://localhost:8090/WebGoat/login";
export const URL_webgoat_register =
  "http://localhost:8090/WebGoat/register.mvc";
export const URL_webgoat_logout = "http://localhost:8090/WebGoat/logout";
export const URL_webgoat_lessonmenu =
  "http://localhost:8090/WebGoat/service/lessonmenu.mvc";

export async function login_user(
  username: string | null,
  password: string | null
): Promise<{ cookie: string; response: NextResponse | null }> {
  if (!username || !password)
    return { cookie: "", response: error("Please give username and password") };

  const response = await fetch(URL_webgoat_login, {
    method: "POST",
    redirect: "manual",
    body: `username=${username}&password=${password}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const redirect_loc = response.headers.get("location");
  if (!redirect_loc)
    return { cookie: "", response: error("Invalid username/password") };
  const validityResponse = await fetch(redirect_loc, {
    method: "GET",
  });

  if ((await validityResponse.text()).includes("Invalid username and password"))
    return { cookie: "", response: error("Invalid username/password") };

  return { cookie: response.headers.get("set-cookie") ?? "", response: null };
}

export async function register_user(
  webgoat_username: string,
  webgoat_password: string
) {
  const response = await fetch(URL_webgoat_register, {
    method: "POST",
    redirect: "follow",
    body: `username=${webgoat_username}&password=${webgoat_password}&matchingPassword=${webgoat_password}&agree=agree`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const textResponse = await response.text();

  if (textResponse.includes("passwords do not match"))
    return error("auth/password_mismatch");
  if (textResponse.includes("size must be between 6 and 45"))
    return error("auth/username_invalid");
  if (textResponse.includes("size must be between 6 and 10"))
    return error("auth/password_invalid");

  return undefined;
}

export async function logout_user(cookie: string) {
  console.log(`logging out...`);
  const response = await fetch("http://localhost:8090/WebGoat/logout", {
    method: "GET",
    credentials: "include", // Let browser send session cookie
    redirect: "follow",
  });
  return response;
}
