import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

interface UserModel{
    email: string;
    first_name: string;
    last_name: string;
}

export async function processCreateUserRequest(request: NextRequest){
    const user_email = request.nextUrl.searchParams?.get("user_email");
    console.log(user_email);

    // TODO: password: special finagling with auth
    // Pick out (only) initialization data for use
    const body: Pick<UserModel, 'email' | 'first_name' | 'last_name'> = await request.json();
    console.log(body);

    return NextResponse.json({message: "Not Implemented"}, {status: HttpStatusCode.NotImplemented})
}

// Get data for a single user -- detailed
export async function GET(request: NextRequest) {
    // using email as the primary key
    const user_email = request.nextUrl.searchParams?.get("user_email");
    console.log(user_email);

    return NextResponse.json({message: "Not Implemented"}, {status: HttpStatusCode.NotImplemented})
}

// Create new user
export async function PUT(request: NextRequest){
    return await processCreateUserRequest(request);
}

// Modify user data -- detailed
export async function POST(request: NextRequest){
    const user_email = request.nextUrl.searchParams?.get("user_email");
    console.log(user_email);

    const body: UserModel = await request.json();
    console.log(body);

    return NextResponse.json({message: "Not Implemented"}, {status: HttpStatusCode.NotImplemented})
}
