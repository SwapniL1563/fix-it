"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TechnicianStats from "@/components/BookingStatsTechnician";
import BookingFilter from "@/components/BookingTechnicianFilter";
import BookingCardTechnician from "@/components/BookingCardTechnician";
import StarRating from "@/components/StarRating";

interface Booking {
  id:string,
  date:string,
  description:string,
  status:string,
  customer:{
    name:string,
    email:string,
    address:string,
    city:string,
  }
}

export default function TechnicianDashboard() {
  const router = useRouter();
  const [loading,setLoading] = useState(true);
  const [bookings,setBookings] = useState<Booking[]>([]);
  const [search,setSearch] = useState("");
  const [statusFilter,setStatusFilter] = useState("")
  const [avgRating,setAvgRating] = useState<string>(0);

  // fetch technician bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/bookings");
      setBookings(res.data.bookings);
      setAvgRating(res.data.avgRating);
    } catch (error) {
      console.error("Error fetching bookings",error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const init = async () => {
      try{
        const res = await axios.get("/api/technicians/verify-status");
      if (!res.data.verified) {
        router.push("/pending-approval");
        return;
      } 

      await fetchBookings();
    } finally{
      setLoading(false)
    }
    }
    init()
  }, [router]);

  

  // update the booking status
  const updateBookingStatus = async (id:string,status:string) => {
    await axios.patch(`/api/bookings/${id}`, { status });
    fetchBookings();
  }

  // filtering the data
  const filteredBookings = bookings.filter((item) => {
    return ( 
      (statusFilter === "" || item.status === statusFilter) && 
      (item.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    item.customer.city.toLowerCase().includes(search.toLowerCase()))
    )
  })

  if(loading) return <div className="w-full min-h-screen flex justify-center items-center">
    <p>Checking verification...</p>
  </div>

  return (
    <div>
      <h1>Technician Dashboard</h1>

      <div>Your Average Rating: <span>
        <StarRating rating={parseFloat(avgRating)}/>{avgRating}</span></div>
      <TechnicianStats bookings={bookings}/>

      <BookingFilter status={statusFilter} onStatusChange={setStatusFilter} search={search} onSearchChange={setSearch}/>
      { loading ? ( 
        <p>Loading Bookings</p>
      ) : filteredBookings.length === 0 ? (
        <p>No booking yet</p>
      ): (
       <div className="grid grid-cols-2 gap-3">
        {filteredBookings.map((item)=> (
          <BookingCardTechnician
          key={item.id} id={item.id} description={item.description} date={item.date} status={item.status} customer={item.customer} onUpdateStatus={updateBookingStatus}
          />
        ))}
       </div>
      )}
    </div>
  );
}
