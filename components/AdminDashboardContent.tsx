"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminStats from "@/components/AdminStats";
import AdminTechnicians from "@/components/AdminTechnicians";
import AdminBookings from "@/components/AdminBookings";
import AdminUsers from "@/components/AdminUsers";
import { useSession } from "next-auth/react";

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
  const [loading, setLoading] = useState(true);

  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const { data:session } = useSession();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [techRes, userRes, bookingRes] = await Promise.all([
        axios.get("/api/technicians"),
        axios.get("/api/admin/users"),
        axios.get("/api/admin/bookings"),
      ]);
      setTechnicians(techRes.data);
      setUsers(userRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <p className="p-4">Loading admin data...</p>;

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === "" || u.role === userRoleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

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
    <div className="w-full min-h-full py-2 md:py-4 relative overflow-hidden">
         <h1 className="md:text-lg px-1">Welcome back, {session?.user?.name}</h1>
      <AdminStats
        totalUsers={users.length}
        verifiedTechs={technicians.filter((t) => t.verified).length}
        pendingTechs={technicians.filter((t) => !t.verified).length}
        totalBookings={bookings.length}
        completedBookings={bookings.filter((b) => b.status === "COMPLETED").length}
        cancelledBookings={bookings.filter((b) => b.status === "CANCELLED").length}
      />
      
      <AdminTechnicians technicians={technicians} refresh={fetchAll} />

      <h2 className="mt-6 mb-2 text-lg font-semibold">Manage Bookings</h2>
      <AdminBookings bookings={filteredBookings} refresh={fetchAll} />

      <h2 className="mt-6 mb-2 text-lg font-semibold">Manage Users</h2>
      <div className="flex gap-2 mb-2">
        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          className="p-3 text-[#828282] rounded bg-[#0b0b0b] border border-border w-full md:w-[15%] outline-none"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="TECHNICIAN">Technician</option>
          <option value="ADMIN">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Search users by name"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="p-3 md:p-3 text-sm md:text-base rounded bg-[#0b0b0b] border border-border w-full md:w-1/2 outline-none"
        />
      </div>
      <AdminUsers users={filteredUsers} refresh={fetchAll} />
    </div>
  );
}
