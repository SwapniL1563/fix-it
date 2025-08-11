"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function BookingModal({ technicianId, onClose }: { technicianId: string; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  async function handleConfirmAndPay() {
    setLoading(true);
    console.log("📌 Creating booking...");

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
      console.log("📋 Booking API response:", data);

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
    <div className="modal">
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2"
      />
      <textarea
        placeholder="Describe the issue"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mt-2"
      />
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleConfirmAndPay}
          disabled={loading}
          className="bg-[#ff7600] px-4 py-2 rounded text-black font-medium"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>
        <button onClick={onClose} className="border px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
