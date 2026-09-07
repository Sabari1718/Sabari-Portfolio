"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar({ settings }: { settings?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = ["home", "experience", "education", "projects", "skills", "contact"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Hide on admin routes
  if (pathname && pathname.startsWith("/admin")) return null;

  const navSettings = settings || {};
  const logoName = navSettings.logo_name || "Sabari Portfolio";

  const navLinks = [
    { name: "About", href: "#home" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "w-full z-[100] sticky top-0 transition-all duration-300 pointer-events-none",
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 py-2 shadow-2xl"
          : "bg-transparent py-4"
      )}
    >
      <nav
        className={cn(
          "navbar max-w-6xl w-11/12 mx-auto relative pointer-events-auto transition-all duration-300 flex justify-between items-center",
          scrolled ? "mt-0 mb-0" : "mt-2"
        )}
      >
        {/* Logo */}
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
          <span className="text-lg md:text-xl font-extrabold text-[#00E5FF] tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
            {logoName}
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId || (sectionId === "home" && activeSection === "home");
            return (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "nav-link text-sm font-medium transition-all duration-200",
                  isActive ? "text-[var(--primary)] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-white/80"
                )}
              >
                {link.name}
              </a>
            );
          })}

          {/* Hire Me CTA */}
          <a
            href="#contact"
            className="hire-me-btn ml-2 px-5 py-2 rounded-full text-sm font-bold bg-[var(--primary)] text-black hover:bg-[#00ffff] transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:scale-105"
          >
            Hire Me →
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-[#00E5FF] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-[120%] left-0 w-full bg-[#121212]/97 backdrop-blur-xl border border-[#00E5FF]/20 rounded-3xl p-5 flex flex-col gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)] md:hidden pointer-events-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link text-base text-center py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 px-6 py-3 rounded-full text-sm font-bold bg-[var(--primary)] text-black text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hire Me →
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
