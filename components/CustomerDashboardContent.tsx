"use client";

import BookingStatsCustomer from "@/components/BookingStatsCustomer";
import BookingCustomerFilter from "@/components/BookingCustomerFilter";
import BookingCardCustomer from "@/components/BookingCardCustomer";
import BookingModal from "@/components/BookingModal";
import BookingCancelModal from "@/components/BookingCancelModal";
import StarRating from "@/components/StarRating";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { BookingCardSkeleton, TechnicianCardSkeleton } from "./SkeletonLoaderTechnicianCard";

export default function CustomerDashboardContent() {
  const [technicians, setTechnicians] = useState<unknown[]>([]);
  const [services, setServices] = useState<unknown[]>([]);
  const [filters, setFilters] = useState({ serviceId: "", search: "" });
  const [loading, setLoading] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    axios.get("/api/services").then((res) => setServices(res.data));
  }, []);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.serviceId) params.append("serviceId", filters.serviceId);
      if (filters.search) params.append("search", filters.search);

      const res = await axios.get(`/api/technicians/filtered?${params.toString()}`);
      setTechnicians(res.data);
    } catch (error) {
      console.error("Error fetching technicians", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  },[]);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await axios.get("/api/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleFocus = () => fetchBookings();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const filteredBookings = bookings.filter((item) => {
    return (
      (statusFilter === "" || item.status === statusFilter) &&
      (item.technician.user.name.toLowerCase().includes(search.toLowerCase()) ||
        item.technician.user.city.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleCancelClick = (id: string) => {
    setSelectedBookingId(id);
    setShowConfirmModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedBookingId) return;
    await axios.patch(`/api/bookings/${selectedBookingId}`, { status: "CANCELLED" });
    fetchBookings();
  };

  return (
    <div className="w-full min-h-full md:p-1 py-2 md:py-4 relative overflow-hidden">
      <h1 className="md:text-lg px-1 md:mb-1">Welcome back, {session?.user?.name}</h1>

      <BookingStatsCustomer bookings={bookings} />

      <h1 className="md:text-lg px-1 mb-1 md:mb-2 mt-3 md:mt-1">Find Technicians</h1>
      <div className="flex flex-wrap items-center gap-2 rounded-md w-full lg:w-2/3">
        <select
          title="filters"
          value={filters.serviceId}
          onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
          className="p-3 text-[#828282] rounded bg-[#0b0b0b] border border-border w-full md:w-[25%] outline-none"
        >
          <option value="">All Services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by Technician Name or City"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-3 md:p-3 text-sm md:text-base rounded bg-[#0b0b0b] border border-border w-full md:w-1/2 outline-none"
        />

        <button
          onClick={fetchTechnicians}
          className="px-3 text-sm md:text-base md:px-4 py-2 md:py-3 rounded bg-[#ff7600] hover:bg-[#ff6a00] w-full md:w-auto text-black font-medium cursor-pointer"
        >
          Apply filters
        </button>
      </div>

      {loading ? (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <TechnicianCardSkeleton key={i} />
          ))}
        </div>
      ) : technicians.length === 0 ? (
        <p>No verified technicians</p>
      ) : (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {technicians.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-md bg-[#0b0b0b] border border-[#181818] hover:border-[#ff7600]/20 transition"
            >
              <h2 className="font-semibold text-[#ff7600]">{item.user.name}</h2>
              <p><span className="text-[#ff7600]">Email:</span> {item.user.email}</p>
              <p><span className="text-[#ff7600]">City:</span> {item.user.city}</p>
              <p><span className="text-[#ff7600]">Address:</span> {item.user.address}</p>
              <p><span className="text-[#ff7600]">Bio:</span> {item.bio}</p>
              <StarRating rating={parseFloat(item.avgRating)} />
              <button
                onClick={() => setSelectedTech(item.id)}
                className="text-sm md:text-base mt-3 px-3 py-2 w-full md:w-auto rounded bg-[#ff7600] hover:bg-[#ff6a00] text-black font-medium"
              >
                Book appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTech && (
        <BookingModal
          technicianId={selectedTech}
          onClose={() => setSelectedTech(null)}
          onBooked={() => fetchBookings()} 
        />
      )}

      <div className="mt-2">
        <h1 className="md:text-lg mb-2 px-1 mt-5 md:mt-3">Your Previous Bookings</h1>
        <BookingCustomerFilter
          status={statusFilter}
          onStatusChange={setStatusFilter}
          search={search}
          onSearchChange={setSearch}
        />
        {bookingsLoading ? (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <p className="mt-4">No previous bookings</p>
        ) : (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredBookings.map((booking) => (
              <BookingCardCustomer
                key={booking.id}
                id={booking.id}
                date={booking.date}
                status={booking.status}
                paymentStatus={booking.paymentStatus}
                description={booking.description}
                service={booking.technician.service.name}
                technician={{
                  id: booking.technician.id,
                  name: booking.technician.user.name,
                  email: booking.technician.user.email,
                  city: booking.technician.user.city,
                  address: booking.technician.user.address,
                }}
                onCancel={() => handleCancelClick(booking.id)}
                reviewExists={!!booking.review}
              />
            ))}
          </div>
        )}
      </div>

      {showConfirmModal && (
        <BookingCancelModal
          onConfirm={confirmCancel}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}
