import { NextResponse } from "next/server";

export async function GET() {
  const time = new Date();

  const upol = time.getDate();
  return Response.json({ upol }, { status: 201 });
}
