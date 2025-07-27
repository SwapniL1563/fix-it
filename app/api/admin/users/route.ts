import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const bookings = await prisma.user.findMany({
             select: { id: true, name: true, email: true, role: true, city: true, address: true }
        });
        return NextResponse.json(bookings);
    }
    catch(err) {
        return NextResponse.json({error:"Unable to fetch all users"}, {
            status:500
        })
    }
}