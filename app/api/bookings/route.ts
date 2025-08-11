// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {

  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const dateObj = new Date(body.date);
    if (isNaN(dateObj.getTime())) {
      console.error("❌ Invalid date format:", body.date);
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    const isoDate = dateObj.toISOString();

    const technician = await prisma.technician.findUnique({
      where: { id: body.technicianId },
      include: {
        user: true,
        service: true, 
      },
    });

    if (!technician) {
      return NextResponse.json(
        { error: "Technician not found" },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        technicianId: body.technicianId,
        customerId: session.user.id,
        date: isoDate,
        description: body.description || "",
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
          description: booking.description || "FixIt technician booking",
        },
        unit_amount: technician.service.price * 100, 
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId: session.user.id },
      include: {
        technician: {
          include: {
            user: true,
            service: true,
          },
        },
        review: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("❌ Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
}
