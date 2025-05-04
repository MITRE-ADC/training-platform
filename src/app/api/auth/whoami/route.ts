import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getCurrentUser } from "@/lib/auth-middleware";

/*
 * @description This route is used to get the current user.
 * @route GET /api/auth/whoami
 * @returns {object} - The current user object.
 */

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const user = await getCurrentUser(req.cookies);
    if (user.user == null) {
      return NextResponse.json({}, { status: 403 });
    }
    return NextResponse.json(await getCurrentUser(req.cookies), {
      status: HttpStatusCode.Ok,
    });
  }
  return NextResponse.json(await getCurrentUser(req.cookies), {
    status: HttpStatusCode.MethodNotAllowed,
  });
}
