import { getCurrentCodes } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

/**
 * Handles the POST request to retrieve current codes from the database.
 *
 * This function attempts to fetch current codes by invoking the `getCurrentCodes`
 * function. If the operation is successful, it returns a JSON response with an HTTP
 * status code of 200 (OK) and the data. If an error occurs (e.g., unauthorized access),
 * it returns a JSON response with an error message and an HTTP status code of 403 (Forbidden).
 *
 * @returns {Promise<NextResponse>} A promise that resolves to a JSON response indicating
 * the result of the operation.
 */
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
