import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./lib/prisma";

export async function middleware(req:NextRequest) {
    const token = await getToken({ req, secret:process.env.NEXTAUTH_SECRET});

    const {pathname} = req.nextUrl;

    // redirect to login if unauthorized
    if(pathname.startsWith("/dashboard") && !token) {
        return NextResponse.redirect(new URL("/login",req.url));
    }

    // role based access
    if(pathname.startsWith("/dashboard/customer") && token?.role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/login",req.url));
    }

    if (pathname.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
    }
    
    if (pathname.startsWith("/dashboard/technician") && token?.role !== "TECHNICIAN") {
    return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher:["/dashboard/:path*"],
}