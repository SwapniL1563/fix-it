import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include:{
                customer:true,
                technician:{
                    include:{
                        user:true,
                        service:true,
                    }
                },
            },
            orderBy:{
                createdAt:"desc"
            }
        });
        return NextResponse.json(bookings);
    }
    catch(error) {
        return NextResponse.json({error:"Unable to fetch all bookings"}, {
            status:500
        })
    }
}