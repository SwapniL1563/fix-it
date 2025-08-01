import { useState } from "react";
import ReviewModal from "./ReviewModal";

interface BookingCardCustomerProps {
  id: string;
  date: string;
  status: string;
  technician: {
    id: string;
    name: string;
    email: string;
    city: string;
    address: string;
  };
  service: string;
  description: string;
  onCancel: (id: string) => void;
  reviewExists: boolean;
}

export default function BookingCardCustomer({
  id,
  date,
  status,
  technician,
  service,
  description,
  reviewExists,
  onCancel,
}: BookingCardCustomerProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    ACCEPTED: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/40",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/40",
  };

  return (
    <div className="p-6 border border-[#181818] rounded-md bg-[#0b0b0b] hover:border-[#ff7600]/20 transition">
      <h3 className="text- font-semibold text-[#ff7600]">{technician.name}</h3>
      <p className="text-white text-sm">
        <span className="font-medium text-[#ff7600]">Email:</span> {technician.email}
      </p>
      <p className="text-white text-sm">
        <span className="font-medium text-[#ff7600]">City:</span> {technician.city}
      </p>
      <p className="text-white text-sm">
        <span className="font-medium text-[#ff7600]">Address:</span> {technician.address}
      </p>

      <p className="text-sm mt-2">
        <span className="text-[#ff7600] font-medium">Service:</span> {service}
      </p>

      <p className="text-sm text-white mt-1">
        <span className="text-[#ff7600] font-medium">Date:</span>{" "}
        {new Date(date).toLocaleString()}
      </p>

      {description && (
        <p className="italic text-white mt-3 border-l-2 border-[#ff7600] pl-3">
          "{description}"
        </p>
      )}

      <span
        className={`inline-block mt-4 px-3 py-1 text-xs font-semibold rounded-full border ${statusColor[status]}`}
      >
        {status}
      </span>


      <div className="flex gap-3 mt-4">
        {status === "PENDING" && (
          <button
            onClick={() => onCancel(id)}
            className="px-4 py-2 rounded-md bg-[#ff7600] text-black hover:bg-[#ff6a00] transition"
          >
            Cancel Booking
          </button>
        )}

        {status === "COMPLETED" && !reviewExists && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 rounded font-medium bg-[#ff7600] text-black hover:bg-[#ff6a00] transition"
          >
            Review Service
          </button>
        )}
      </div>

      {showReviewModal && (
        <ReviewModal
          bookingId={id}
          technicianId={technician.id}
          technicianName={technician.name}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
