import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const services = await prisma.service.findMany({
     select: { id: true, name: true }
    });
    return NextResponse.json(services)
}