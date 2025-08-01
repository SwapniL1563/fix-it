"use client"

import SignupForm from "@/components/SignuForm";
import { toast } from "react-toastify";

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center bg-[#000000] min-h-screen w-full">
            <SignupForm/> 
        </div>
    )
}