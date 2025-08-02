"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import BookingFilter from "@/components/BookingTechnicianFilter";
import BookingCardTechnician from "@/components/BookingCardTechnician";
import { BookingCardSkeletonTech } from "@/components/SkeletonLoaderTechnicianCard";
import { useSession } from "next-auth/react";

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
}

export default function TechnicianDashboardJobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [avgRating, setAvgRating] = useState<string>("0");
  const { data: session } = useSession();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/bookings");
      setBookings(res.data.bookings);
      setAvgRating(res.data.avgRating);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get("/api/technicians/verify-status");
        if (!res.data.verified) {
          router.push("/pending-approval");
          return;
        }
        await fetchBookings();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const updateBookingStatus = async (id: string, status: string) => {
    await axios.patch(`/api/bookings/${id}`, { status });
    fetchBookings();
  };

  const assignedJobs = bookings.filter(
    (b) => b.status === "ACCEPTED" || b.status === "COMPLETED"
  );

  const filteredBookings = assignedJobs.filter((item) => {
    return (
      (statusFilter === "" || item.status === statusFilter) &&
      (item.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.city.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="w-full min-h-full md:p-1 py-2 md:py-4 relative overflow-hidden">
      <h1 className="md:text-lg px-1 mb-2">
        Assigned Jobs for {session?.user?.name}
      </h1>


      <BookingFilter
        status={statusFilter}
        onStatusChange={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookingCardSkeletonTech key={i} />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <p className="mt-4">No assigned jobs yet</p>
      ) : (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredBookings.map((item) => (
            <BookingCardTechnician
              key={item.id}
              id={item.id}
              description={item.description}
              date={item.date}
              status={item.status}
              customer={item.customer}
              onUpdateStatus={updateBookingStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
