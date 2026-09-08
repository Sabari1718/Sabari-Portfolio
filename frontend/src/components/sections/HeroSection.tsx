"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import { Download, ArrowDown, MapPin, Briefcase } from "lucide-react";
import { getFileUrl } from "@/services/api";
import { CountUp } from "@/components/ui/CountUp";

interface Props {
  profile: Profile | null;
  projectCount: number;
}

const TITLES = ["Flutter Developer", "Full-Stack Developer", "Mobile App Engineer", "React & Next.js Developer"];

export function HeroSection({ profile, projectCount }: Props) {
  const profileImageUrl = profile?.profile_image ? getFileUrl(profile.profile_image) : null;

  const stats = [
    { label: "Years Experience", value: 2, suffix: "+" },
    { label: "Projects Built", value: projectCount || 5, suffix: "+" },
    { label: "Technologies", value: 15, suffix: "+" },
    { label: "GitHub Repos", value: 10, suffix: "+" },
  ];

  return (
    <section id="home" className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="hero-bg-blob hero-blob-1" />
      <div className="hero-bg-blob hero-blob-2" />
      <div className="hero-bg-grid" />

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for Work
            </motion.div>

            {/* Greeting */}
            <p className="text-[var(--primary)] font-bold tracking-[0.25em] uppercase text-sm md:text-base mb-4">
              Hello, I'm
            </p>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              {profile?.display_name || profile?.name || "Sabarishwaran S"}
            </h1>

            {/* Animated Title */}
            <AnimatedTitles titles={TITLES} />

            {/* Location */}
            {profile?.location && (
              <div className="flex items-center gap-2 justify-center lg:justify-start text-[var(--text-secondary)] text-sm mb-6">
                <MapPin size={14} />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Bio */}
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed">
              {profile?.bio || "I build high-performance mobile and web applications that solve real-world problems. Specializing in Flutter, React, and Node.js."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-20">
              <a href="#contact">
                <Button size="lg" className="hire-btn rounded-full px-10 h-14 font-bold text-base flex items-center justify-center">
                  <Briefcase size={18} className="mr-2" />
                  Hire Me
                </Button>
              </a>
              <a href="#projects">
                <Button variant="outline" size="lg" className="view-work-btn rounded-full px-10 h-14 font-bold text-base border-[var(--primary)] text-[var(--primary)] flex items-center justify-center">
                  View My Work
                </Button>
              </a>
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="lg" className="rounded-full px-8 h-14 font-bold text-base gap-2 text-white/70 hover:text-white border border-white/10 flex items-center justify-center">
                    Resume <Download size={16} />
                  </Button>
                </a>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto lg:mx-0">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="stat-card text-center p-4 rounded-2xl"
                >
                  <div className="text-2xl md:text-3xl font-extrabold text-[var(--primary)]">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="flex-shrink-0 flex justify-center"
          >
            <div className="profile-photo-wrapper">
              <div className="profile-photo-ring" />
              <div className="profile-photo-inner">
                <img
                  src={profileImageUrl || "https://ui-avatars.com/api/?name=S&background=121212&color=00E5FF&size=400"}
                  alt={profile?.name || "Sabarishwaran"}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(profile?.name || "S") +
                      "&background=121212&color=00E5FF&size=400";
                  }}
                />
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="floating-badge floating-badge-1"
              >
                <span className="text-lg">⚡</span>
                <span className="text-xs font-bold text-white">Flutter Expert</span>
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="floating-badge floating-badge-2"
              >
                <span className="text-lg">🚀</span>
                <span className="text-xs font-bold text-white">Full-Stack Dev</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-secondary)]"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedTitles({ titles }: { titles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className="h-10 md:h-12 overflow-hidden mb-4">
      <motion.h2
        key={index}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--primary)]"
      >
        {titles[index]}
      </motion.h2>
    </div>
  );
}
