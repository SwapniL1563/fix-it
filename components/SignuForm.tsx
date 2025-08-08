"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

interface Service {
  id: string;
  name: string;
  description?: string;
}

export default function SignupFormDemo() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    city: "",
    role: "CUSTOMER",
    bio: "",
    serviceId: "",
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      const res = await axios.get("/api/services");
      setServices(res.data);
    };
    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await axios.post("/api/signup", form);

      toast.success('Signup successfully!');


      router.push("/api/auth/signin")
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Create Your Account
      </h2>
      <p className="mt-1 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
        Sign up to start booking technicians or offer services.
      </p>

      <form className="my-4 space-y-2" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="123 Street Name"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Your City"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded p-2 bg-[#0b0b0b]"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="TECHNICIAN">Technician</option>
          </select>
        </LabelInputContainer>

        {form.role === "TECHNICIAN" && (
          <>
            <LabelInputContainer>
              <Label htmlFor="bio">Bio</Label>
              <Input
                type="text"
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Write about your skills"
                required
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="serviceId">Service</Label>
              <select
                id="serviceId"
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                required
                className="border rounded p-2 bg-[#0b0b0b]"
              >
                <option disabled value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </LabelInputContainer>
          </>
        )}

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-[#ff7600] to-[#ff7600] font-medium text-white dark:text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-[#ff7600]
           hover:bg-[#4c00ff] mt-3 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit" 
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up →"}
          <BottomGradient />
        </button>

        {msg && (
          <p className="text-center text-sm mt-2 text-green-600 dark:text-green-400">
            {msg}
          </p>
        )}
      </form>

      <h2 className="text-center">Already have an account? <Link className="text-blue-400" href="/api/auth/signin">Login now</Link></h2>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
