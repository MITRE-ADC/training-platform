import { NextResponse } from "next/server";
import { error } from "../util";

export const URL_webgoat_login = "http://localhost:8090/WebGoat/login";
export const URL_webgoat_logout = "http://localhost:8090/WebGoat/logout";
export const URL_webgoat_lessonmenu =
  "http://localhost:8090/WebGoat/service/lessonmenu.mvc";

// DANGER: password in plaintext over hopefully https but otherwise http
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

  console.log(`loggin in...`);

  const redirect_loc = response.headers.get("location");
  if (!redirect_loc)
    return { cookie: "", response: error("Invalid username/password") };
  const validityResponse = await fetch(redirect_loc, {
    method: "GET",
  });

  if ((await validityResponse.text()).includes("Invalid username and password"))
    return { cookie: "", response: error("Invalid username/password") };

  return { cookie: response.headers.getSetCookie()[0], response: null };
}

export async function logout_user(){
  console.log(`loggin out...`);
  const response = await fetch(URL_webgoat_logout, {
    method: "POST",
    redirect: "follow",
  });

  return response;
}
