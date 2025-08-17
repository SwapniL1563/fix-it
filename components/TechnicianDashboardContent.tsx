"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TechnicianStats from "@/components/BookingStatsTechnician";
import BookingFilter from "@/components/BookingTechnicianFilter";
import BookingCardTechnician from "@/components/BookingCardTechnician";
import StarRating from "@/components/StarRating";
import { BookingCardSkeletonTech } from "@/components/SkeletonLoaderTechnicianCard";
import { useSession } from "next-auth/react";
import { NavbarButton as Button } from "./ui/resizable-navbar";

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
  paymentStatus: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
}



export default function TechnicianDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [avgRating, setAvgRating] = useState<string>("0");
  const {data:session} = useSession();
  const [currentPage,setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

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

  const filteredBookings = bookings.filter((item) => {
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
      <h1 className="md:text-lg px-1 md:mb-2">Welcome back, {session?.user?.name}</h1>
      
      <TechnicianStats bookings={bookings} />

      <h1 className="md:text-lg px-1 mt-2 mb-2">Assigned Jobs:</h1>

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
        <p className="mt-4">No bookings yet</p>
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
          </div>
         )
      }

      <h1 className="md:text-lg px-1 mt-4  mb-2">Review:</h1>

      <div className="mb-4 bg-[#0b0b0b] border border-[#181818] hover:border-[#ff7600]/20 transition rounded-md p-4 flex flex-col gap-2 md:w-[20%]">
      <p className="text-sm md:text-base text-gray-200">Your Average Rating</p>
      <div className="flex flex-col gap-1">
      <span className="text-lg md:text-2xl font-semibold text-[#ff7600]">{avgRating}</span>
      <StarRating rating={parseFloat(avgRating)} />
      </div>
      </div>

    </div>
  );
}
