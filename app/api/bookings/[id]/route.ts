// app/api/bookings/[id]/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
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

    // CUSTOMER logic
    if (session.user.role === "CUSTOMER") {
      if (booking.customerId !== session.user.id) {
        return NextResponse.json({ error: "Not your booking" }, { status: 403 });
      }
      if (status !== "CANCELLED" || booking.status !== "PENDING") {
        return NextResponse.json({ error: "Invalid cancellation request" }, { status: 400 });
      }
    }

    // TECHNICIAN logic
    if (session.user.role === "TECHNICIAN") {
      const tech = await prisma.technician.findUnique({
        where: { userId: session.user.id },
      });

      if (!tech) {
        return NextResponse.json({ error: "Technician record not found" }, { status: 404 });
      }

      if (booking.technicianId !== tech.id) {
        return NextResponse.json({ error: "Not your booking" }, { status: 403 });
      }
    }

    // Update booking
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
