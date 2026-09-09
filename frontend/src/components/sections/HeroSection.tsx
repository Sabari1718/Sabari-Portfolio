"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import { Download, ArrowDown, MapPin, Briefcase } from "lucide-react";
import { getFileUrl } from "@/services/api";
import { CountUp } from "@/components/ui/CountUp";
import { extractProfileStats } from "@/lib/profile-stats";

interface Props {
  profile: Profile | null;
  projectCount: number;
}

const TITLES = ["Flutter Developer", "Full-Stack Developer", "Mobile App Developer", "React & Next.js Developer"];

export function HeroSection({ profile, projectCount }: Props) {
  const profileImageUrl = profile?.profile_image ? getFileUrl(profile.profile_image) : null;
  const { stats: profileStats, cleanBio } = extractProfileStats(profile);

  // Parse number and suffix from strings like "2+", "1+", "15+", or number
  const parseStat = (
    val: string | number | undefined | null,
    fallbackNum: number,
    fallbackSuffix = "+"
  ) => {
    if (val === undefined || val === null || String(val).trim() === "") {
      return { value: fallbackNum, suffix: fallbackSuffix };
    }
    const str = String(val).trim();
    const numMatch = str.match(/\d+/);
    const suffixMatch = str.match(/[^\d\s]+/);

    const num = numMatch ? parseInt(numMatch[0], 10) : fallbackNum;
    const suffix = suffixMatch ? suffixMatch[0] : (str.includes("+") ? "+" : "");

    return { value: num, suffix: suffix || (str.match(/^\d+$/) ? "+" : "") };
  };

  const expStat = parseStat(profileStats.years_experience, 2, "+");
  const projStat = parseStat(profileStats.projects_count, projectCount || 1, "+");
  const techStat = parseStat(profileStats.technologies_count, 15, "+");
  const repoStat = parseStat(profileStats.repos_count, 10, "+");

  const stats = [
    { label: "Years Experience", value: expStat.value, suffix: expStat.suffix },
    { label: "Projects Built", value: projStat.value, suffix: projStat.suffix },
    { label: "Technologies", value: techStat.value, suffix: techStat.suffix },
    { label: "GitHub Repos", value: repoStat.value, suffix: repoStat.suffix },
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
              <div
                className="flex items-center gap-2.5 justify-center lg:justify-start text-[var(--text-secondary)]"
                style={{ marginTop: '24px', marginBottom: '24px' }}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 flex items-center justify-center text-[var(--primary)] shadow-[0_0_12px_rgba(0,229,255,0.15)]">
                  <MapPin size={15} />
                </div>
                <span className="text-sm md:text-base font-semibold uppercase tracking-wider text-slate-300">{profile.location}</span>
              </div>
            )}

            {/* Bio */}
            <p
              className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              style={{ marginBottom: '32px' }}
            >
              {cleanBio || "I build high-performance mobile and web applications that solve real-world problems. Specializing in Flutter, React, and Node.js."}
            </p>

            {/* CTA Buttons */}
            <div
              className="hero-cta-group"
              style={{ gap: '18px', marginTop: '10px', marginBottom: '44px' }}
            >
              <a href="#contact">
                <Button size="lg" className="hire-btn rounded-full font-bold text-base flex items-center justify-center gap-2">
                  <Briefcase size={18} />
                  Hire Me
                </Button>
              </a>
              <a href="#projects">
                <Button size="lg" className="view-work-btn rounded-full font-bold text-base flex items-center justify-center">
                  View My Work
                </Button>
              </a>
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noreferrer">
                  <Button size="lg" className="resume-btn rounded-full font-bold text-base flex items-center justify-center gap-2">
                    Resume <Download size={16} />
                  </Button>
                </a>
              )}
            </div>

            {/* Stats Row */}
            <div
              className="hero-stats-grid"
              style={{ gap: '16px', marginTop: '16px', marginBottom: '20px' }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="stat-card group"
                >
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[11px] md:text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider leading-tight group-hover:text-slate-200 transition-colors">
                    {stat.label}
                  </div>
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

        {/* Scroll indicator - safely placed and hidden on compact screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5 }}
          className="hidden 2xl:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[var(--text-secondary)] pointer-events-none"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold">Scroll Down</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ArrowDown size={16} className="text-[var(--primary)]" />
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
    <div className="h-20 md:h-24 overflow-hidden mb-4">
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
