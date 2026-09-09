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
    { name: "Education", href: "#education" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "w-full z-[100] sticky top-0 transition-all duration-300 pointer-events-none",
        scrolled
          ? "bg-[#080b12]/90 backdrop-blur-2xl border-b border-white/5 py-2 shadow-2xl"
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
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 border border-[var(--primary)]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.25)] group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-xs text-[var(--primary)]">S</span>
          </div>
          <span className="font-display text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-1 group-hover:text-[var(--primary)] transition-colors">
            {logoName === "Sabari Portfolio" ? (
              <>
                Sabari<span className="text-[var(--primary)] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">.dev</span>
              </>
            ) : (
              logoName
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_#00E5FF] animate-pulse ml-0.5" />
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId || (sectionId === "home" && activeSection === "home");
            return (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-300 relative",
                  isActive
                    ? "text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                {link.name}
              </a>
            );
          })}

          {/* Hire Me CTA */}
          <a
            href="#contact"
            className="hire-me-btn ml-3 px-5 py-2 rounded-full text-xs lg:text-sm font-extrabold bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.65)] flex items-center gap-1.5"
          >
            <span>Hire Me</span>
            <span className="text-base font-black">→</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-[#00E5FF] transition-colors p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-[125%] left-0 w-full bg-[#080b12]/98 backdrop-blur-2xl border border-[#00E5FF]/25 rounded-3xl p-5 flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.1)] md:hidden pointer-events-auto">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId || (sectionId === "home" && activeSection === "home");
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold text-center py-2.5 rounded-xl transition-colors",
                    isActive
                      ? "text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              );
            })}
            <a
              href="#contact"
              className="mt-2 px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black text-center shadow-[0_0_20px_rgba(0,229,255,0.4)]"
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
