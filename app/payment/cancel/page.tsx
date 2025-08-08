'use client';

import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4 text-red-500">
        Payment Cancelled
      </h1>
      <p className="mb-6 text-gray-300">
        Your booking ID <span className="font-mono">{bookingId}</span> is still unpaid.
      </p>
      <button
        onClick={() => router.push("/dashboard/customer")}
        className="px-6 py-2 bg-[#ff7600] text-black rounded font-medium"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
