import { NextResponse } from "next/server"

//adding a new user to the system
export async function POST(request: Request) {
    await request.json();
    return NextResponse.json({"msg": "Hello"})
}