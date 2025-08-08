"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminUsers from "./AdminUsers";
import { AdminUserCardSkeleton } from "./SkeletonLoaderTechnicianCard";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  address: string;
}

export default function AdminDashboardUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
   const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full min-h-full py-2 md:py-4">
      <h1 className="text-lg md:text-xl font-semibold mb-2 px-1">Manage Users</h1>

      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <select title="role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-3 text-[#828282] text-sm md:text-base rounded bg-[#0b0b0b] border border-border w-full md:w-[15%] outline-none"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="TECHNICIAN">Technician</option>
          <option value="ADMIN">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Search users by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 md:p-3 text-sm md:text-base rounded bg-[#0b0b0b] border border-border w-full md:w-1/2 outline-none"
        />
      </div>

      {loadingUsers ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
      <AdminUserCardSkeleton key={i} /> 
      ))}
      </div>
      ) : (
      <AdminUsers users={filteredUsers} refresh={fetchUsers} />
      )}
     </div>
  );
}
