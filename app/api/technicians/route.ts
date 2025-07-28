import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const technicians = await prisma.technician.findMany({
      include: {
        user: true,
        service: true,
        reviews:true,
      },
    });

    const technicianWithRatings = technicians.map((tech)=> {
      const avg = tech.reviews.length > 0 ? tech.reviews.reduce((sum,r) => sum + r.rating , 0) / tech.reviews.length : 0;
      return {
      ...tech,
      avgRating:avg.toFixed(1) 
      }
    })

    return NextResponse.json(technicianWithRatings);

  } catch (err) {
    console.error("Error fetching technicians:", err);
    return NextResponse.json(
      { error: "Failed to fetch technicians" },
      { status: 500 }
    );
  }
}

