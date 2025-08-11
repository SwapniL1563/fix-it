"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function BookingModal({ technicianId, onClose }: { technicianId: string; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  async function handleBooking() {
    console.log("📌 Booking request initiated");
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
      console.log("📋 Booking API response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      toast.success("Booking created. Redirecting to payment...");
      if (data.url) {
        console.log("💳 Redirecting to Stripe Checkout:", data.url);
        window.location.href = data.url;
      } else {
        console.warn("⚠️ No checkout URL returned");
      }
    } catch (err: any) {
      console.error("❌ Booking modal error:", err);
      toast.error(`Booking failed: ${err.message}`);
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
      />
      <textarea
        value={description}
        placeholder="Describe your issue"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleBooking} disabled={loading}>
        {loading ? "Processing..." : "Confirm & Pay"}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
