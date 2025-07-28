"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminStats from "@/components/AdminStats";
import AdminTechnicians from "@/components/AdminTechnicians";
import AdminBookings from "@/components/AdminBookings";
import AdminUsers from "@/components/AdminUsers";

interface Technician {
  id: string;
  bio: string;
  verified: boolean;
  avgRating:string;
  user: {
    name: string;
    email: string;
    city: string;
    address:string;
  };
  service: {
    name: string;
  };
};

interface User {
  id:string;
  name:string;
  email:string;
  city:string;
  address:string;
  role:string;
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

export default function AdminDashboard() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users,setUsers] = useState<User[]>([]);
  const [bookings,setBookings] = useState<Booking[]>([]);

  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userSearch, setUserSearch] = useState("");

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

  useEffect(()=> {
    fetchAll()
  },[]);

  if(loading) return <p>Loading admin data...</p>

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
    <div>
      <h1>Admin Dashboard</h1>
      
      <AdminStats totalUsers={users.length} 
      verifiedTechs={technicians.filter(b=> b.verified).length} 
      pendingTechs={technicians.filter(b=>!b.verified).length}
      totalBookings={bookings.length} completedBookings={bookings.filter(b => b.status === "COMPLETED").length}
      cancelledBookings={bookings.filter(b => b.status === "CANCELLED").length}/>

      <AdminTechnicians technicians={technicians} refresh={fetchAll}
       />

      <div>
        <h1>Manage Bookings</h1>
        <div>
          <select title="booking filter" value={bookingStatusFilter} onChange={(e) => setBookingStatusFilter(e.target.value)} >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input type="text" placeholder="Search Bookings"
          value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)} />
        </div>
      </div>

      <AdminBookings bookings={bookings} refresh={fetchAll} />

       <div className="my-6">
        <h2>Manage Users</h2>
        <div className="flex gap-2 mb-3">
          <select
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input
            type="text"
            placeholder="Search users"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>

      <AdminUsers users={filteredUsers} refresh={fetchAll}/>
    </div>
    </div>
  );
}
