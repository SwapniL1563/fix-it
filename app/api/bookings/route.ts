// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {  prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  console.info("📌 [POST /api/bookings] Incoming request");

  try {
    const session = await getServerSession(authOptions);
    console.info("🔍 Session data:", session);

    if (!session || session.user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.info("📋 Booking request body:", body);

    // Ensure date is valid ISO format
    const dateObj = new Date(body.date);
    if (isNaN(dateObj.getTime())) {
      console.error("❌ Invalid date format:", body.date);
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    const isoDate = dateObj.toISOString();

    // Verify technician exists
    const technician = await prisma.technician.findUnique({
      where: { id: body.technicianId },
      include: { user: true },
    });
    console.info("👨‍🔧 Technician lookup result:", technician);

    if (!technician) {
      return NextResponse.json(
        { error: "Technician not found" },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        technicianId: body.technicianId,
        customerId: session.user.id,
        date: isoDate,
        description: body.description || "",
        status: "PENDING",
      },
    });
    console.info("✅ Booking created:", booking);

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking with ${technician.user.name}`,
            },
            unit_amount: 5000, // in cents, change to dynamic price if needed
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?bookingId=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    console.info("💳 Stripe Checkout Session created:", checkoutSession.id);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("❌ Booking error details:", {
      message: error.message,
      stack: error.stack,
      raw: error,
    });
    return NextResponse.json(
      { error: "Booking failed", details: error.message },
      { status: 500 }
    );
  }
}


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
