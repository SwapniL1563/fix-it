"use client";

interface BookingCardsProps {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  date: string;
  description: string;
  status: string;
  onUpdateStatus: (id: string, status: string) => void;
}

export default function BookingCardTechnician({
  id,
  customer,
  date,
  description,
  status,
  onUpdateStatus,
}: BookingCardsProps) {
  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    ACCEPTED: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/40",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/40",
  };

  return (
    <div className="p-6 border border-[#181818] rounded-md bg-[#0b0b0b] hover:border-[#ff7600]/20 transition">
      <h3 className="font-semibold text-[#ff7600]">{customer.name}</h3>
      <p className="text-white text-sm">
        <span className="font-medium text-[#ff7600]">Email:</span> {customer.email}
      </p>
      <p className="text-white text-sm">
        <span className="font-medium text-[#ff7600]">City:</span> {customer.city}
      </p>
      <p className="text-white text-sm">
        <span className="font-medium text-[#ff7600]">Address:</span> {customer.address}
      </p>

      <p className="text-sm text-white mt-2">
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
          <>
            <button
              onClick={() => onUpdateStatus(id, "ACCEPTED")}
              className="px-4 py-2 rounded-md bg-green-500 text-black hover:bg-green-600 transition"
            >
              Accept
            </button>
            <button
              onClick={() => onUpdateStatus(id, "CANCELLED")}
              className="px-4 py-2 rounded-md bg-red-500 text-black hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </>
        )}

        {status === "ACCEPTED" && (
          <button
            onClick={() => onUpdateStatus(id, "COMPLETED")}
            className="px-4 py-2 rounded-md bg-blue-500 text-black hover:bg-blue-600 transition"
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
}
