"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BookingCustomerFilter from "@/components/BookingCustomerFilter";
import BookingCardCustomer from "@/components/BookingCardCustomer";
import { BookingCardSkeleton } from "./SkeletonLoaderTechnicianCard";

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
  paymentStatus: string;
  technician: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      city: string;
      address: string;
    };
    service: {
      name: string;
    };
  };
  review?: { id: string } | null;
}

export default function CustomerRecentContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await axios.get("/api/bookings");

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentBookings = res.data.filter((booking: Booking) => {
        return new Date(booking.date) >= sevenDaysAgo;
      });

      setBookings(recentBookings);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((item) => {
    return (
      (statusFilter === "" || item.status === statusFilter) &&
      (item.technician.user.name.toLowerCase().includes(search.toLowerCase()) ||
        item.technician.user.city.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="w-full min-h-full md:p-2 py-4">
      <h1 className="md:text-lg px-1 mb-3">Recent Bookings</h1>

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
        <p className="mt-4">No recent bookings</p>
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
              onCancel={() => {}} 
              reviewExists={!!booking.review}
            />
          ))}
        </div>
      )}
    </div>
  );
}
