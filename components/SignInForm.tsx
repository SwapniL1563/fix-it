"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

interface Service {
  id: string;
  name: string;
  description?: string;
}

export default function SigninFormDemo() {
  const [ email,setEmail ] = useState("");
  const [password,setPassword] = useState("");
  const  [error,setError] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    try {
    setLoading(true);
    const result = await signIn("credentials",{
            email,password,redirect:false,
    });

    if(result?.error) {
            setError(result.error);
            toast.error("Invalid credentials!")
            return;
    }

    // fetch sessions to get role
    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();
    toast.success("Login successfully!");

    // redirecting the user based on role
    if(session?.user?.role === "CUSTOMER") {
            router.push("/dashboard/customer");
    } else if(session?.user?.role === "TECHNICIAN") {
            router.push("/dashboard/technician");
    } else if (session?.user?.role === "ADMIN") {
        router.push("/dashboard/admin");
    } else {
        router.push("/");
    }
    } catch(error){
        toast.error("Failed to login");
    }
     finally {
        setLoading(false)
    }

    }

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-300">
        Login to your account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-400 ">
        Login now to start booking technicians or offer services.
      </p>

      <form className="my-6 space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-[#ff7600] to-[#ff7600] font-medium text-white dark:text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-[#ff7600]
           hover:bg-[#4c00ff] mt-3 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in →"}
          <BottomGradient />
        </button>

        {msg && (
          <p className="text-center text-sm mt-2 text-green-600 dark:text-green-400">
            {msg}
          </p>
        )}
      </form>

      <h2 className="text-center">Don't have an have an account? <Link className="text-blue-400" href="/signup"> Signup now</Link></h2>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
