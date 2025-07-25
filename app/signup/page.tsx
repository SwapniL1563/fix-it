"use client"

import axios from "axios";
import { useEffect, useState } from "react"

interface Service {
    id:string,
    name:string,
    description?:string,
}

export default function SignUpPage() {
    const [ form , setForm ] = useState({
        name:"",
        email:"",
        password:"",
        address:"",
        city:"",
        role:"CUSTOMER",
        bio:"",
        serviceId:""
    });
    
    const [services,setServices] = useState<Service[]>([]);
    const [loading,setLoading] = useState(false);
    const [msg,setMsg] = useState("");

    useEffect(()=> {
        const fetchServices = async () => {
        const res = await axios.get("/api/services");
        setServices(res.data);
        };
        fetchServices();
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    };

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
        const res = await axios.post("/api/signup",form);

        if(res.status === 200) {
            setMsg("Signup successfully!. You can login now.")
        }
        } catch (err:any) {
            setMsg(err.response.data.error || "Signup failed!")
        } finally {
        setLoading(false);  
        }
    }

    return (
        <div>
            <h1>Sign Up Page</h1>
            <form className="flex flex-col bg-red-100 justify-center gap-2" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="name" value={form.name} onChange={handleChange} required/>
                <input type="email" name="email" placeholder="email" value={form.email} onChange={handleChange} required/>
                <input type="password" name="password" placeholder="password" value={form.password} onChange={handleChange} required/>
                <input type="text" name="address" placeholder="address" value={form.address} onChange={handleChange} required/>
                <input type="text" name="city" placeholder="city" value={form.city} onChange={handleChange} required/>

                <select title="Select Role" name="role" value={form.role} onChange={handleChange}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="TECHNICIAN">Technician</option>
                </select>

                {form.role === "TECHNICIAN" && (
                    <>
                    <textarea name="bio" placeholder="write your bio" value={form.bio} onChange={handleChange} required />
                    <select title="Services" name="serviceId" value={form.serviceId} onChange={handleChange} required>
                        <option value="">Select Service</option>
                        {
                            services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))
                        }
                    </select>
                    </>
                )}

                <button type="submit" disabled={loading}>{loading ? "Signing up" : "Signup"}</button>
            </form>

            { msg && <p>{msg}</p>}
        </div>
    )
}