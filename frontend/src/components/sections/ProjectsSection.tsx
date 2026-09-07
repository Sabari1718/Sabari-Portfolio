"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/section";
import { Project } from "@/types";
import { Code, ExternalLink, Star } from "lucide-react";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  if (!projects || projects.length === 0) return null;

  // Build filter tabs from project types
  const types = ["All", ...Array.from(new Set(projects.map((p) => p.type || "Other").filter(Boolean)))];

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => (p.type || "Other") === activeFilter);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <Section id="projects" className="bg-white/[0.02]">
      <SectionHeading>Featured Projects</SectionHeading>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
              activeFilter === type
                ? "bg-[var(--primary)] text-black border-[var(--primary)] shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                : "bg-white/5 border-white/10 text-white/70 hover:border-[var(--primary)]/50 hover:text-white"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div
        key={activeFilter}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filtered.map((project, index) => (
          <motion.div key={project.id || index} variants={item}>
            <div className="project-card group h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[var(--glass-bg)] hover:border-[var(--primary)]/40 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(0,229,255,0.1)]">
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                {project.image_url ? (
                  <>
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 flex items-center justify-center">
                    <Code size={40} className="text-[var(--primary)]/40" />
                  </div>
                )}

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </div>
                )}

                {/* Type badge */}
                {project.type && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] text-xs font-semibold">
                    {project.type}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0 ml-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Code size={15} />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-[var(--primary)]/20 flex items-center justify-center text-white/60 hover:text-[var(--primary)] transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] flex-1 leading-relaxed mb-4">
                  {project.short_description || (project.description ? project.description.substring(0, 120) + "..." : "No description available.")}
                </p>

                {/* Tech stack */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
