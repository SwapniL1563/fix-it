import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest,{params}: { params: Promise< {id:string}>}) {
    const { id } = await params;
    try {
    const technician = await prisma.technician.findUnique({
        where:{ userId:id},
        include:{
            user:true,
            service:true,
            reviews:true,
        }
    })

    if(!technician) {
        return NextResponse.json({
            error:"Technician not found"
        } , { status: 404})
    }

    return NextResponse.json(technician);
    } catch (error) {
        return NextResponse.json({
            error:"Error fetching technician"
        } , { status: 500})  
    }
}

export async function PATCH(req: Request, context: { params: Promise< { id: string }> }) {
  try {
    const { id } = await context.params;
    const { verified } = await req.json();

    // Check if technician exists
    const tech = await prisma.technician.findUnique({
      where: { id },
    });

    if (!tech) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    // Update verification
    const updatedTechnician = await prisma.technician.update({
      where: {id },
      data: { verified },
    });

    return NextResponse.json(updatedTechnician);
  } catch (err) {
    console.error("Error verifying technician:", err);
    return NextResponse.json({ error: "Failed to verify technician", details: String(err) }, { status: 500 });
  }
}


