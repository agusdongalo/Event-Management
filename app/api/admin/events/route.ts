import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type EventStatus = "LIVE" | "UPCOMING" | "DRAFT";

type CreateEventBody = {
  title?: string;
  date?: string;
  venue?: string;
  status?: EventStatus;
  seats?: number;
  organizerId?: string;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatStatus = (status: EventStatus) => {
  switch (status) {
    case "LIVE":
      return "Live";
    case "DRAFT":
      return "Draft";
    default:
      return "Upcoming";
  }
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
  });

  return NextResponse.json({
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      date: formatDate(event.startAt),
      venue: event.venue,
      status: formatStatus(event.status),
      seats: event.capacity,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as CreateEventBody;
    const title = body.title?.trim();
    const venue = body.venue?.trim();
    const date = body.date?.trim();
    const status = body.status ?? "UPCOMING";
    const seats = body.seats ?? 0;

    const organizerId = body.organizerId?.trim();

    if (!title || !venue || !date || !organizerId) {
      return NextResponse.json(
        { error: "Title, date, venue, and organizer are required." },
        { status: 400 }
      );
    }

    const startAt = new Date(`${date}T00:00:00`);
    if (Number.isNaN(startAt.getTime())) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }

    if (!Number.isFinite(seats) || seats < 0) {
      return NextResponse.json(
        { error: "Seats must be a non-negative number." },
        { status: 400 }
      );
    }

    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
      select: { id: true, role: true },
    });

    if (!organizer || organizer.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Invalid organizer." }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        organizerId,
        title,
        venue,
        startAt,
        status,
        capacity: Math.floor(seats),
        description: "Created via admin dashboard.",
      },
    });

    return NextResponse.json(
      {
        event: {
          id: event.id,
          title: event.title,
          date: formatDate(event.startAt),
          venue: event.venue,
          status: formatStatus(event.status),
          seats: event.capacity,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Unable to create event." }, { status: 500 });
  }
}
