import { getCurrentUser } from "@/lib/auth-middleware";
import { NextResponse, NextRequest } from "next/server";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";

//make env
const admin_email = process.env.ADMIN_USER_EMAIL;

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const user = await getCurrentUser(req.cookies);
    if (user.user == null) {
      return NextResponse.json({}, { status: 403 });
    }
    return NextResponse.json({
      user: user.user,
      isAdmin: user.user.email == admin_email,
    });
  }
  return NextResponse.json(await getCurrentUser(req.cookies), {
    status: HttpStatusCode.MethodNotAllowed,
  });
}
