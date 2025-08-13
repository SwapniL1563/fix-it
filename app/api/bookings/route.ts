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

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let whereClause: any = {};

    // CUSTOMER → fetch their own bookings
    if (session.user.role === "CUSTOMER") {
      if (!session.user.id) {
        console.error("❌ Missing session.user.id for CUSTOMER");
        return NextResponse.json({ bookings: [], avgRating: "0" });
      }
      whereClause.customerId = session.user.id;
    }

    // TECHNICIAN → fetch bookings for their technician profile
    if (session.user.role === "TECHNICIAN") {
      if (!session.user.id) {
        console.error("❌ Missing session.user.id for TECHNICIAN");
        return NextResponse.json({ bookings: [], avgRating: "0" });
      }

      const tech = await prisma.technician.findUnique({
        where: { userId: session.user.id },
      });

      if (!tech) {
        console.warn("⚠️ No technician profile found for user:", session.user.id);
        return NextResponse.json({ bookings: [], avgRating: "0" });
      }

      whereClause.technicianId = tech.id;
    }

    // Fetch bookings with related technician + customer
    let bookings = [];
    try {
      bookings = await prisma.booking.findMany({
        where: whereClause,
        include: {
          technician: {
            include: {
              user: {
                select: { id: true, name: true, email: true, city: true, address: true },
              },
              service: { select: { name: true } },
            },
          },
          customer: {
            select: { id: true, name: true, email: true, address: true, city: true },
          },
          review: { select: { id: true, rating: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (err: any) {
      console.error("❌ Booking query failed:", err.message, err.stack);
      return NextResponse.json({ error: "Booking query failed" }, { status: 500 });
    }

    // Calculate average rating if TECHNICIAN
    let avgRating = "0";
    if (session.user.role === "TECHNICIAN" && whereClause.technicianId) {
      try {
        const reviews = await prisma.review.findMany({
          where: { booking: { technicianId: whereClause.technicianId } },
          select: { rating: true },
        });

        if (reviews.length > 0) {
          const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
          avgRating = (sum / reviews.length).toFixed(1);
        }
      } catch (err: any) {
        console.error("⚠️ Review query failed:", err.message);
      }
    }

    return NextResponse.json({ bookings, avgRating });
  } catch (error: any) {
    console.error("❌ GET /api/bookings error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
}



