import { clearExpiredCodes } from "@/db/queries";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

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
