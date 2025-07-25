"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TechnicianDashboard() {
  const router = useRouter();
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      const res = await axios.get("/api/technicians/verify-status");
      if (!res.data.verified) {
        router.push("/pending-approval");
      } else {
        setLoading(false)
      }
    };
    checkVerification();
  }, [router]);

  if(loading) return <div className="w-full min-h-screen flex justify-center items-center">
    <p>Checking verification...</p>
  </div>

  return (
    <div>
      <h1>Technician Dashboard</h1>
      <p>Welcome! You are verified.</p>
    </div>
  );
}
