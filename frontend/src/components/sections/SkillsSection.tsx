"use client";

import { Section, SectionHeading } from "@/components/ui/section";
import { Skill } from "@/types";
import { motion } from "framer-motion";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Section id="skills" className="bg-white/[0.02]">
      <SectionHeading>Technical Skills</SectionHeading>
      
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-16">
        {Object.entries(categories).map(([category, catSkills], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--glass-bg)] border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
              {category}
            </h3>
            
            <div className="space-y-6">
              {catSkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-[var(--text-secondary)]">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
