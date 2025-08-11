// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
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

    // Validate date
    const dateObj = new Date(body.date);
    if (isNaN(dateObj.getTime())) {
      console.error("❌ Invalid date format:", body.date);
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    const isoDate = dateObj.toISOString();

    // Fetch technician and their service with price
    const technician = await prisma.technician.findUnique({
      where: { id: body.technicianId },
      include: {
        user: true,
        service: true, // 👈 This pulls in service name & price
      },
    });
    console.info("👨‍🔧 Technician lookup result:", technician);

    if (!technician) {
      return NextResponse.json(
        { error: "Technician not found" },
        { status: 404 }
      );
    }

    const priceInCents = technician.service.price * 100; // Stripe uses cents
    console.info(`💰 Service Price: ${technician.service.price} (${priceInCents} cents)`);

    // Create booking in DB
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
    // Inside stripe.checkout.sessions.create
    const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: `Booking with ${technician.user.name} (${technician.service.name})`,
        },
        unit_amount: technician.service.price * 100, // convert INR to paise
      },
      quantity: 1,
    },
    ],
    mode: "payment",
     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?bookingId=${booking.id}`,
     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
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
