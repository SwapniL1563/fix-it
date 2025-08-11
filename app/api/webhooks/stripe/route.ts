import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // ✅ Important: Use req.text() in App Router to get raw body
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error("No bookingId in metadata");
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    try {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "PAID" },
      });
      console.log(`Booking ${bookingId} marked as PAID`);
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  }

  return NextResponse.json({ received: true });
}
