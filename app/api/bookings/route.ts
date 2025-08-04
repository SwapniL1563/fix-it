import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req:NextRequest){
    const session = await getServerSession(authOptions);

    if(!session || session.user.role !== "CUSTOMER"){
        return NextResponse.json({
            error:"Unauthorised"
        }, {
            status:401
        })
    };

    try {
        const { technicianId , date , description } = await req.json();
        const techExists = await prisma.technician.findUnique({ where: { id: technicianId } });
        if (!techExists) {
        return NextResponse.json({ error: "Technician not found" }, { status: 404 });
        }

        const booking = await prisma.booking.create({
            data:{
                customerId:session.user.id,
                technicianId,
                date:new Date(date),
                description,
            }
        });

        return NextResponse.json(booking);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}


export async function GET() {
    const session = await getServerSession(authOptions);

    if(!session){
    return NextResponse.json({
            error:"Unauthorised"
        }, {
            status:401
        })
    }

    try{
    let bookings;

    if(session.user.role === "CUSTOMER") {
        bookings = await prisma.booking.findMany({
            where:{customerId:session.user.id},
            include:{
                technician:{include:{user:true,service:true}},
                review:true,
            },
            orderBy:{ createdAt:"desc"}
        });

        const formatted = bookings.map((b) => ({
        id: b.id,
        date: b.date,
        description: b.description,
        status: b.status,
        review: b.review,
        technician: {
          id: b.technician.id,
          user: {
            name: b.technician.user.name,
            email: b.technician.user.email,
            city: b.technician.user.city,
            address: b.technician.user.address,
          },
          service: {
            name: b.technician.service.name,
          },
          },
         }));

        return NextResponse.json(formatted);


    } if(session.user.role === "TECHNICIAN") {

        const technician = await prisma.technician.findUnique({
            where:{userId:session.user.id},
            include:{ reviews:true }
        })

        if(!technician) {
            return NextResponse.json({
                error:"Technician profile not found"
            },{ status:404})
        }

        const ratings = technician.reviews.map((r) => r.rating);
        const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0";

        bookings = await prisma.booking.findMany({
            where:{technicianId:technician.id},
            include:{
                customer:true,
            },
            orderBy:{ createdAt:"desc"}
        });

        return NextResponse.json({bookings,avgRating});
    } 

    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

