import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const technicians = await prisma.technician.findMany({
      include: {
        user: true,
        service: true,
      },
    });

    return NextResponse.json(technicians);
  } catch (err) {
    console.error("Error fetching technicians:", err);
    return NextResponse.json(
      { error: "Failed to fetch technicians" },
      { status: 500 }
    );
  }
}
