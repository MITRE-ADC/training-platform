import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { deleteJwtCookie } from "@/lib/auth-middleware";
import { logout_user } from "@/app/api/webgoat/util";
import { cookies } from "next/headers";

export async function POST() {
  try {
    deleteJwtCookie();
    const cookieStore = cookies();

    const sessionCookie = cookieStore.get("webgoat-session")?.value ?? "";
    logout_user(sessionCookie);

    return NextResponse.json(
      { message: "Successfully signed out" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Signout Failed" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
