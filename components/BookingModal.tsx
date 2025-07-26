"use client";

import { useState } from "react";
import axios from "axios";

interface BookingModalProps {
  technicianId: string;
  onClose: () => void;
  onBooked: () => void;
}

export default function BookingModal({ technicianId, onClose, onBooked }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createBooking = async () => {
    if (!date) return alert("Select date & time");

    try {
      setLoading(true);
      await axios.post("/api/bookings", {
        technicianId,
        date,
        description,
      });
      onBooked();
      onClose();
    } catch (error) {
      console.error("Booking failed", error);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Book Appointment</h2>

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={createBooking}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
