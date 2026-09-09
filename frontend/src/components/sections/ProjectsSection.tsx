"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section, MassSectionHeader } from "@/components/ui/section";
import { Project } from "@/types";
import { Code, ExternalLink, Star, Sparkles, Smartphone, Globe, ArrowUpRight } from "lucide-react";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  if (!projects || projects.length === 0) return null;

  // Build filter tabs from project types
  const types = ["All", ...Array.from(new Set(projects.map((p) => p.type || "Other").filter(Boolean)))];

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => (p.type || "Other") === activeFilter);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const formatFilterLabel = (t: string) => {
    if (t.toLowerCase() === "all") return "All Work";
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  return (
    <Section id="projects" className="bg-white/[0.02]">
      {/* Section Header */}
      <MassSectionHeader
        badge="Portfolio Showcase"
        titleWhite="Featured"
        titleGradient="Projects"
        subtitle="A curated selection of production-grade mobile applications and full-stack systems engineered with passion and precision."
        watermark="PROJECTS"
        icon={<Sparkles size={14} />}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center" style={{ gap: '14px', marginBottom: '56px' }}>
        {types.map((type) => {
          const isActive = activeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-7 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black shadow-[0_0_24px_rgba(0,229,255,0.45)] scale-105 font-extrabold"
                  : "bg-slate-900/70 text-slate-300 border border-white/10 hover:border-[var(--primary)]/40 hover:text-white"
              }`}
            >
              {formatFilterLabel(type)}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <motion.div
        key={activeFilter}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: '36px' }}
      >
        {filtered.map((project, index) => {
          const isMobile = project.type?.toLowerCase().includes("mobile") || project.type?.toLowerCase().includes("flutter");

          return (
            <motion.div key={project.id || index} variants={item} className="h-full">
              <div className="project-card group h-full flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-[var(--glass-bg)] hover:border-[var(--primary)]/40 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.6),0_0_30px_rgba(0,229,255,0.15)]">
                {/* Project Image / Visual Banner */}
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  {project.image_url ? (
                    <>
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1420] via-black/30 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#040814] flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:16px_16px]" />
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 flex items-center justify-center text-[var(--primary)] shadow-[0_0_24px_rgba(0,229,255,0.2)] group-hover:scale-110 transition-transform">
                        {isMobile ? <Smartphone size={28} /> : <Code size={28} />}
                      </div>
                      <span className="relative z-10 text-xs font-semibold uppercase tracking-widest text-slate-400 mt-2">
                        {project.type || "Application"}
                      </span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center pointer-events-none">
                    {project.featured ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                        <Star size={11} fill="currentColor" />
                        Featured
                      </span>
                    ) : <div />}

                    {project.type && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[var(--primary)] text-xs font-semibold backdrop-blur-md">
                        {isMobile ? <Smartphone size={12} /> : <Globe size={12} />}
                        {project.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-7" style={{ padding: '28px 26px' }}>
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          title="View Source Code"
                          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:scale-105"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Code size={16} />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Preview"
                          className="w-9 h-9 rounded-full bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)] transition-all hover:scale-105 shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 flex-1 leading-relaxed mb-5">
                    {project.short_description || (project.description ? project.description.substring(0, 130) + "..." : "High-performance project engineered with clean code.")}
                  </p>

                  {/* Tech stack */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech.id} className="tech-tag">
                          {tech.technology}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="tech-tag">+{project.technologies.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Footer Action Link */}
                  {(project.live_url || project.github_url) && (
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                      <a
                        href={(project.live_url || project.github_url) as string}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:text-cyan-300 transition-colors"
                      >
                        <span>{project.live_url ? "Launch Live Project" : "Inspect Source"}</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
