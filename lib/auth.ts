import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "ems_session";
const SESSION_DURATION_DAYS = 7;
const KEY_LENGTH = 64;

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "dev-only-session-secret-change-me";
}

function hashToken(token: string) {
  const secret = getSessionSecret();
  return scryptSync(token, secret, KEY_LENGTH).toString("hex");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;
  const derived = scryptSync(password, salt, KEY_LENGTH);
  const original = Buffer.from(originalHash, "hex");
  if (derived.length !== original.length) return false;
  return timingSafeEqual(derived, original);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.session.create({
    data: {
      userId,
      token: tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.session.deleteMany({
      where: { token: tokenHash },
    });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { token: tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({
      where: { id: session.id },
    });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session.user;
}
