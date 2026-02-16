import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ProfileBody = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProfileBody;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
    }

    if (newPassword || currentPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Current and new password are required." },
          { status: 400 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters." },
          { status: 400 }
        );
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { passwordHash: true },
      });
      if (!dbUser || !verifyPassword(currentPassword, dbUser.passwordHash)) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { name, email, passwordHash: hashPassword(newPassword) },
      });

      return NextResponse.json({ message: "Profile and password updated." }, { status: 200 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name, email },
    });

    return NextResponse.json({ message: "Profile updated." }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
