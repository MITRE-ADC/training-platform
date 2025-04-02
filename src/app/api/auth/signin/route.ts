import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import {
  checkUserPassword,
  getUserByEmail,
  getCompleteUserByEmailNoAuth,
  userEmailExists,
  getUserIDByEmailNoAuth,
} from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import type { User } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { email, password } = await req.json();
    try {
      console.log("\n entering userEmailExists\n");
      const exists = await userEmailExists(email);
      console.log("\npassed userEmailExists\n");
      if (!exists) {
        return NextResponse.json(
          { error: "This Email Has Not Been Registered" },
          { status: HttpStatusCode.BadRequest }
        );
      }

      if (await checkUserPassword(email, password)) {
        const maxAge = 24 * 3600 * 7;
        const user = await getCompleteUserByEmailNoAuth(email); // FLAG: necessary?
        setJwtCookie(user.id, maxAge);

        const isAdmin = (email == process.env.ADMIN_USER_EMAIL);
        await cookies();
        const response = NextResponse.json(
          // { email: email, isAdmin: email == process.env.ADMIN_USER_EMAIL },
          {email: email, isAdmin: isAdmin},
          { status: HttpStatusCode.Ok }
        );

        // //autopopulation upon admin signing in
        // if (isAdmin && (typeof process.env.ADMIN_USER_EMAIL != "undefined")) {
        //   const admin_id = getUserIDByEmailNoAuth(process.env.ADMIN_USER_EMAIL);
        // // call api: POST api/webgoat/assignments

        // // example api call to the webgoat update; problem is that it requires a user_id
        // // axios.get(req("api/auth")).then(async (r) => {
        // //   const res = await axios
        // //     .post(`api/webgoat/assignments`, {
        // //       user_id: r.data.user.id,
        // //     })
        // //     .catch((e) => {
        // //       console.log(e);
        // //       console.log(e.response.data.error);
        // //       if (e.response.data.error.includes("Invalid username/password"))
        // //         setCredentialsDialogOpen(true);
        // //       //TODO: trigger webgoat credentials modal
        // //       else console.error(e);
        // //     })
        // //     .then(console.log);
        // // }

        // } else {
        //   return NextResponse.json(
        //     { error: "No Admin Credentials" },
        //     { status: HttpStatusCode.NetworkAuthenticationRequired }
        //   );
        // }

        return response;
      }
      return NextResponse.json(
        { error: "Wrong Password or Username" },
        { status: HttpStatusCode.BadRequest }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "User Creation Failed" },
        { status: HttpStatusCode.BadRequest }
      );
    }
  } else {
    return NextResponse.json(
      { error: "405 (custom) Method Not Allowed" },
      { status: HttpStatusCode.MethodNotAllowed }
    );
  }
}
