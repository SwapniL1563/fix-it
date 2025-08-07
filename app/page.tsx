"use client"
import { NavbarDemo } from "@/components/Navbar";
import Testimonials from "@/components/Testimonials"
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-200 relative">
      <NavbarDemo/>
      <div className="z-20 relative">
      <main className="min-h-screen min-w-full  text-gray-800 ">
      <section className="bg-black min-w-full text-center pt-44 pb-32 md:pt-52 md:pb-40 px-6 flex flex-col justify-center overflow-hidden  items-center relative">
      <video src="/bg-vid.mp4" className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" autoPlay muted loop></video>

      <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90"></div>
      </div>

        <h1 className="text-[1.65rem] md:text-5xl font-bold text-gray-200 max-w-3xl md:max-w-2xl leading-[2rem] md:leading-[3.5rem] z-10">
          <span className="text-[#ff7600] ">FixIt</span> - Reliable Home Services, On Demand
        </h1>
        <p className="mt-4 text-sm md:text-lg text-neutral-300 max-w-sm md:max-w-lg  mx-auto z-10">
          Connect with verified technicians for hassle-free services like plumbing, electrician and many more whenever you need them.
        </p>
        <div className="mt-8 md:mt-10 flex justify-center items-center gap-2 md:gap-4 z-10">
          <Link
            href="/signup"
            className="px-5 md:px-6 py-3 text-sm md:text-base bg-[#ff7600] text-black font-medium rounded-md shadow hover:bg-[#ff6a00] transition"
          >
            Create New Account
          </Link>
          <Link
            href="/api/auth/signin"
            className="px-5 md:px-6 py-3 text-sm md:text-base border md:border-2 bg-black/10 font-medium border-[#ff7600] text-[#ff7600] rounded-md transition"
          >
            Book Now
          </Link>
        </div>
      </section>

      <section id="services" className="py-16 relative bg-[#020202]">
        <h2 className="text-[1.65rem] md:text-[1.75rem] font-bold text-center mb-4 md:mb-8 text-white">Services We Provide</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3 w-[90%] md:max-w-5xl mx-auto z-20">
          {[
            { name: "Plumbing", icon: "🔧" },
            { name: "Electrician", icon: "💡" },
            { name: "Carpentry", icon: "🪵" },
            { name: "Repair", icon: "🛠️" },
            { name: "Cleaning", icon: "🧹" },
          ].map((service) => (
            <div
              key={service.name}
              className="bg-neutral-950/10 border rounded-md shadow hover:shadow-md hover:border-[#ff7600]/30 p-8 md:p-10 text-center transition"
            >
              <div className="text-3xl md:text-4xl mb-2">{service.icon}</div>
              <h3 className="text-base md:text-lg font-semibold text-white">{service.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="work" className="pt-10 pb-8 md:px-6 text-center bg-[#020202]">
        <h2 className="text-[1.65rem] md:text-[1.75rem] font-bold mb-4 md:mb-8 text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 w-[90%] max-w-5xl mx-auto ">
          {[ {  step: "1", title: "Book Your Service", desc: "Select the service type, describe your issue, and choose your location to initiate a service request."},
             {  step: "2", title: "Secure Payment", desc: "Complete the payment securely. Once done, your request is confirmed and queued for assignment."},
             {  step: "3", title: "Get Your Technician", desc: "A verified technician is assigned to your request and contacts you to complete the job efficiently."},
            ].map((item) => (
            <div
              key={item.step}
              className="bg-neutral-950/10 border hover:border-[#ff7600]/30 rounded-md shadow p-8 md:p-10 hover:shadow-md transition sm:w-[90%] md:w-full"
            >
              <div className="text-xl md:text-2xl font-bold text-[#ff7600] mb-2">Step {item.step}</div>
              <h3 className="md:text-lg font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-sm md:text-[0.95rem] md:text-base text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Testimonials/>
      </section>

      <section id="contact" className="text-center pt-8 pb-4 md:pt-7 md:pb-5 bg-[#020202] flex justify-center items-center">
        <div className="w-[90%] md:w-2/3 p-8 md:p-12 bg-neutral-950/10 border rounded-md flex flex-col justify-center items-center">
          <h2 className="md:text-[1.5rem] font-bold text-white md:w-[70%] text-center">
          Ready to book your first service? Wanna Experience Professional Service that meets your need
        </h2>
        <Link
          href="/signup"
          className="mt-6 inline-block px-8 py-3 bg-[#ff7600] text-black font-medium rounded-md shadow hover:bg-[#ff6a00] transition"
        >
          Create New Account
        </Link>
        </div>
      </section>

      <footer className="py-6 text-center px-10 md:px-0 text-xs md:text-sm text-gray-400 bg-[#020202] border-t">
        © {new Date().getFullYear()} FixIt. All rights reserved. Made with 🧡 by Swapnil.
      </footer>
    </main>
    </div>
    </div>
  );
}
