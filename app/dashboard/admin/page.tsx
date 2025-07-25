"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Technician = {
  id: string;
  bio: string;
  verified: boolean;
  user: {
    name: string;
    email: string;
    city: string;
  };
  service: {
    name: string;
  };
};

export default function AdminDashboard() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchTechnicians = async () => {
    const res = await axios.get("/api/technicians");
    setTechnicians(res.data);
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const verifyTechnician = async (id: string) => {
    setLoading(id);
    await axios.patch(`/api/technicians/${id}` , {verified:true});
    await fetchTechnicians();
    setLoading(null);
  };

  return (
    <div>
      <h1>Admin – Verify Technicians</h1>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Service</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((tech) => (
            <tr key={tech.id}>
              <td>{tech.user.name}</td>
              <td>{tech.user.email}</td>
              <td>{tech.user.city}</td>
              <td>{tech.service.name}</td>
              <td>{tech.verified ? "Verified" : "Pending"}</td>
              <td>
                {!tech.verified && (
                  <button  onClick={() => verifyTechnician(tech.id)} disabled={loading === tech.id}>
                    {loading === tech.id ? "Verifying..." : "Verify"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
