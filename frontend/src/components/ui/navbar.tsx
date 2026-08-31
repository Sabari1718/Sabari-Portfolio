"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar({ title = "Portfolio" }: { title?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar on admin routes
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header 
      className={cn(
        "w-full z-[100] sticky top-0 transition-all duration-300 pointer-events-none",
        scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 py-2 shadow-2xl" : "bg-transparent py-4"
      )}
    >
      <nav className={cn(
        "navbar max-w-4xl mx-auto relative pointer-events-auto transition-all duration-300",
        scrolled ? "mt-0 mb-0 shadow-none border-white/10" : "mt-2"
      )}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
          <span className="text-xl md:text-2xl font-bold text-[#00E5FF] tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
            {title}
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link text-sm md:text-base"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-[#00E5FF] transition-colors drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-[120%] left-0 w-full bg-[#121212]/95 backdrop-blur-xl border border-[#00E5FF]/30 rounded-3xl p-4 flex flex-col gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(0,229,255,0.1)] md:hidden pointer-events-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link text-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
