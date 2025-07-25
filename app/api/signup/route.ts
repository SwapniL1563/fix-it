import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt'

export async function POST(req:NextRequest) {
   try {
     const body = await req.json();
    const { name , email , password , role, city , address , bio, serviceId } = body;
    
    // check if all required fields are present
    if(!name || !email || !password || !role || !city) {
        return NextResponse.json({
            error: "Missing required fields"
        } , { status : 400 })
    }

    // if present then check if user exists with same email
    const existingUser = await prisma.user.findUnique({
        where:{ email }
    })

    if(existingUser) {
        return NextResponse.json({
         error: "User already exists"
        } , { status : 400 })
    }

    // if doesn't then hash the password and store user in Database
    const hashedPwd = await bcrypt.hash(password,10);

    const newUser = await prisma.user.create({
        data:{
            name,email,password:hashedPwd,role,city,address
        }
    })

    if(role === "TECHNICIAN") {
        if(!serviceId || !bio) {
            return NextResponse.json({error:"Technician details missing"},{ status:400})
        }


        // also making sure service exists
        const service = await prisma.service.findUnique({ where:{ id: serviceId}});
        if(!service) {
           return NextResponse.json({error:"TInvalid services selected"},{ status:400})  
        }

        // if exists then store in technician table
        await prisma.technician.create({
            data:{
                userId:newUser.id,
                serviceId:service.id,
                bio,
                verified:false,
            }
        })
    }

    return NextResponse.json({ user:newUser } , { status : 200})

   } catch (error) {
     console.error("Signup Error:", error);
     return NextResponse.json({ error: "Internal Server Error" } , { status: 500 })
   }

}