import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RegistrationBody = {
  eventId?: string;
  tier?: "VIP" | "PREMIUM" | "STANDARD";
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (user.role !== "USER") {
    return NextResponse.json({ error: "Only attendees can register." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as RegistrationBody;
    const eventId = body.eventId?.trim();
    const tier = body.tier ?? "STANDARD";

    if (!eventId) {
      return NextResponse.json({ error: "Event is required." }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, capacity: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const registrationsCount = await prisma.registration.count({
      where: {
        eventId,
        status: { in: ["PENDING", "APPROVED", "REGISTERED"] },
      },
    });

    if (registrationsCount >= event.capacity) {
      return NextResponse.json({ error: "Event is fully booked." }, { status: 409 });
    }

    const existing = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: user.id,
        },
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: "You are already registered." }, { status: 409 });
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId: user.id,
        tier,
        status: "PENDING",
      },
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "You are already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to register." }, { status: 500 });
  }
}
