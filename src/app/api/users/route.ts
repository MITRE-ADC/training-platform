import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

// TODO: move to api lib file somewhere?
import { processCreateUserRequest } from "./[id]/route";


// GET method for list of all users (undetailed?)
export async function GET(request: NextRequest) {
    // TEMP to sidestep linter :p
    const s = request.body;
    console.log(s);

    return NextResponse.json({message: "Not Implemented"}, {status: HttpStatusCode.NotImplemented})
}

export async function POST(request: NextRequest){
    return await processCreateUserRequest(request);
}