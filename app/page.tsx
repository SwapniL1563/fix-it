"use client"
import { NavbarDemo } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-200 relative">
      <NavbarDemo/>
      <div className="z-20 relative">
      <main className="min-h-screen min-w-full  text-gray-800 ">
      <section className="bg-black min-w-full text-center py-44 px-6 flex flex-col justify-center overflow-hidden  items-center relative">
        {/* <Image src="/bgbg.png" className="absolute w-full h-full z-0 opacity-30" alt="img"  height={1000} width={1000}/> */}
      <video
      src="/bg-vid.mp4"
      className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" autoPlay muted loop></video>

      <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90"></div>
      </div>

        <h1 className="text-[1.65rem] md:text-5xl font-bold text-gray-200 sm:max-w-3xl leading-[2rem] md:leading-[3.5rem] z-10">
          <span className="text-[#ff7600] ">FixIt</span> - Reliable Home Services, On Demand
        </h1>
        <p className="mt-4 text-sm md:text-lg text-neutral-300 max-w-sm md:max-w-lg  mx-auto z-10">
          Connect with verified technicians for hassle-free services like plumbing, electrician and many more whenever you need them.
        </p>
        <div className="mt-8 md:mt-6 flex justify-center items-center gap-2 md:gap-4 z-10">
          <Link
            href="/signup"
            className="px-5 md:px-6 py-3 text-sm md:text-base bg-[#ff7600] text-black font-medium rounded-md shadow hover:bg-[#ff6a00] transition"
          >
            Get Started
          </Link>
          <Link
            href="/services"
            className="px-5 md:px-6 py-3 text-sm md:text-base border md:border-2 bg-black/10 font-medium border-[#ff7600] text-[#ff7600] rounded-md transition"
          >
            Explore Services
          </Link>
        </div>
      </section>

      <section className="py-16 relative bg-[#020202]">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-5xl mx-auto z-20">
          {[
            { name: "Plumbing", icon: "🔧" },
            { name: "Electrician", icon: "💡" },
            { name: "Carpentry", icon: "🪵" },
            { name: "Repair", icon: "🛠️" },
            { name: "Cleaning", icon: "🧹" },
          ].map((service) => (
            <div
              key={service.name}
              className="bg-neutral-950/10 border rounded-md shadow hover:shadow-md hover:border-[#ff7600]/30 p-10 text-center transition"
            >
              <div className="text-4xl mb-2">{service.icon}</div>
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 text-center bg-[#020202]">
        <h2 className="text-3xl font-bold mb-8 text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto ">
          {[
            { step: "1", title: "Choose Service", desc: "Choose your service and technician based on location and need." },
            { step: "2", title: "Get Technician", desc: "We assign a verified technician for your request." },
            { step: "3", title: "Job Done", desc: "Technician completes the task to your satisfaction." },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-neutral-950/10 border hover:border-[#ff7600]/30 rounded-md shadow p-10 hover:shadow-md transition"
            >
              <div className="text-2xl font-bold text-orange-500 mb-2">Step {item.step}</div>
              <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center py-16 bg-[#020202] flex justify-center items-center">
        <div className="w-2/3 p-10 bg-neutral-950/10 border">
          <h2 className="text-3xl font-bold text-white">
          Ready to book your first service?
        </h2>
        <Link
          href="/signup"
          className="mt-6 inline-block px-8 py-3 bg-orange-500 text-black font-medium rounded-md shadow hover:bg-orange-600 transition"
        >
          Sign Up Now
        </Link>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-gray-500 bg-[#020202] border-t">
        © {new Date().getFullYear()} FixIt. All rights reserved. Made with 🧡 by Swapnil.
      </footer>
    </main>
    </div>
    </div>
  );
}
