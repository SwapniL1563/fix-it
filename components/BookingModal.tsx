"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function BookingModal({ technicianId, onClose }: { technicianId: string; onClose: () => void ,   onBooked:() => void}) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  async function handleConfirmAndPay() {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId,
          date,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Booking creation failed");

      if (!data.url) throw new Error("No Stripe Checkout URL returned");

      toast.success("Redirecting to payment...");
      window.location.href = data.url; 
    } catch (err: any) {
      console.error("❌ BookingModal error:", err);
      toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-[#0b0b0b] px-9 py-8 rounded border shadow-lg  md:w-1/3">
      <h2 className="text-lg font-bold mb-5">Book your appointment</h2>
      <p className="text-sm text-neutral-400 mb-3">Select Date and Time:</p>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-3 custom-datetime w-full rounded mb-1"
      />
      <textarea
        placeholder="Describe the issue"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-3 mt-2 w-full rounded"
      />
      <div className="flex flex-col md:flex-row gap-2 mt-2">
        <button
          onClick={handleConfirmAndPay}
          disabled={loading}
          className="bg-[#ff7600] px-4 py-2 rounded text-black font-medium md:w-1/2"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>
        <button onClick={onClose} className="border px-4 py-2 rounded md:w-1/2">
          Cancel
        </button>
      </div>
      </div>
    </div>
  );
}
