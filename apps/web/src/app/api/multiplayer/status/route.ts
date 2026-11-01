import { NextResponse } from "next/server";

export async function GET() {
  // Uses Vercel service binding SERVER_URL, falling back to local port 2567 in dev
  const serverBaseUrl = process.env.SERVER_URL || "http://localhost:2567";

  try {
    const healthUrl = new URL("/health", serverBaseUrl).toString();
    const res = await fetch(healthUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { online: false, error: `Colyseus server returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      online: true,
      serviceBinding: process.env.SERVER_URL ? "active" : "local_fallback",
      serverData: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        online: false,
        serviceBinding: process.env.SERVER_URL ? "active" : "local_fallback",
        error: err.message,
      },
      { status: 503 }
    );
  }
}
