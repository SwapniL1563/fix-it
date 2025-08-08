"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface BookingModalProps {
  technicianId: string;
  onClose: () => void;
  onBooked?: () => void; 
}

export default function BookingModal({ technicianId, onClose, }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createBooking = async () => {
    if (!date) return toast.error("Select date & time");

    try {
      setLoading(true);
      const res = await axios.post("/api/bookings", {
        technicianId,
        date,
        description,
      });

      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl; // FIXED
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Booking failed", error);
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
      <div className="bg-[#0b0b0b] p-6 rounded-lg border shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Book Appointment</h2>

        <h2 className="text-gray-400 mb-2">Select Date & Time:</h2>
        <input title="date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full mb-3 text-gray-400 outline-none custom-datetime"
        />

        <textarea
          placeholder="Specify the issue or problem occurred"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-3 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={createBooking}
            disabled={loading}
            className="px-4 py-2 bg-[#ff7600] hover:bg-[#ff6a00] text-black font-medium rounded"
          >
            {loading ? "Redirecting..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}
