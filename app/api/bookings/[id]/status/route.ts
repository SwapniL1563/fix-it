import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import type { NextApiRequest } from "next";
import { prisma } from "@/lib/prisma";
import type { RouteContext } from "next";

export async function GET( _req: NextRequest,{ params }: RouteContext<{ id: string }>) {

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    select: { paymentStatus: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ paymentStatus: booking.paymentStatus });
}
