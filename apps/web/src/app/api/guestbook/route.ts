import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ entries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorName, message, avatarColor } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        authorName: authorName ? authorName.slice(0, 20) : "Wandering Traveler",
        message: message.slice(0, 300),
        avatarColor: avatarColor || "#3B82F6",
      },
    });

    return NextResponse.json({ entry });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

