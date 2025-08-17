"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import BookingFilter from "@/components/BookingTechnicianFilter";
import BookingCardTechnician from "@/components/BookingCardTechnician";
import { BookingCardSkeletonTech } from "@/components/SkeletonLoaderTechnicianCard";
import { useSession } from "next-auth/react";
import { NavbarButton as Button } from "./ui/resizable-navbar";

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
  paymentStatus:string;
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
  const [currentPage,setCurrentPage] = useState(1);
  const bookingsPerPage = 6;
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
    (b) => b.status === "ACCEPTED" || b.status === "COMPLETED" || b.status === "PENDING"
  );

  const filteredBookings = assignedJobs.filter((item) => {
    return (
      (statusFilter === "" || item.status === statusFilter) &&
      (item.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.city.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking,indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

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
          {currentBookings.map((item) => (
            <BookingCardTechnician
              key={item.id}
              id={item.id}
              description={item.description}
              date={item.date}
              status={item.status}
              paymentStatus={item.paymentStatus}
              customer={item.customer}
              onUpdateStatus={updateBookingStatus}
            />
          ))}
        </div>
      )}

     { 
      totalPages > 1 && (
      <div className="flex justify-center items-center space-x-2 mt-4">
       <Button variant="dark" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}  disabled={currentPage === 1} >
        Prev 
       </Button>
  
       {Array.from({ length: totalPages }, (item, index) => (
        <Button key={index} variant={currentPage === index + 1 ? "secondary" : "dark"} onClick={() => setCurrentPage(index + 1)}>
        {index + 1}
        </Button>
        ))}
  
        <Button variant="dark" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
         Next
        </Button>
        </div> )
        }
    </div>
  );
}
