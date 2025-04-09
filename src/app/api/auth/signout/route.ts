import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { deleteJwtCookie } from "@/lib/auth-middleware";
import { logout_user } from "@/app/api/webgoat/util";

export async function POST() {
  try {
    deleteJwtCookie(); // Function to remove JWT cookie
    logout_user();

    console.log("Signed out");
    return NextResponse.json(
      { message: "Successfully signed out" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    console.error("Error during signout:", error);
    return NextResponse.json(
      { error: "Signout Failed" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
