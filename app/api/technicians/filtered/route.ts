import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");
  const search = searchParams.get("search");

  try {
    const technicians = await prisma.technician.findMany({
      where: {
        verified: true,
        ...(serviceId && { serviceId }),
        ...(search && {
          OR: [
          { user: { name: { contains: search, mode: "insensitive" } } },
          { user: { city: { contains: search, mode: "insensitive" } } },
          ]
        }),
      },
      include: {
        user: true,
        service: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const techniciansWithRatings = technicians.map((tech) => {
      const ratings = tech.reviews.map((r) => r.rating);
      const avgRating = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
      return {
        ...tech,
        avgRating: parseFloat(avgRating.toFixed(1)),
      };
    });

    return NextResponse.json(techniciansWithRatings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch technicians" },
      { status: 500 }
    );
  }
}
