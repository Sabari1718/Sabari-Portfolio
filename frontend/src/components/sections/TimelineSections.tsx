"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Experience, Education } from "@/types";
import { Briefcase, GraduationCap, Calendar, MapPin, ExternalLink } from "lucide-react";

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
      <div className="flex items-center gap-4 mb-20 justify-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
          <Briefcase className="text-[var(--primary)]" size={24} />
        </div>
        <SectionHeading className="mb-0">Work Experience</SectionHeading>
      </div>

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

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div key={exp.id || i} variants={item} className="relative sm:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 w-12 h-12 rounded-full bg-[var(--background)] border-2 border-[var(--primary)] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] hidden sm:flex">
                  {exp.logo_url ? (
                    <img src={exp.logo_url} alt={exp.company} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <Briefcase size={18} className="text-[var(--primary)]" />
                  )}
                </div>

                <Card className="exp-card hover:border-[var(--primary)]/40 transition-all duration-300 group">
                  <CardContent className="p-8 sm:p-10">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[var(--primary)] transition-colors mb-1">{exp.role}</h3>
                        <h4 className="text-lg text-[var(--primary)] font-medium">{exp.company}</h4>
                      </div>
                      {exp.currently_working && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/15 border border-green-500/30 text-green-400 flex-shrink-0">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)] mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>
                          {exp.start_date ? new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "?"} —{" "}
                          {exp.currently_working ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}
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
  const item = { hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { duration: 0.5 } } };

  return (
    <Section id="education" className="bg-white/[0.015]">
      <div className="flex items-center gap-4 mb-20 justify-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/10 flex items-center justify-center">
          <GraduationCap className="text-[var(--secondary)]" size={24} />
        </div>
        <SectionHeading className="mb-0">Education</SectionHeading>
      </div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--secondary)] via-white/10 to-transparent hidden sm:block" />

          <div className="space-y-12">
            {education.map((edu, i) => (
              <motion.div key={edu.id || i} variants={item} className="relative sm:pl-20">
                <div className="absolute left-0 top-6 w-12 h-12 rounded-full bg-[var(--background)] border-2 border-[var(--secondary)] flex items-center justify-center shadow-[0_0_15px_rgba(0,184,212,0.4)] hidden sm:flex">
                  <GraduationCap size={18} className="text-[var(--secondary)]" />
                </div>

                <Card className="edu-card hover:border-[var(--secondary)]/40 transition-all duration-300 group">
                  <CardContent className="p-8 sm:p-10">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[var(--secondary)] transition-colors mb-1">
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                        </h3>
                        <h4 className="text-lg text-[var(--secondary)] font-medium">{edu.institution}</h4>
                      </div>
                      {edu.grade && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 text-[var(--secondary)] flex-shrink-0">
                          {edu.grade}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-3">
                      <Calendar size={13} />
                      <span>
                        {edu.start_date ? new Date(edu.start_date).getFullYear() : "?"} —{" "}
                        {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                      </span>
                    </div>

                    {edu.description && (
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{edu.description}</p>
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
