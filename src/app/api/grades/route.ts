import { NextRequest, NextResponse } from "next/server"

//updateding/attaching a new grade to an assignment
export async function POST(request: NextRequest) {
    await request.json();
    return NextResponse.json({"msg": "Hello"});
}