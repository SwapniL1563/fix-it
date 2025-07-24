"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LoginPage(){


    const [ email,setEmail ] = useState("");
    const [password,setPassword] = useState("");
    const  [error,setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials",{
            email,password,redirect:false,
        });

        if(result?.error) {
            setError(result.error);
            return;
        }

        // fetch sessions to get role
        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();

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

    }

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input onChange={(e) =>  setEmail(e.target.value)} type="email" placeholder="email" value={email} required />
                <input onChange={(e) =>  setPassword(e.target.value)} type="password" placeholder="password" value={password} required />
                <button type="submit">Login</button>
            </form>
            { error && <p>{error}</p>}
        </div>
    )
}