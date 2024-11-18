import { getCurrentUser } from '@/lib/auth-middleware';
import { NextResponse, NextRequest } from 'next/server';
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";

//make env
const admin_id = "placeholder";

export async function GET(req: NextRequest) {
    if (req.method === "GET") {
      const user = await getCurrentUser(await cookies() as any);
      if (user.user == null){
        return NextResponse.redirect(new URL('/signin', req.url));
      }
      
      if(user.user.id == admin_id) {
        return NextResponse.next();
      }
    // idrk what to do if they are signed in but not admin    
    }
    return NextResponse.json(await getCurrentUser(req.cookies), {status: HttpStatusCode.MethodNotAllowed});
  }
