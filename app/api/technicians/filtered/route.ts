import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req:NextRequest) {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const city = searchParams.get("city")

    try {
     const technician = await prisma.technician.findMany({
        where:{
            verified:true,
            ...(serviceId && { serviceId }),
            ...(city && {
                user:{
                    city:{ contains: city , mode:"insensitive"}
                }
            })
        } , include:{
            user:true,
            service:true,
        }
     });

     return NextResponse.json(technician)
    } catch(error) {
        return NextResponse.json({ error: "Failed to fetch technicians"} , { status: 500})
    }
}