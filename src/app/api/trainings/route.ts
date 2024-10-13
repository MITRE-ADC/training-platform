import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";


// GET method for all trainings
export async function GET(request: NextRequest) {
    console.log(request.body);

    return NextResponse.json({message: "Not Implemented"}, {status: HttpStatusCode.NotImplemented})
}