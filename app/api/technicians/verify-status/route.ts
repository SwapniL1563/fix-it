import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);
    if(!session || session.user.role !== "TECHNICIAN") {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
    }

    if (!session?.user?.id) {
    return new Response(JSON.stringify({ verified: false }), { status: 401 });
    }

    const technician = await prisma.technician.findUnique({
    where: { userId: session.user.id },
    select: { verified: true },
  });

  return NextResponse.json({ verified: technician?.verified ?? false });
}