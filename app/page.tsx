"use client"
import { NavbarDemo } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-200 relative">
      <NavbarDemo/>
      <div className="z-20 relative">
      <main className="min-h-screen  text-gray-800 ">
      <section className="bg-black text-center py-36 px-6 flex flex-col justify-center items-center relative">
        <Image src="/bgbg.png" className="absolute w-full h-full z-0 opacity-20" alt="img"  height={1000} width={1000}/>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-200 max-w-2xl leading-[3.5rem] z-10">
          <span className="text-[#ff7600]">FixIt</span> - Reliable Home Services, On Demand
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-lg mx-auto z-10">
          Connect with verified technicians for hassle-free services like plumbing, electrician and many more whenever you need them.
        </p>
        <div className="mt-6 flex justify-center gap-4 z-10">
          <Link
            href="/signup"
            className="px-6 py-3 bg-[#ff7600] text-white rounded-md shadow hover:bg-[#ff6a00] transition"
          >
            Get Started
          </Link>
          <Link
            href="/services"
            className="px-6 py-3 border border-[#ff7600] text-[#ff7600] rounded-md hover:bg-orange-50 transition"
          >
            Explore Services
          </Link>
        </div>
      </section>

      <section className="py-16 relative bg-[#000000]">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto px-6 z-20">
          {[
            { name: "Plumbing", icon: "🔧" },
            { name: "Electrician", icon: "💡" },
            { name: "Carpentry", icon: "🪵" },
            { name: "Repair", icon: "🛠️" },
            { name: "Cleaning", icon: "🧹" },
          ].map((service) => (
            <div
              key={service.name}
              className=" rounded-lg shadow hover:shadow-md p-6 text-center transition"
            >
              <div className="text-4xl mb-2">{service.icon}</div>
              <h3 className="text-lg font-semibold">{service.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: "1", title: "Book Service", desc: "Choose your service and schedule it instantly." },
            { step: "2", title: "Get Technician", desc: "We assign a verified technician for your request." },
            { step: "3", title: "Job Done", desc: "Technician completes the task to your satisfaction." },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
            >
              <div className="text-2xl font-bold text-orange-500 mb-2">{item.step}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-orange-50">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to book your first service?
        </h2>
        <Link
          href="/signup"
          className="mt-6 inline-block px-8 py-3 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition"
        >
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} FixIt. All rights reserved.
      </footer>
    </main>
    </div>
    </div>
  );
}
