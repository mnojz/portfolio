import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const existingOwner = await prisma.user.findFirst({
      where: { role: "OWNER" },
    });

    if (existingOwner) {
      return NextResponse.json(
        { message: "Owner account already initialized." },
        { status: 200 }
      );
    }

    const { username = "manoj", password = "password123" } = await req.json().catch(() => ({}));
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newOwner = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: "OWNER",
        avatarHat: "crown",
        avatarColor: "#F59E0B",
      },
    });

    return NextResponse.json({
      message: "Owner account created successfully.",
      user: { id: newOwner.id, username: newOwner.username, role: newOwner.role },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

