import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const AVATAR_TYPES = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

function getS3Config() {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    return null;
  }
  return {
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    endpoint: process.env.S3_ENDPOINT,
    publicBaseUrl: process.env.S3_PUBLIC_URL_BASE,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  };
}

function buildPublicUrl(bucket: string, region: string, key: string, publicBaseUrl?: string) {
  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/+$/, "")}/${key}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

type ProfileBody = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  avatarFile?: File | null;
};

async function parseProfileBody(request: Request): Promise<ProfileBody> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Omit<ProfileBody, "avatarFile">;
    return body;
  }

  const formData = await request.formData();
  const readText = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : undefined;
  };
  const avatar = formData.get("avatar");
  return {
    name: readText("name"),
    email: readText("email"),
    currentPassword: readText("currentPassword"),
    newPassword: readText("newPassword"),
    avatarFile: avatar instanceof File && avatar.size > 0 ? avatar : null,
  };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await parseProfileBody(request);
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;
    const avatarFile = body.avatarFile ?? null;

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
    }

    let avatarUrl: string | undefined;
    if (avatarFile) {
      if (avatarFile.size > MAX_AVATAR_SIZE) {
        return NextResponse.json(
          { error: "Avatar must be 2MB or smaller." },
          { status: 400 }
        );
      }
      const extension = AVATAR_TYPES.get(avatarFile.type);
      if (!extension) {
        return NextResponse.json(
          { error: "Avatar must be a PNG, JPG, or WEBP image." },
          { status: 400 }
        );
      }

      const s3Config = getS3Config();
      if (!s3Config) {
        return NextResponse.json(
          { error: "Avatar storage is not configured." },
          { status: 500 }
        );
      }

      const key = `avatars/${user.id}/${randomUUID()}.${extension}`;
      const bytes = Buffer.from(await avatarFile.arrayBuffer());
      const client = new S3Client({
        region: s3Config.region,
        credentials: {
          accessKeyId: s3Config.accessKeyId,
          secretAccessKey: s3Config.secretAccessKey,
        },
        endpoint: s3Config.endpoint,
        forcePathStyle: s3Config.forcePathStyle,
      });

      await client.send(
        new PutObjectCommand({
          Bucket: s3Config.bucket,
          Key: key,
          Body: bytes,
          ContentType: avatarFile.type,
        })
      );

      avatarUrl = buildPublicUrl(
        s3Config.bucket,
        s3Config.region,
        key,
        s3Config.publicBaseUrl
      );
    }

    const updateData: {
      name: string;
      email: string;
      passwordHash?: string;
      avatarUrl?: string;
    } = { name, email };

    if (newPassword) {
      updateData.passwordHash = hashPassword(newPassword);
    }
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json(
      { message: newPassword ? "Profile and password updated." : "Profile updated." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
