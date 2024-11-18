import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth-middleware';


const admin_id = 'placeholder';

export async function middleware(request: NextRequest) {
    // const cookies = request.cookies;
    // const { user } = await getCurrentUser(cookies);
   
    // If the user is authenticated, continue as normal
    // if (user) {
    //     // if not admin dashboard, can just return
    //     // else we need to do a little further checking
    //     // if ((request.nextUrl.pathname.startsWith('/admin/dashboard'))) {
    //     //     return NextResponse.next();
    //     // }
    //   return NextResponse.next();
    //     // admin dashbaord, we need to check if admin user
    //     // if (user.id == admin_id) {
    //     //     return NextResponse.next();
    //     // }
    // }
   
    // Redirect to login page if not authenticated
    // return NextResponse.redirect(new URL('/signin', request.url))
  }
   
  export const config = {
    matcher: '/admin/:path*',
  }