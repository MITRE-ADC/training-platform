import { NextResponse } from "next/server";
//export { handler as GET, handler as POST} from "@/db/auth";
import { HttpStatusCode } from "axios";
import { getUserByEmail, userEmailExists } from "@/db/queries";
import { setJwtCookie } from "@/lib/auth-middleware";
import { cookies } from "next/headers";

// adding a new user to the system
// export async function POST(request: Request) {
//   console.log(signIn);
//   return NextResponse.json({message: "placeholder"}, {status: HttpStatusCode.Ok});
// }

export async function POST(req: Request) {
  console.log("starting")
  if (req.method === "POST") {
    const { email, password } = await req.json();
    console.log("signin ");
    try {
      const exists = await userEmailExists(email);
      if (!exists) {
        console.log("querying error / may not exist idk");
        return NextResponse.json({error: "This email has not been registered."}, {status: HttpStatusCode.BadRequest});
      }

      const user = await getUserByEmail(email);
      if(user.pass == password) {
        console.log("SUCESSSS!!!!");

        const maxAge = 24 * 3600 * 7;
        setJwtCookie(user.id, maxAge);

        await cookies();
        const response = NextResponse.json({ email: email }, {status: HttpStatusCode.Ok});

        return response;
      }
      return NextResponse.json({error: "wrong pass lil bro"}, {status: HttpStatusCode.BadRequest});
    } catch (error) {
      console.log('random error');
      console.log(error);
      return NextResponse.json({error: "User Creation Failed"}, {status: HttpStatusCode.BadRequest});
    }
  } else {
    console.log('wtf')
    return NextResponse.json({error: "405 (custom) Method Not Allowed"}, {status: HttpStatusCode.MethodNotAllowed});
  }
}
