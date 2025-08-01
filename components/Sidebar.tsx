"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconHistory,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Wrench } from "lucide-react";
import Link from "next/link";

const linksByRole = {
  CUSTOMER: [
    {
      label: "Dashboard",
      href: "/dashboard/customer",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-[#ff7600]" />,
    },
    {
      label: "Recent",
      href: "/dashboard/customer/recent",
      icon: <IconHistory className="h-5 w-5 shrink-0 text-[#ff7600]" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-[#ff7600]" />,
    },
  ],

  TECHNICIAN: [
    {
      label: "Jobs",
      href: "/technician/jobs",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "/technician/profile",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
  ],

  ADMIN: [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Manage Users",
      href: "/admin/users",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
  ],
};

export default function SidebarLayout({
  children,
  role = "CUSTOMER",
}: {
  children: React.ReactNode;
  role?: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
}) {
  const links = linksByRole[role];
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex">
        <Sidebar open={true} setOpen={setOpen} animate={true}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-y-auto">
              <Logo />
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      <div className="flex items-center md:hidden fixed top-0 left-0 w-full bg-[#0b0b0b] border-b border-[#181818] p-3 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="text-[#ff7600] font-bold text-lg"
        >
          ☰
        </button>
        <span className="ml-3 font-semibold text-neutral-300">FixIt</span>
      </div>

      {open && (
        <div className="md:hidden fixed top-12 p-4 left-0 w-full bg-[#0b0b0b] border-b border-[#181818] z-40 transition">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="block px-4 py-3 text-neutral-300 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-screen overflow-y-auto bg-background text-foreground p-2 pt-14 md:pt-2">
        {children}
      </div>
    </div>
  );
}

export const Logo = () => (
  <Link
    href="/"
    className="flex items-center space-x-2 py-1 text-sm font-normal text-white"
  >
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium flex items-center justify-center text-lg gap-2 px-1"
    >
      <Wrench className="text-[#ff7600] text-sm" />
      FixIt
    </motion.span>
  </Link>
);
