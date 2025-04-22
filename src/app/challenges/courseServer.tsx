"use server";

import { req } from "@/lib/utils";
import axios from "axios";
import { Course } from "./courseDefinitions";
import "@/db/queries";
import { getUser, updateUser } from "@/db/queries";
import { User } from "@/db/schema";
import { NextResponse } from "next/server";
import { login_user } from "../api/webgoat/util";

export async function updateWebgoatUserCredentialsAndData(
  username: string,
  password: string
) {
  let res = undefined;
  await axios.get(req("api/auth")).then(async (r) => {
    const updateRes = await updateWebgoatUserCredentials(
      r.data.user.id,
      username,
      password
    );
    if (updateRes) res = "Error updating user data";

    const loginRes = await login_user(username, password);
    if (loginRes) res = "Invalid username/password";
  });

  return res;
}

export async function updateWebgoatUserCredentials(
  user_id: string,
  username: string,
  password: string
) {
  const user = await getUser(user_id);
  if (user instanceof NextResponse) return user;

  const newUser: Omit<User, "pass"> = {
    ...user,
    id: user_id,
    webgoatusername: username,
    webgoatpassword: password,
  };
  await updateUser(newUser);

  return undefined;
}

export async function getAssignmentDataTest(): Promise<Course[]> {
  try {
    const authResponse = await axios.get(req("api/auth"));
    const id = authResponse.data.user.id;

    const assignmentsResponse = await axios.get(req("api/user_assignments"), {
      params: { userId: id },
    });
    const assignments: Course[] = assignmentsResponse.data;
    return assignments;
  } catch (error) {
    return [];
  }
}
