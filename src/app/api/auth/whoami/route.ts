import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getCurrentUser } from "@/lib/auth-middleware";



export async function GET(req: NextRequest) {
  return NextResponse.json(await getCurrentUser(req.cookies), {status: HttpStatusCode.MethodNotAllowed});
}
