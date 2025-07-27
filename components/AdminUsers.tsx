import axios from "axios";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  city:string;
  address:string;
}

interface AdminUsersProps {
  users: User[];
  refresh:()=> void;
}

export default function AdminUsers({ users, refresh}: AdminUsersProps) {
   const [loadingId, setLoadingId] = useState<string | null>(null);

const deleteUser = async (id: string) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  setLoadingId(id);
  try {
    // Try normal delete first
    const res = await axios.delete(`/api/admin/users/${id}`);

    // If backend responds with 409 (has bookings)
    if (res.status === 409 || res.data?.requiresConfirmation) {
      const confirmCascade = confirm(
        "This user has related bookings. Delete user and all bookings?"
      );
      if (confirmCascade) {
        await axios.delete(`/api/admin/users/${id}?force=true`);
      } else {
        return;
      }
    }

    refresh();
  } catch (err: any) {
    // Axios throws for 409, so handle here
    if (err.response?.status === 409) {
      const confirmCascade = confirm(
        "This user has related bookings. Delete user and all bookings?"
      );
      if (confirmCascade) {
        await axios.delete(`/api/admin/users/${id}?force=true`);
        refresh();
      }
    } else {
      console.error("Failed to delete user", err);
    }
  } finally {
    setLoadingId(null);
  }
};


  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border rounded shadow bg-white flex flex-col"
          >
            <h3 className="font-bold">{user.name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
            <p>Address: {user.address}</p>
            <p>City: {user.city || "Mumbai"}</p> 

            { user.role !== "ADMIN" && (
              <button onClick={() => deleteUser(user.id)}
                disabled={loadingId === user.id}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
              >
                {loadingId === user.id ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
