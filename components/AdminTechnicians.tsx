import axios from "axios";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

interface Technician {
  id: string;
  bio: string;
  verified: boolean;
  avgRating: string;
  user: { name: string; email: string; city: string; address: string };
  service: { name: string };
}

interface AdminTechniciansProps {
  technicians: Technician[];
  refresh: () => void;
}

interface Service {
  name: string;
  id: string;
}

export default function AdminTechnicians({
  technicians,
  refresh,
}: AdminTechniciansProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    address: "",
    bio: "",
    serviceId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const res = await axios.get("/api/services");
      setServices(res.data);
    };

    fetchServices();
  }, []);

  const verifyTech = async (id: string) => {
    setLoadingId(id);
    await axios.patch(`/api/technicians/${id}`, { verified: true });
    refresh();
    setLoadingId(null);
  };

  const deleteTech = async (id: string) => {
    if (!confirm("Delete this technician?")) return;
    await axios.delete(`/api/admin/technicians/${id}`);
    refresh();
  };

  const addTechnician = async () => {
    setSubmitting(true);
    try {
      await axios.post("/api/admin/technicians", form);
      refresh();
      setShowAddModal(false);
      setForm({
        name: "",
        email: "",
        password: "",
        city: "",
        address: "",
        bio: "",
        serviceId: "",
      });
    } catch (error) {
      console.error("Failed to add technician", error);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor: Record<string, string> = {
    VERIFIED: "bg-green-500/20 text-green-400 border-green-500/40",
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  };

  return (
    <div className="">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 mt-2">
        <h1 className="mt-4 px-1 md:text-lg font-semibold mb-2 md:mb-0">Manage Technicians</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 w-full md:w-auto bg-[#ff7600] text-black text-sm font-medium rounded hover:bg-[#ff6a00] transition"
        >
          Add Technician
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="p-5 border border-[#181818] rounded-md bg-[#0b0b0b] hover:border-[#ff7600]/20 transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-[#ff7600] font-semibold">{tech.user.name}</h3>
              <p className="text-sm text-white">
                <span className="text-[#ff7600] font-medium">Email:</span>{" "}
                {tech.user.email}
              </p>
              <p className="text-sm text-white">
                <span className="text-[#ff7600] font-medium">City:</span>{" "}
                {tech.user.city}
              </p>
              <p className="text-sm text-white">
                <span className="text-[#ff7600] font-medium">Address:</span>{" "}
                {tech.user.address}
              </p>
              <p className="text-sm text-white">
                <span className="text-[#ff7600] font-medium">Service:</span>{" "}
                {tech.service.name}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${
                  tech.verified ? statusColor.VERIFIED : statusColor.PENDING
                }`}
              >
                {tech.verified ? "Verified" : "Pending"}
              </span>

              <p className="text-sm text-white mt-2 italic border-l-2 border-[#ff7600] pl-3">
                {tech.bio}
              </p>

              <div className="mt-2">
                <StarRating rating={parseFloat(tech.avgRating)} />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {!tech.verified && (
                <button
                  onClick={() => verifyTech(tech.id)}
                  disabled={loadingId === tech.id}
                   className="w-full md:w-1/2 text-sm md:text-base md:auto px-4 py-2 text-green-400 border-1 border-green-500/40 bg-green-500/20 font-medium rounded transition"
                >
                  {loadingId === tech.id ? "Verifying..." : "Verify"}
                </button>
              )}
              <button
                onClick={() => deleteTech(tech.id)}
                className="w-full md:w-1/2 text-sm md:text-base md:auto px-4 py-2 bg-[#ff7600] text-black font-medium rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div className="bg-[#0b0b0b] border border-[#181818] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-4">
              Add Technician
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-2 p-3 rounded border border-[#181818] bg-[#0b0b0b] text-white outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mb-2 p-3 rounded border border-[#181818] bg-[#0b0b0b] text-white outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mb-2 p-3 rounded border border-[#181818] bg-[#0b0b0b] text-white outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full mb-2 p-3 rounded border border-[#181818] bg-[#0b0b0b] text-white outline-none"
            />
            <textarea
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full mb-1 p-3 rounded border border-[#181818] bg-[#0b0b0b] text-white outline-none"
            />
            <textarea
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full mb-1 p-3 rounded border border-[#181818] bg-[#0b0b0b] text-white outline-none"
            />
            <select
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
              className="w-full mb-2 p-3 rounded border border-[#181818] bg-[#0b0b0b] text-[#828282] outline-none"
            >
              <option value="" disabled={true}>Select Service</option>
              {services.map((service) => (
                <option value={service.id} key={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-[#ff7600] text-[#ff7600] font-medium rounded hover:bg-gray-700 transition"
              >
                Close
              </button>
              <button
                onClick={addTechnician}
                disabled={submitting}
                className="px-5 py-2 bg-[#ff7600] text-black font-medium rounded hover:bg-[#ff6a00] transition"
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
