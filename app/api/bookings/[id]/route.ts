import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import type { RouteContext } from "next";

export async function PATCH(req: NextRequest, context: RouteContext<{ id: string }>) {
  const { id } = context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (session.user.role === "CUSTOMER") {
      if (booking.customerId !== session.user.id) {
        return NextResponse.json({ error: "Not your booking" }, { status: 403 });
      }
      if (status !== "CANCELLED" || booking.status !== "PENDING") {
        return NextResponse.json({ error: "Invalid cancellation request" }, { status: 400 });
      }
    }

    if (session.user.role === "TECHNICIAN") {
      const tech = await prisma.technician.findUnique({
        where: { userId: session.user.id },
      });

      if (!tech || booking.technicianId !== tech.id) {
        return NextResponse.json({ error: "Not your booking" }, { status: 403 });
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
