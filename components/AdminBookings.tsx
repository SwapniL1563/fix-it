"use client";

import { useState } from "react";
import axios from "axios";

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
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
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`))
      return;
    await axios.patch(`/api/bookings/${id}`, { status });
    refresh();
  };

  // Filtered bookings
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

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>

      {/* Filter UI */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by customer or technician"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="border rounded p-3 bg-gray-50">
              <h3 className="font-bold">{b.customer.name}</h3>
              <p>{b.customer.city}</p>
              <p>Technician: {b.technician.user.name} ({b.technician.service.name})</p>
              <p>Date: {new Date(b.date).toLocaleString()}</p>
              <p>Status: <span className="font-semibold">{b.status}</span></p>

              <div className="mt-2 flex gap-2">
                {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                  <>
                    <button
                      onClick={() => updateStatus(b.id, "COMPLETED")}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "CANCELLED")}
                      className="px-2 py-1 bg-red-600 text-white rounded"
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
