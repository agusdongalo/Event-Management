import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type Body = {
  status?: "APPROVED" | "REJECTED";
  id?: string;
};

type Params = {
  params: { id: string };
};

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json()) as Body;
  const registrationId = params.id ?? body.id ?? "";
  if (!registrationId) {
    return NextResponse.json({ error: "Registration is required." }, { status: 400 });
  }

  if (!body.status || (body.status !== "APPROVED" && body.status !== "REJECTED")) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      event: { select: { organizerId: true } },
    },
  });

  if (!registration) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }
  if (registration.event.organizerId !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (registration.status !== "PENDING") {
    return NextResponse.json({ error: "Registration already processed." }, { status: 409 });
  }

  const updated = await prisma.registration.update({
    where: { id: registrationId },
    data: { status: body.status },
  });

  return NextResponse.json({ registration: updated }, { status: 200 });
}
