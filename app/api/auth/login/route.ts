import { NextResponse } from "next/server";
import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    let isValidPassword = verifyPassword(password, user.passwordHash);

    // Dev-friendly fallback: allow legacy/plaintext DB records once, then upgrade to secure hash.
    if (!isValidPassword && !user.passwordHash.includes(":") && user.passwordHash === password) {
      const upgradedHash = hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: upgradedHash },
      });
      isValidPassword = true;
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to login." }, { status: 500 });
  }
}
