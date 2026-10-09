import { NextResponse } from "next/server";

/* Example route handler. Client validates the payload with HealthSchema. */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    version: "0.1.0",
  });
}
