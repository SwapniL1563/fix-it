import axios from "axios";
import { useEffect, useState } from "react";

interface Technician {
  id: string;
  bio: string;
  verified: boolean;
  user: { name: string; email: string; city: string , address:string };
  service: { name: string };
}

interface AdminTechniciansProps {
  technicians: Technician[];
  refresh:()=>void;
}

interface Service {
     name:string,
     id:string,
}

export default function AdminTechnicians({
  technicians,
  refresh
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

  useEffect(()=> {
    const fetchServices = async () => {
        const res = await axios.get("/api/services");
        setServices(res.data);
    }

    fetchServices();
  },[])

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
    try{
        await axios.post("/api/admin/technicians",form);
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
        })
    } catch(error) {
        console.error("Failed to add technician",error)
    } finally {
        setSubmitting(false)
    }
  }
  return (

      <div>
        <div>
          <h2>Manage Technician</h2>
          <button onClick={()=> setShowAddModal(true)}>Add Technician</button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="p-4 border rounded shadow bg-white flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold">{tech.user.name}</h3>
              <p>Email: {tech.user.email}</p>
              <p>City: {tech.user.city}</p>
              <p>Address: {tech.user.address}</p>
              <p>Service: {tech.service.name}</p>
              <p>Status: {tech.verified ? "Verified" : "Pending"}</p>
              <p className="text-sm mt-2">{tech.bio}</p>
            </div>

            {!tech.verified && (
              <button
                onClick={() => verifyTech(tech.id)}
                disabled={loadingId === tech.id}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loadingId === tech.id ? "Verifying..." : "Verify"}
              </button>
            )}

            <button onClick={() => deleteTech(tech.id)}>
                Delete
            </button>
          </div>
        ))}
      </div>

      { showAddModal && ( 
        <div>
            <div>
                <h2>Add Technician</h2>

                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Book Appointment</h2>
                <input type="text" placeholder="name" value={form.name} onChange={(e) => setForm({ ...form,name:e.target.value})}/>
                <input type="email" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form,email:e.target.value})}/>
                <input type="password" placeholder="password" value={form.password} onChange={(e) => setForm({ ...form,password:e.target.value})}/>
                <input type="text" placeholder="city" value={form.city} onChange={(e) => setForm({ ...form,city:e.target.value})}/>
                <textarea  placeholder="address" value={form.address} onChange={(e) => setForm({ ...form,address:e.target.value})}/>
                <select  title="bio" value={form.serviceId} onChange={(e) => setForm({ ...form,serviceId:e.target.value})}>
                   <option value="">Select Service</option>
                { services.map((service) => (
                    <option value={service.id} key={service.id}>
                        {service.name}
                    </option>
                ))}
                </select>
                 

                <button onClick={()=> setShowAddModal(false)}>Close</button>
                <button onClick={addTechnician} disabled={submitting}>{ submitting ? "Adding..." : "Add" }</button>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
