import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions);

    if(!session || session.user.role !== "CUSTOMER") {
        return NextResponse.json({error:"Unauthorized"},{
            status:401
        })
    }

    const { bookingId , rating , comment , technicianId } = await req.json();

    try {

        // check if customer has booking 
        const booking = await prisma.booking.findUnique({
            where:{id:bookingId},
            include:{review:true}
        });

        if(!booking || booking.customerId !== session.user.id){
            return NextResponse.json({
                error:"Invalid Booking"
            }, { status : 403})
        }
         
        // if booking is not completed
        if(booking.status !== "COMPLETED") {
            return NextResponse.json({ error:"Booking not completed"}, { status:400})
        }

        if(booking.review) {
            return NextResponse.json({ error: "Review already exists" }, { status: 400 }); 
        }

        // Verify that technicianId in review is same as booking.technicianId
        if (booking.technicianId !== technicianId) {
         return NextResponse.json({ error: "Technician mismatch" }, { status: 400 });
        }

        // create review now
        const review = await prisma.review.create({
            data:{
                bookingId,
                technicianId,
                customerId:session.user.id,
                rating,
                comment
            }
        });

        return NextResponse.json(review);
    } catch(error) {
        console.error("Review API error:", error);
        return NextResponse.json({ error:"Failed to create review"}, { status:500})
    }
}