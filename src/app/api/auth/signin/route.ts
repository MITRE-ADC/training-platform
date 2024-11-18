import { NextResponse } from "next/server";
//export { handler as GET, handler as POST} from "@/db/auth";
import { HttpStatusCode } from "axios";
import { getUserByEmail, userEmailExists } from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";
import type { User } from "@/db/schema";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { email, password } = await req.json();
    try {
      const exists = await userEmailExists(email);
      if (!exists) {
        return NextResponse.json(
          { error: "This Email Has Not Been Registered" },
          { status: HttpStatusCode.BadRequest }
        );
      }
      const user = (await getUserByEmail(email)) as User;

      if (user && user.pass == password) {
        const maxAge = 24 * 3600 * 7;
        setJwtCookie(user.id, maxAge);

        await cookies();
        const response = NextResponse.json(
          { email: email },
          { status: HttpStatusCode.Ok }
        );

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
