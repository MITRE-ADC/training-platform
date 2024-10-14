import { NextResponse } from 'next/server'

// GET user information
export async function GET(request: Request) {
    return NextResponse.json({ msg: 'Hello from server' })
}