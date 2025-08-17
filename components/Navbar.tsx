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
    { name: "Services", id: "services" },
    { name: "Work", id: "work" },
    { name: "Contact", id: "contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky w-full z-50">
      <Navbar>
        <NavBody>
          <NavbarLogo />

          <NavItems
            items={navItems.map((item) => ({
              name: item.name,
              link: `#${item.id}`,
            }))}
            onItemClick={(e) => {
              e?.preventDefault?.();
              const targetId = e?.currentTarget?.getAttribute("href")?.replace("#", "");
              if (targetId) scrollToSection(targetId);
            }}
          />

          <div className="flex items-center gap-4">
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/api/auth/signin");
              }}
              variant="custom"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/signup");
              }}
              variant="custom"
            >
              Signup
            </NavbarButton>
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
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="relative text-neutral-900 dark:text-neutral-300 text-left"
              >
                {item.name}
              </button>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/api/auth/signin");
                }}
                variant="primary"
                className="w-full bg-[#ff7600]"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/signup");
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
