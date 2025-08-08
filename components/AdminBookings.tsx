"use client";

import { useState } from "react";
import axios from "axios";

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
  paymentStatus:string;
  customer: {
    name: string;
    email: string;
    city: string;
    address: string;
  };
  technician: {
    user: {
      name: string;
      email: string;
      city: string;
    };
    service: {
      name: string;
    };
  };
}

interface Props {
  bookings: Booking[];
  refresh: () => void;
}

export default function AdminBookings({ bookings, refresh }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const updateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
    await axios.patch(`/api/bookings/${id}`, { status });
    refresh();
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "" || b.status === statusFilter;
    const searchText = search.toLowerCase();
    const matchesSearch =
      b.customer.name.toLowerCase().includes(searchText) ||
      b.customer.city.toLowerCase().includes(searchText) ||
      b.technician.user.name.toLowerCase().includes(searchText) ||
      b.technician.user.city.toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    ACCEPTED: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/40",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/40",
  };

   const paymentColor: Record<string, string> = {
    PAID: "bg-green-500/20 text-green-400 border-green-500/40",
    UNPAID: "bg-red-500/20 text-red-400 border-red-500/40",
   };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <select title="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 rounded border border-[#181818] bg-[#0b0b0b] text-[#828282] text-sm md:text-base w-full md:w-[15%]"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
       <input
          type="text"
          placeholder="Search by customer or technician"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded border border-[#181818] bg-[#0b0b0b] text-white text-sm md:text-base w-full md:w-1/2"
        />
        </div>

      {filteredBookings.length === 0 ? (
        <p className="text-gray-400">No bookings found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 border border-[#181818] rounded-md bg-[#0b0b0b] hover:border-[#ff7600]/20 transition"
            >
              <h3 className="text-[#ff7600] font-semibold">{b.customer.name}</h3>
              <p className="text-sm text-white">
                <span className="text-[#ff7600] font-medium">City:</span> {b.customer.city}
              </p>
              <p className="text-sm text-white">
                <span className="text-[#ff7600] font-medium">Technician:</span> {b.technician.user.name} ({b.technician.service.name})
              </p>
              <p className="text-sm text-white">
                <span className="text-[#ff7600] font-medium">Date:</span> {new Date(b.date).toLocaleString()}
              </p>

              {b.description && (
                <p className="italic text-white mt-2 border-l-2 border-[#ff7600] pl-3">
                  {b.description}
                </p>
              )}

              <span
                className={`inline-block mt-3 mr-3 px-3 py-1 text-xs font-semibold rounded-full border ${statusColor[b.status]}`}
              >
                {b.status}
              </span>

              <span className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full border ${paymentColor[b.paymentStatus] || paymentColor["UNPAID"]}`}>
              {b.paymentStatus}
              </span>



              <div className="flex gap-2 mt-4">
                {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                  <>
                    <button
                      onClick={() => updateStatus(b.id, "COMPLETED")}
                      className="px-3 py-2 bg-green-600 rounded text-black font-medium hover:bg-green-700"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "CANCELLED")}
                      className="px-3 py-2 bg-red-600 rounded text-black font-medium hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
