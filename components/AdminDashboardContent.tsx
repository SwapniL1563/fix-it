"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminStats from "@/components/AdminStats";
import AdminTechnicians from "@/components/AdminTechnicians";
import AdminBookings from "@/components/AdminBookings";
import AdminUsers from "@/components/AdminUsers";
import { useSession } from "next-auth/react";
import { AdminBookingCardSkeleton, AdminTechnicianCardSkeleton } from "./SkeletonLoaderTechnicianCard";

interface Technician {
  id: string;
  bio: string;
  verified: boolean;
  avgRating: string;
  user: {
    name: string;
    email: string;
    city: string;
    address: string;
  };
  service: {
    name: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  address: string;
  role: string;
}

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
  technician: {
    user: {
      name: string;
      email: string;
      city: string;
      address: string;
    };
    service: {
      name: string;
    };
  };
  customer: {
    name: string;
    email: string;
    city: string;
    address: string;
  };
}

export default function AdminDashboardContent() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const { data:session } = useSession();

  const fetchTechnicians = async () => {
  setLoadingTechnicians(true);
  try {
    const res = await axios.get("/api/technicians");
    setTechnicians(res.data);
  } catch (err) {
    console.error("Error fetching technicians", err);
  } finally {
    setLoadingTechnicians(false);
  }
  };

  const fetchBookings = async () => {
  setLoadingBookings(true);
  try {
    const res = await axios.get("/api/admin/bookings");
    setBookings(res.data);
  } catch (err) {
    console.error("Error fetching bookings", err);
  } finally {
    setLoadingBookings(false);
  }
  };

  useEffect(() => {
  fetchTechnicians();
  fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      bookingStatusFilter === "" || b.status === bookingStatusFilter;
    const searchLower = bookingSearch.toLowerCase();
    const matchesSearch =
      b.customer.name.toLowerCase().includes(searchLower) ||
      b.customer.city.toLowerCase().includes(searchLower) ||
      b.technician.user.name.toLowerCase().includes(searchLower) ||
      b.technician.user.city.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full min-h-full py-2 md:py-4 relative overflow-hidden ">
        <h1 className="md:text-lg px-1 font-semibold">Welcome back, {session?.user?.name}</h1>
        <AdminStats
        totalUsers={users.length}
        verifiedTechs={technicians.filter((t) => t.verified).length}
        pendingTechs={technicians.filter((t) => !t.verified).length}
        totalBookings={bookings.length}
        completedBookings={bookings.filter((b) => b.status === "COMPLETED").length}
        cancelledBookings={bookings.filter((b) => b.status === "CANCELLED").length} />

      {loadingTechnicians ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
      <AdminTechnicianCardSkeleton key={i} />
       ))}
      </div>
      ) : ( <AdminTechnicians technicians={technicians} refresh={fetchTechnicians} /> )}

      <h2 className="mt-6 mb-2 text-lg font-semibold">Manage Bookings</h2>
      {loadingBookings ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
      <AdminBookingCardSkeleton key={i} />
       ))}
      </div>
      ) : ( <AdminBookings bookings={filteredBookings} refresh={fetchBookings} /> )}
    </div>
  );
}
