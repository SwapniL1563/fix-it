import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { technicianId, date, description } = await req.json();

  try {
    // Optional: get technician info (e.g., name, price)
    const technician = await prisma.technician.findUnique({
      where: { id: technicianId },
      include: { user: true },
    });

    if (!technician) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        technicianId,
        customerId: session.user.id,
        date,
        description,
        status: "PENDING",
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Booking with ${technician.user.name}`,
              description: description || "FixIt technician booking",
            },
            unit_amount: 5000, // Dynamically replace with technician.price * 100 if needed
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?bookingId=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?bookingId=${booking.id}`,
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

// PATCH route: Update booking status (e.g., cancel, complete)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });

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
  } catch (err) {
    console.error("Failed to update booking:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
