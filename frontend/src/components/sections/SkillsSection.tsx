"use client";

import { motion } from "framer-motion";
import { Section, MassSectionHeader } from "@/components/ui/section";
import { Skill } from "@/types";
import { Cpu } from "lucide-react";

interface CategoryMeta {
  label: string;
  icon: string;
  color: string;
  order: number;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "Mobile Development": { label: "Mobile Development", icon: "📱", color: "#00E5FF", order: 1 },
  "Web Development": { label: "Web Development", icon: "🌐", color: "#38BDF8", order: 2 },
  "Frontend": { label: "Web Development", icon: "🌐", color: "#38BDF8", order: 2 },
  "Backend": { label: "Backend", icon: "⚙️", color: "#A78BFA", order: 3 },
  "Database": { label: "Database", icon: "🗄️", color: "#FB923C", order: 4 },
  "Tools": { label: "Tools", icon: "🛠️", color: "#FBBF24", order: 5 },
  "Other": { label: "Additional Skills", icon: "⚡", color: "#94A3B8", order: 99 },
};

function getEffectiveCategory(skill: Skill): string {
  const raw = (skill.category || "").trim();
  const name = (skill.name || "").toLowerCase().trim();

  // If already set to a valid non-empty category, normalize it
  if (raw && raw !== "Other" && raw !== "Select category...") {
    if (/mobile/i.test(raw)) return "Mobile Development";
    if (/front|web/i.test(raw)) return "Web Development";
    if (/back/i.test(raw)) return "Backend";
    if (/data/i.test(raw)) return "Database";
    if (/tool|devops/i.test(raw)) return "Tools";
    return raw;
  }

  // Automatic smart classifier by skill name
  if (/flutter|dart|mobile|rest\s*api|bloc|provider|getx|android|ios/i.test(name)) {
    return "Mobile Development";
  }
  if (/react|next|tailwind|type\s*script|java\s*script|html|css|redux|vue|web/i.test(name)) {
    return "Web Development";
  }
  if (/node|express|nest|fastapi|django|spring|graphql/i.test(name)) {
    return "Backend";
  }
  if (/sql|mongo|firebase|postgres|redis|database/i.test(name)) {
    return "Database";
  }
  if (/git|github|postman|docker|figma|vs\s*code|linux|jira/i.test(name)) {
    return "Tools";
  }

  return "Other";
}

function getCategoryConfig(category: string): CategoryMeta {
  return CATEGORY_META[category] || {
    label: category,
    icon: "⚡",
    color: "#00E5FF",
    order: 50,
  };
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  // 1. Deduplicate skills by name (keep highest proficiency)
  const uniqueMap = new Map<string, Skill>();
  skills.forEach((skill) => {
    const key = skill.name.toLowerCase().trim();
    if (!uniqueMap.has(key) || skill.proficiency > (uniqueMap.get(key)?.proficiency || 0)) {
      uniqueMap.set(key, skill);
    }
  });
  const cleanSkills = Array.from(uniqueMap.values());

  // 2. Group into smart categories
  const grouped = cleanSkills.reduce((acc, skill) => {
    const cat = getEffectiveCategory(skill);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort skills within each category by proficiency (descending)
  Object.values(grouped).forEach((list) => {
    list.sort((a, b) => b.proficiency - a.proficiency);
  });

  // 3. Sort categories in logical order (Mobile -> Frontend -> Backend -> Database -> Tools)
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const orderA = getCategoryConfig(a).order;
    const orderB = getCategoryConfig(b).order;
    return orderA - orderB;
  });

  return (
    <Section id="skills">
      <MassSectionHeader
        badge="Technical Arsenal"
        titleWhite="Technical"
        titleGradient="Skills"
        subtitle="Languages, mobile frameworks, web libraries, and tools I leverage to build scalable apps."
        watermark="SKILLS"
        icon={<Cpu size={14} />}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '28px', marginTop: '16px' }}>
        {sortedCategories.map((category, catIdx) => {
          const config = getCategoryConfig(category);
          const catSkills = grouped[category];

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.08, duration: 0.4 }}
              className="skill-group-card rounded-3xl border border-white/10 bg-[var(--glass-bg)] hover:border-[var(--primary)]/40 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(0,229,255,0.1)] flex flex-col justify-between"
              style={{ padding: '30px 26px' }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3" style={{ marginBottom: '26px' }}>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg border border-white/10 flex-shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                  style={{ background: `${config.color}15`, borderColor: `${config.color}35` }}
                >
                  <span>{config.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{config.label}</h3>
                <span className="ml-auto text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full flex-shrink-0">
                  {catSkills.length} {catSkills.length === 1 ? "skill" : "skills"}
                </span>
              </div>

              {/* Skill Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {catSkills.map((skill, skillIdx) => (
                  <div key={skill.id || skill.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                      <span
                        className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5"
                        style={{ color: config.color }}
                      >
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900/90 border border-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: catIdx * 0.05 + skillIdx * 0.04, ease: "easeOut" }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{
                          background: `linear-gradient(90deg, ${config.color}88, ${config.color})`,
                          boxShadow: `0 0 10px ${config.color}66`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
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
