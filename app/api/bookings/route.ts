import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  console.log("📌 [POST /api/bookings] Incoming request");

  const session = await getServerSession(authOptions);
  console.log("🔍 Session data:", session);

  if (!session || session.user.role !== "CUSTOMER") {
    console.warn("❌ Unauthorized booking attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { technicianId, date, description } = await req.json();
  console.log("📋 Booking request body:", { technicianId, date, description });

  try {
    // 1. Find technician
    const technician = await prisma.technician.findUnique({
      where: { id: technicianId },
      include: { user: true },
    });
    console.log("👨‍🔧 Technician lookup result:", technician);

    if (!technician) {
      console.warn("❌ Technician not found:", technicianId);
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    // 2. Create booking in DB
    const booking = await prisma.booking.create({
      data: {
        technicianId,
        customerId: session.user.id,
        date,
        description,
        status: "PENDING",
      },
    });
    console.log("✅ Booking created:", booking);

    // 3. Create Stripe checkout session
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
            unit_amount: 5000, // in paise
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
    console.log("💳 Stripe checkout session created:", checkoutSession.url);

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (err: any) {
    console.error("❌ Booking error details:", {
      message: err.message,
      stack: err.stack,
      raw: err,
    });
    return NextResponse.json(
      { error: "Booking failed", details: err.message },
      { status: 500 }
    );
  }
}
