import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "👋 Welcome to GaiaCraft API",
    docs: "/api/docs",
  });
}
