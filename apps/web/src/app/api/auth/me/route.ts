import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mosswood-super-secret-jwt-key-2026";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

