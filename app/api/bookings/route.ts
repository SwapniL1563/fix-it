import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { error } from "console";

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

    let bookings;

    if(session.user.role === "CUSTOMER") {
        bookings = await prisma.booking.findMany({
            where:{customerId:session.user.id},
            include:{
                technician:{include:{user:true,service:true}}
            },
            orderBy:{ createdAt:"desc"}
        })
    } else if(session.user.role === "TECHNICIAN") {

        const technician = await prisma.technician.findUnique({
            where:{userId:session.user.id},
        })

        if(!technician) {
            return NextResponse.json({
                error:"Technician profile not found"
            },{ status:404})
        }

        bookings = await prisma.booking.findMany({
            where:{technicianId:technician.id},
            include:{
                customer:true
            },
            orderBy:{ createdAt:"desc"}
        })
    } else {
        return NextResponse.json({ error:"Unauthorised"}, { status:401})
    }


    return NextResponse.json(bookings)
}
