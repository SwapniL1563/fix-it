import axios from "axios";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  address: string;
}

interface AdminUsersProps {
  users: User[];
  refresh: () => void;
}

export default function AdminUsers({ users, refresh }: AdminUsersProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoadingId(id);
    try {
      const res = await axios.delete(`/api/admin/users/${id}`);
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
    <section className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-7 border border-[#181818] rounded-md bg-[#0b0b0b] hover:border-[#ff7600]/20 transition"
          >
            <h3 className="text-[#ff7600] font-semibold">{user.name}</h3>
            <p className="text-sm text-white">
              <span className="text-[#ff7600] font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm text-white">
              <span className="text-[#ff7600] font-medium">Role:</span> {user.role}
            </p>
            <p className="text-sm text-white">
              <span className="text-[#ff7600] font-medium">City:</span> {user.city || "Mumbai"}
            </p>
            <p className="text-sm text-white">
              <span className="text-[#ff7600] font-medium">Address:</span> {user.address}
            </p>

            {user.role !== "ADMIN" && (
              <button
                onClick={() => deleteUser(user.id)}
                disabled={loadingId === user.id}
                className="mt-3 px-3 py-2 bg-[#ff7600] text-black rounded transition font-medium"
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
