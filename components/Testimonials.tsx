"use client";

import React from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";

export default function Testimonials() {
  return (
    <div className="h-[25rem] flex flex-col antialiased bg-white dark:bg-[#020202] dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Booked a plumber through FixIt and he arrived within 30 minutes. Fixed the leak perfectly and was super professional. Highly recommend!",
    name: "Ravi Kumar",
    title: "Customer from Mumbai",
  },
  {
    quote:
      "Being a technician on FixIt helped me find regular work in my area. The app is easy to use and payments are hassle-free.",
    name: "Anil Sharma",
    title: "Plumbing Technician",
  },
  {
    quote:
      "I needed urgent electrician service during a power outage at night. FixIt connected me instantly – life saver!",
    name: "Priya Mehta",
    title: "Customer from Pune",
  },
  {
    quote:
      "The verification process for technicians ensures I always feel safe booking services for my home. Love the transparency.",
    name: "Sneha Patil",
    title: "Customer from Bangalore",
  },
  {
    quote:
      "FixIt has boosted my earnings as a carpenter. I can choose jobs near me and manage my schedule easily.",
    name: "Rajesh Verma",
    title: "Carpentry Technician",
  },
];
