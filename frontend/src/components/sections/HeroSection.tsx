"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import { ArrowRight, Download } from "lucide-react";
import { getFileUrl } from "@/services/api";

export function HeroSection({ profile }: { profile: Profile | null }) {
  const profileImageUrl = profile?.profile_image
    ? getFileUrl(profile.profile_image)
    : null;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden mb-24 md:mb-32">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/30 rounded-full blur-[100px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--secondary)]/30 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 pt-32 md:pt-40 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <p className="text-[var(--primary)] font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
            WELCOME TO MY WORLD
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            Hi, I'm <br className="hidden md:block" />
            <span className="text-gradient drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              {profile?.display_name || profile?.name || "Sabarishwaran S"}
            </span>
          </h1>
          <h2 className="text-2xl md:text-4xl text-[var(--primary)] font-medium mb-6 drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            {profile?.headline || "Full-Stack Developer"}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto md:mx-0 mb-10">
            {profile?.bio ||
              "I turn ideas into high-performance mobile and web experiences that solve real-world problems. Building impactful products with Flutter and modern full-stack technologies."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
            <a href="#contact">
              <Button size="lg" className="bg-[var(--primary)] text-black hover:bg-[var(--primary)]/90 font-bold rounded-full px-10 py-6">
                Let's Talk
              </Button>
            </a>
            <a href="#projects">
              <Button variant="outline" size="lg" className="border-[var(--primary)] text-[var(--primary)] hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-colors font-bold rounded-full px-10 py-6">
                View Projects
              </Button>
            </a>
            {profile?.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="gap-2 px-10 py-6 rounded-full">
                  Resume <Download size={18} />
                </Button>
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex justify-center md:justify-end"
        >
          <div className="relative w-56 h-56 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full p-1.5 md:p-2 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_50px_rgba(0,229,255,0.5)] transition-shadow duration-500">
            <div className="w-full h-full rounded-full overflow-hidden bg-[var(--background)] flex items-center justify-center">
              <img
                src={profileImageUrl || "/placeholder-avatar.png"}
                alt={profile?.name || "Portfolio Owner"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(profile?.name || "S") + "&background=121212&color=FDE047&size=400";
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
