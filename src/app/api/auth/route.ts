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
        return NextResponse.json({}, {status:403});;
      }
        return NextResponse.json({user: user.user, isAdmin: (user.user.id == admin_id)})  
    }
    return NextResponse.json(await getCurrentUser(req.cookies), {status: HttpStatusCode.MethodNotAllowed});
  }