// import {bcyptjs} from "bcryptjs";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { addUser, userEmailExists } from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  console.log('lmao');
  if (req.method === "POST") {
    console.log('start method');
    const { name, email, password } = await req.json();

    try {
      const x = await userEmailExists(email);
      if (x) {
        console.log('it should not reach this, email registered');
        return NextResponse.json({error: "This email has already been registered."}, {status: HttpStatusCode.BadRequest});
      }

      await db
        .insert(users)
        .values({ name: name, email: email, pass: password });

      
      // await addUser({name: name, email: email, pass: password});
      console.log("adding worked");
      let user = await userEmailExists(email);
      if (user != null){
        const maxAge = 24 * 3600 * 7;
        setJwtCookie(user.id, maxAge);
      }
      

      await cookies();
      return NextResponse.json({ name: name, email: email }, {status: HttpStatusCode.Ok});
    } catch (error) {
      console.log('signup cookie fail');
      console.log(error);
      return NextResponse.json({error: "User Creation Failed"}, {status: HttpStatusCode.BadRequest});
    }
  } else {
    return NextResponse.json({error: "405 (custom) Method Not Allowed"}, {status: HttpStatusCode.MethodNotAllowed});
  }
}
