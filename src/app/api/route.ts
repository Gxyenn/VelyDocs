import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    VelyData: {
      Message: "Hai Welcome To Vely Docs, Apikey Anime Free, and Sub Indo.",
      Author: "Gxyenn",
      Status: "active"
    }
  });
}
