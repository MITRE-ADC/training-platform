// import {bcyptjs} from "bcryptjs";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { addUser, userEmailExists } from "@/db/queries";
import { getCurrentUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  return NextResponse.json(await getCurrentUser(req.cookies), {status: HttpStatusCode.MethodNotAllowed});

}
