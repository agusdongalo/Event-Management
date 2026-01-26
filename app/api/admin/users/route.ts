import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

type CreateUserBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as CreateUserBody;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }

    const userRecord = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role: "ORGANIZER",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user: userRecord }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create organizer." }, { status: 500 });
  }
}
