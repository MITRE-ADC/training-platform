// import {bcyptjs} from "bcryptjs";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { addUser, userEmailExists } from "@/db/queries";
import { getCurrentUser } from "@/lib/auth-middleware";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(await cookies() as any);
  if (user.user == null){
    return NextResponse.json({}, {status:403});
  }
  return NextResponse.json(await getCurrentUser(req.cookies), {status: HttpStatusCode.MethodNotAllowed});

}
