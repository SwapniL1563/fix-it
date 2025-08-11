import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false, // important for Stripe signature verification
  },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.arrayBuffer();
    const textBody = Buffer.from(rawBody).toString("utf8");

    event = stripe.webhooks.constructEvent(
      textBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Error verifying Stripe signature:", err);
    return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const bookingId = session.metadata?.bookingId;
      if (!bookingId) {
        console.error("❌ No bookingId in Stripe metadata");
        return NextResponse.json({ error: "Booking ID missing" }, { status: 400 });
      }

      // Mark booking as paid
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "PAID" },
      });

      console.log(`✅ Booking ${bookingId} marked as PAID`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Error handling Stripe webhook:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
