import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body for signature verification
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function buffer(readable: ReadableStream) {
  const chunks: Buffer[] = [];
  const reader = readable.getReader();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      chunks.push(Buffer.from(value));
    }
    done = readerDone;
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const buf = await buffer(req.body!);
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`📦 Stripe event received: ${event.type}`);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get bookingId from success_url query params
      const successUrl = new URL(session.success_url || "");
      const bookingId = successUrl.searchParams.get("bookingId");

      if (!bookingId) {
        console.error("❌ No bookingId found in success_url");
        return NextResponse.json({ error: "Booking ID missing" }, { status: 400 });
      }

      // Update booking payment status
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
