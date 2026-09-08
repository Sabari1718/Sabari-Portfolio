"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/section";
import { Skill } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Frontend": "var(--primary)",
  "Backend": "#a78bfa",
  "Mobile": "#34d399",
  "Database": "#fb923c",
  "DevOps": "#f472b6",
  "Tools": "#fbbf24",
  "Other": "#94a3b8",
};

function getColor(category: string) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"];
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Section id="skills">
      <SectionHeading className="mb-16">Technical Skills</SectionHeading>
      <div style={{ height: '60px' }} />

      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 mt-4" style={{ gap: '40px' }}>
        {Object.entries(categories).map(([category, catSkills], catIdx) => {
          const color = getColor(category);
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1, duration: 0.5 }}
              className="skill-group-card rounded-3xl border border-white/5 bg-[var(--glass-bg)] hover:border-white/20 transition-all duration-400"
              style={{ padding: '40px' }}
            >
              {/* Category header */}
              <div className="flex items-center" style={{ gap: '16px', marginBottom: '32px' }}>
                <div
                  className="w-3 h-10 rounded-full"
                  style={{ background: color, boxShadow: `0 0 12px ${color}66` }}
                />
                <h3 className="text-lg font-bold text-white">{category}</h3>
                <span className="ml-auto text-xs text-[var(--text-secondary)] bg-white/5 px-2 py-1 rounded-full">
                  {catSkills.length} skills
                </span>
              </div>

              {/* Skill bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {catSkills.map((skill, skillIdx) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white/90">{skill.name}</span>
                      <span className="text-xs font-bold" style={{ color }}>{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: catIdx * 0.1 + skillIdx * 0.05, ease: "easeOut" }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
