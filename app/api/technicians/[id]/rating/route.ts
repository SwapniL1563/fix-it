import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(preq:NextRequest, context:{params:{id:string}}) {
    const { id } = context.params; 

    try {
        const avgRating = await prisma.review.aggregate({
            where:{technicianId:id},
            _avg:{ rating:true},
            _count:{rating:true}
        })

        return NextResponse.json({
            average:avgRating._avg.rating ?? 0,
            count: avgRating._count.rating,
        })
    } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
   }
}