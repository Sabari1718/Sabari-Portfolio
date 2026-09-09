"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, GraduationCap, Folder, Zap, Mail, Menu, X } from "lucide-react";

interface Props {
  settings?: any;
}

const NAV_LINKS = [
  { name: "About", href: "#home", id: "home", color: "#00E5FF", icon: User },
  { name: "Experience", href: "#experience", id: "experience", color: "#A78BFA", icon: Briefcase },
  { name: "Education", href: "#education", id: "education", color: "#38BDF8", icon: GraduationCap },
  { name: "Projects", href: "#projects", id: "projects", color: "#FBBF24", icon: Folder },
  { name: "Skills", href: "#skills", id: "skills", color: "#F43F5E", icon: Zap },
  { name: "Contact", href: "#contact", id: "contact", color: "#34D399", icon: Mail },
];

export function Navbar({ settings }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.35 }
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

  return (
    <header
      className={cn(
        "w-full z-[100] sticky top-0 transition-all duration-300 pointer-events-none",
        scrolled
          ? "bg-[#080b12]/92 backdrop-blur-2xl border-b border-white/5 py-3 shadow-2xl"
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
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group flex items-center gap-2.5 cursor-pointer select-none"
        >
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

        {/* Desktop Developer Dock with generous spacing & colorful interactions */}
        <div
          className="hidden md:flex items-center gap-2 lg:gap-3 bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(0,229,255,0.08)]"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            const isHovered = hoveredLink === link.id;
            const Icon = link.icon;

            return (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                onMouseEnter={() => setHoveredLink(link.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "relative px-4 lg:px-5 py-2.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 flex items-center gap-2 select-none cursor-pointer",
                  isActive
                    ? "text-white font-extrabold"
                    : "text-slate-300 hover:text-white"
                )}
              >
                {/* Active Electric Neon Capsule */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-capsule"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${link.color}30 0%, ${link.color}12 100%)`,
                      borderColor: link.color,
                      borderWidth: "1.5px",
                      borderStyle: "solid",
                      boxShadow: `0 0 24px ${link.color}55, 0 0 45px ${link.color}20, inset 0 0 14px ${link.color}30`,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  />
                )}

                {/* Hover Glow Pill (Vibrant Color Aura) */}
                {!isActive && isHovered && (
                  <motion.div
                    layoutId="hover-nav-capsule"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `${link.color}15`,
                      borderColor: `${link.color}45`,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      boxShadow: `0 0 16px ${link.color}35`,
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}

                {/* Micro Icon with Dynamic Color and Pop */}
                <Icon
                  size={15}
                  className="relative z-10 transition-all duration-200"
                  style={{
                    color: isActive || isHovered ? link.color : "#94a3b8",
                    filter: isActive ? `drop-shadow(0 0 8px ${link.color})` : (isHovered ? `drop-shadow(0 0 5px ${link.color}80)` : "none"),
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                  }}
                />

                {/* Text Label with Radiant Color Glow */}
                <span
                  className="relative z-10 tracking-wide font-medium"
                  style={{
                    color: isActive ? "#ffffff" : (isHovered ? link.color : undefined),
                    textShadow: isActive ? `0 0 14px ${link.color}80` : (isHovered ? `0 0 10px ${link.color}50` : "none"),
                    fontWeight: isActive ? 800 : 600,
                  }}
                >
                  {link.name}
                </span>

                {/* Active Micro Pulsing Dot */}
                {isActive && (
                  <span
                    className="relative z-10 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: link.color,
                      boxShadow: `0 0 10px ${link.color}, 0 0 16px ${link.color}`,
                    }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white hover:text-[var(--primary)] transition-colors p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[125%] left-0 w-full bg-[#080b12]/98 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex flex-col gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.15)] md:hidden pointer-events-auto z-50"
            >
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => {
                      setActiveSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer",
                      isActive ? "text-white" : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${link.color}30 0%, ${link.color}12 100%)`
                        : undefined,
                      borderColor: isActive ? link.color : "transparent",
                      borderWidth: "1.5px",
                      borderStyle: "solid",
                      boxShadow: isActive ? `0 0 20px ${link.color}40, inset 0 0 10px ${link.color}20` : "none",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
                      style={{
                        background: `${link.color}20`,
                        borderColor: `${link.color}50`,
                        color: link.color,
                        boxShadow: isActive ? `0 0 12px ${link.color}60` : "none",
                      }}
                    >
                      <Icon size={17} />
                    </div>
                    <span className="flex-1 text-left tracking-wide">{link.name}</span>
                    {isActive && (
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                          backgroundColor: link.color,
                          boxShadow: `0 0 10px ${link.color}`,
                        }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
