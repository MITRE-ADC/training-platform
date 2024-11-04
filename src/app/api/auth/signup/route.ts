// import {bcyptjs} from "bcryptjs";
import { db } from "@/db/index";
import { accounts, users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { addUser, userEmailExists } from "@/db/queries";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const { name, email, password } = await req.json();

    try {
      const x = await userEmailExists(email);
      if (x) {
        return NextResponse.json({error: "This email has already been registered."}, {status: HttpStatusCode.BadRequest});
      }

      await db
        .insert(users)
        .values({ name: name, email: email, pass: password });

      
      // await addUser({name: name, email: email, pass: password});

      return NextResponse.json({ name: name, email: email }), {status: HttpStatusCode.Ok};
    } catch (error) {
      return NextResponse.json({error: "User Creation Failed"}, {status: HttpStatusCode.BadRequest})
    }
  } else {
    return NextResponse.json({error: "405 (custom) Method Not Allowed"}, {status: HttpStatusCode.MethodNotAllowed})
  }
}
