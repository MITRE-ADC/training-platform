import { NextResponse } from "next/server";
//export { handler as GET, handler as POST} from "@/db/auth";
import { HttpStatusCode } from "axios";
import { userEmailExists } from "@/db/queries";

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
      let user = await userEmailExists(email);
      if (!user) {
        console.log("querying error / may not exist idk");
        return NextResponse.json({error: "This email has not been registered."}, {status: HttpStatusCode.BadRequest});
      }

      if(user.pass == password) {
        console.log("SUCESSSS!!!!");
        return NextResponse.json({ email: email }, {status: HttpStatusCode.Ok});
      }
      return NextResponse.json({error: "wrong pass lil bro"}, {status: HttpStatusCode.BadRequest});
    } catch (error) {
      console.log('random error')
      return NextResponse.json({error: "User Creation Failed"}, {status: HttpStatusCode.BadRequest});
    }
  } else {
    console.log('wtf')
    return NextResponse.json({error: "405 (custom) Method Not Allowed"}, {status: HttpStatusCode.MethodNotAllowed});
  }
}