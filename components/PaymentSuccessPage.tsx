"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");
  const [status, setStatus] = useState<"loading" | "paid" | "unpaid">("loading");
  const router = useRouter();

  useEffect(() => {
    if (!bookingId) return;

    const checkStatus = async () => {
      try {
        await new Promise((res) => setTimeout(res, 2000));
        const res = await axios.get(`/api/bookings/${bookingId}/status`);
        if (res.data.paymentStatus === "PAID") {
          setStatus("paid");
        } else {
          setStatus("unpaid");
        }
      } catch (err) {
        console.error("Error fetching booking status", err);
        setStatus("unpaid");
      }
    };

    checkStatus();
  }, [bookingId]);

  if (status === "loading") {
    return <p className="text-center mt-10">Verifying payment...</p>;
  }

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      {status === "paid" ? (
        <>
          <h1 className="text-xl font-bold text-green-500">
            Payment successful!
          </h1>
          <button
            onClick={() => router.push("/dashboard/customer")}
            className="bg-[#ff7600] font-medium text-black px-4 py-2 rounded"
          >
            Go to Dashboard
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold text-red-500">Payment not found</h1>
          <p>Please contact support if money was deducted.</p>
          <button
            onClick={() => router.push("/dashboard/customer")}
            className="bg-[#ff7600] text-black font-medium px-4 py-2 rounded"
          >
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  );
}
