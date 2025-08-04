import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const force = searchParams.get("force") === "true";

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json({ error: "Cannot delete admin users" }, { status: 400 });
    }
    
    const bookings = await prisma.booking.findMany({
      where: { customerId: id },
    });

    if (bookings.length > 0 && !force) {
      return NextResponse.json(
        { message: "User has related bookings", requiresConfirmation: true },
        { status: 409 }
      );
    }

    // Cascade delete if force is true
    if (force) {
      await prisma.booking.deleteMany({ where: { customerId: id } });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
