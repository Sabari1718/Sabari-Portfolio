"use client";

import { motion } from "framer-motion";
import { Section, MassSectionHeader } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Experience, Education } from "@/types";
import { Briefcase, GraduationCap, Calendar, MapPin, Award, Building, Sparkles } from "lucide-react";

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  if (!experiences || experiences.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const item = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.5 } } };

  const getDuration = (exp: Experience) => {
    const start = exp.start_date ? new Date(exp.start_date) : null;
    const end = exp.currently_working ? new Date() : (exp.end_date ? new Date(exp.end_date) : null);
    if (!start || !end) return "";
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    if (yrs === 0) return `${mos} mo`;
    if (mos === 0) return `${yrs} yr`;
    return `${yrs} yr ${mos} mo`;
  };

  return (
    <Section id="experience">
      <MassSectionHeader
        badge="Career Milestones"
        titleWhite="Work"
        titleGradient="Experience"
        subtitle="Professional roles, engineering impact, and production deployments across my journey."
        watermark="EXPERIENCE"
        icon={<Briefcase size={14} />}
      />

      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] via-white/10 to-transparent hidden sm:block" />

          <div className="flex flex-col">
            {experiences.map((exp, i) => (
              <motion.div key={exp.id || i} variants={item} className="relative sm:pl-20" style={{ marginBottom: '80px' }}>
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 w-12 h-12 rounded-full bg-[var(--background)] border-2 border-[var(--primary)] hidden sm:flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  {exp.logo_url ? (
                    <img src={exp.logo_url} alt={exp.company} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <Briefcase size={18} className="text-[var(--primary)]" />
                  )}
                </div>

                <Card className="exp-card hover:border-[var(--primary)]/30 transition-all duration-400 group">
                  <CardContent style={{ padding: '40px' }}>
                    <div className="flex flex-wrap justify-between items-start" style={{ gap: '20px', marginBottom: '24px' }}>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[var(--primary)] transition-colors mb-2">{exp.role}</h3>
                        <h4 className="text-lg md:text-xl text-[var(--primary)] font-medium">{exp.company}</h4>
                      </div>
                      {Boolean(exp.currently_working) ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/15 border border-green-500/30 text-green-400 flex-shrink-0">
                          Current
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap text-sm text-[var(--text-secondary)]" style={{ gap: '16px', marginBottom: '16px' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>
                          {exp.start_date ? new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "?"} —{" "}
                          {Boolean(exp.currently_working) ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}
                        </span>
                        {getDuration(exp) && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs">{getDuration(exp)}</span>
                        )}
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{exp.description}</p>
                    )}

                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.technologies.split(",").map((tech) => (
                          <span key={tech.trim()} className="tech-tag">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export function EducationSection({ education }: { education: Education[] }) {
  if (!education || education.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <Section id="education" className="bg-white/[0.02]">
      {/* Section Header */}
      <MassSectionHeader
        badge="Academic Background"
        titleWhite="Education &"
        titleGradient="Qualifications"
        subtitle="Academic foundations and degree milestones that shaped my software engineering skillset."
        watermark="EDUCATION"
        icon={<GraduationCap size={14} />}
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '32px' }}
        >
          {education.map((edu, i) => {
            const startYear = edu.start_date ? new Date(edu.start_date).getFullYear() : "";
            const endYear = edu.end_date ? new Date(edu.end_date).getFullYear() : "Present";
            const dateStr = startYear ? `${startYear} — ${endYear}` : endYear;

            return (
              <motion.div key={edu.id || i} variants={item} className="h-full flex">
                <Card className="edu-card w-full flex flex-col justify-between group hover:border-[var(--primary)]/40 transition-all duration-400">
                  <CardContent style={{ padding: '36px 32px' }} className="flex flex-col flex-1">
                    {/* Top row: Icon & Dates */}
                    <div className="flex items-center justify-between" style={{ marginBottom: '22px' }}>
                      <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 flex items-center justify-center text-[var(--primary)] shadow-[0_0_16px_rgba(0,229,255,0.15)] group-hover:scale-105 transition-transform">
                        <GraduationCap size={22} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
                        <Calendar size={13} className="text-[var(--primary)]" />
                        {dateStr}
                      </span>
                    </div>

                    {/* Degree */}
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[var(--primary)] transition-colors leading-snug" style={{ marginBottom: '8px' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </h3>

                    {/* Institution */}
                    <div className="flex items-start gap-2 text-sm md:text-base text-slate-300 font-medium" style={{ marginBottom: '18px' }}>
                      <Building size={16} className="text-[var(--primary)] flex-shrink-0 mt-1" />
                      <span>{edu.institution}</span>
                    </div>

                    {/* Grade Badge */}
                    {edu.grade && (
                      <div style={{ marginBottom: '18px' }}>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                          <Award size={13} className="text-emerald-400" />
                          CGPA: {edu.grade}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {edu.description && (
                      <p className="text-sm text-slate-400 leading-relaxed mt-auto pt-2 border-t border-white/5">
                        {edu.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
