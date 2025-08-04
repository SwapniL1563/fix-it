import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const tech = await prisma.technician.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!tech) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    await prisma.booking.deleteMany({ where: { technicianId: id } });

    await prisma.technician.delete({ where: { id } });
    if (tech.user?.id) {
      await prisma.user.delete({ where: { id: tech.user.id } });
    }

    return NextResponse.json({ message: "Technician deleted successfully" });
  } catch (err) {
    console.error("Delete technician error:", err);
    return NextResponse.json({ error: "Failed to delete technician" }, { status: 500 });
  }
}
