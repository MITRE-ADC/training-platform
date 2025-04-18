import { getCurrentCodes } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    if (req.method == "POST") {
        try {
            const data = await getCurrentCodes();

            const response = NextResponse.json(
                { data: data },
                { status: HttpStatusCode.Ok }
            );

            return response;

        } catch (error) {
            return NextResponse.json(
            { error: "Only admin may delete codes." },
            { status: HttpStatusCode.Forbidden }
            );
        }

    } else {
        return NextResponse.json(
            { error: "405 (custom) Method Not Allowed" },
            { status: HttpStatusCode.MethodNotAllowed }
        );
    }
}