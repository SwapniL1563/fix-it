import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  const { status } = await req.json();

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted booking successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
