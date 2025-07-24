import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt'

export async function POST(req:NextRequest) {
   try {
     const body = await req.json();
    const { name , email , password , role, city , address} = body;
    
    // check if all required fields are present
    if(!name || !email || !password) {
        return NextResponse.json({
            error: "Missing required fields"
        } , { status : 400 })
    }

    // if present then check if user exists with same email
    const existingUser = await prisma.user.findUnique({
        where:{ email}
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

    return NextResponse.json({ user:newUser } , { status : 200})

   } catch (error) {
     console.error("Signup Error:", error);
     return NextResponse.json({ error: "Internal Server Error" } , { status: 500 })
   }

}