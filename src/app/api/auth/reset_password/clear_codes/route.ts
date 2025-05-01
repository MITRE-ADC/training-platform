import { clearExpiredCodes } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";


/**
 * Handles the DELETE request to clear expired codes from the database.
 *
 * This function attempts to delete expired codes by invoking the `clearExpiredCodes` 
 * function. If the operation is successful, it returns a JSON response with an HTTP 
 * status code of 200 (OK). If an error occurs (e.g., unauthorized access), it returns 
 * a JSON response with an error message and an HTTP status code of 403 (Forbidden).
 *
 * @returns {Promise<NextResponse>} A promise that resolves to a JSON response indicating 
 * the result of the operation.
 */
export async function DELETE() {
  try {
    await clearExpiredCodes();

    const response = NextResponse.json({ status: HttpStatusCode.Ok });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Only admin may delete codes." },
      { status: HttpStatusCode.Forbidden }
    );
  }
}
