import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req:NextRequest) {
    const { name, email , bio , city , address , serviceId} = await req.json();
    try{
        const hashedPassword = await bcrypt.hash("123456", 10)
        const user = await prisma.user.create({
            data:{
                name,email,city,address,password:hashedPassword,
                role:"TECHNICIAN"
            }
        });

        const technician = await prisma.technician.create({
            data:{
                userId:user.id,
                bio,
                serviceId,
                verified:false,
            }
        });

        return NextResponse.json(technician);
    } catch(err) {
        return NextResponse.json({ error:"Unable to add technician"}, { status:500})
    }
}
