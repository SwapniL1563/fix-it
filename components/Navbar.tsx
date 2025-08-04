"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Services",
      link: "#services",
    },
    {
      name: "Work",
      link: "#work",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];



  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="sticky w-full z-50">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton onClick={()=>{
                setIsMobileMenuOpen(false);
                router.push("/api/auth/signin")
                }} variant="secondary">Login</NavbarButton>
            <NavbarButton onClick={()=>{
                setIsMobileMenuOpen(false);
                router.push("/signup")
                }} variant="secondary">Get Started</NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-900 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={()=>{
                setIsMobileMenuOpen(false);
                router.push("/api/auth/signin")
                }}
                variant="primary"
                className="w-full bg-[#ff7600]"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={()=>{
                setIsMobileMenuOpen(false);
                router.push("/signup")
                }}
                variant="primary"
                className="w-full bg-[#0A0A0A] border-[#ff7600] border text-[#ff7600]"
              >
                Create Account
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
