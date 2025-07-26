import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// update booking status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  try {
    // Get booking of the user
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // customer cancelling logic
    if (session.user.role === "CUSTOMER") {
      // Only allow cancelling own booking & only if status is PENDING
      if (booking.customerId !== session.user.id) {
        return NextResponse.json({ error: "Not your booking" }, { status: 403 });
      }

      if (status !== "CANCELLED" || booking.status !== "PENDING") {
        return NextResponse.json({ error: "Invalid cancellation request" }, { status: 400 });
      }
    }

    // technician booking update logic
    if (session.user.role === "TECHNICIAN") {
      if (booking.technicianId !== session.user.id) {
        return NextResponse.json({ error: "Not your booking" }, { status: 403 });
      }
    }

    // update the booking status
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}