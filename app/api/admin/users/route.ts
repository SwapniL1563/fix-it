import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
             select: { id: true, name: true, email: true, role: true, city: true, address: true }
        });
        return NextResponse.json(users);
    }
    catch(error) {
        return NextResponse.json({error:"Unable to fetch all users"}, {
            status:500
        })
    }
}