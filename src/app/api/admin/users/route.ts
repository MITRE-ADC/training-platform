import { NextResponse } from "app/server"

//adding a new user to the system
export async function POST(request: Request) {
    return NextResponse.json({"msg": "Hello"})
}