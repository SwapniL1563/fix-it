import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { technicianId, date, description } = await req.json();

    const tech = await prisma.technician.findUnique({
      where: { id: technicianId },
      include: { service: true },
    });

    if (!tech) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        technicianId,
        date: new Date(date),
        description,
        status: "PENDING",
        paymentStatus: "UNPAID",
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
              name: `${tech.service.name} Service`,
              description: description || "Service Booking",
            },
            unit_amount: tech.service.price * 100, 
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?bookingId=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer`,
      metadata: { bookingId: booking.id },
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (session.user.role === "CUSTOMER") {
      const bookings = await prisma.booking.findMany({
        where: { customerId: session.user.id },
        include: {
          technician: { include: { user: true, service: true } },
          review: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const formatted = bookings.map((b) => ({
        id: b.id,
        date: b.date,
        description: b.description,
        status: b.status,
        paymentStatus: b.paymentStatus,
        review: b.review,
        technician: {
          id: b.technician.id,
          user: {
            name: b.technician.user.name,
            email: b.technician.user.email,
            city: b.technician.user.city,
            address: b.technician.user.address,
          },
          service: {
            name: b.technician.service.name,
            price: b.technician.service.price,
          },
        },
      }));

      return NextResponse.json(formatted);
    }

    if (session.user.role === "TECHNICIAN") {
      const technician = await prisma.technician.findUnique({
        where: { userId: session.user.id },
        include: { reviews: true },
      });

      if (!technician) {
        return NextResponse.json({ error: "Technician not found" }, { status: 404 });
      }

      const avgRating = technician.reviews.length
        ? (
            technician.reviews.reduce((sum, r) => sum + r.rating, 0) /
            technician.reviews.length
          ).toFixed(1)
        : "0";

      const bookings = await prisma.booking.findMany({
        where: { technicianId: technician.id },
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ bookings, avgRating });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
