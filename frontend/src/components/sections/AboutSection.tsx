"use client";

import { Section, SectionHeading } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Experience, Education } from "@/types";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection({
  experiences,
  education,
}: {
  experiences: Experience[];
  education: Education[];
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <Section id="about">
      <SectionHeading>Experience & Education</SectionHeading>
      
      <div className="grid md:grid-cols-2 gap-12 mt-16">
        {/* Experience Timeline */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="text-[var(--primary)]" size={28} />
            <h3 className="text-2xl font-bold">Experience</h3>
          </div>
          
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent"
          >
            {experiences.map((exp, i) => (
              <motion.div key={exp.id || i} variants={item} className="relative">
                <Card className="ml-12 md:ml-0 z-10 relative">
                  <div className="absolute -left-12 md:-left-6 top-6 w-4 h-4 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]" />
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                    <h5 className="text-[var(--primary)] mb-4">{exp.company}</h5>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)] mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {exp.start_date ? new Date(exp.start_date).getFullYear() : '?'} - {exp.currently_working ? "Present" : (exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present')}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{exp.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Education Timeline */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="text-[var(--secondary)]" size={28} />
            <h3 className="text-2xl font-bold">Education</h3>
          </div>
          
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent"
          >
            {education.map((edu, i) => (
              <motion.div key={edu.id || i} variants={item} className="relative">
                <Card className="ml-12 md:ml-0 z-10 relative">
                  <div className="absolute -left-12 md:-left-6 top-6 w-4 h-4 rounded-full bg-[var(--secondary)] shadow-[0_0_10px_var(--secondary)]" />
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-white">{edu.degree} in {edu.field}</h4>
                    <h5 className="text-[var(--secondary)] mb-4">{edu.institution}</h5>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)] mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {edu.start_date ? new Date(edu.start_date).getFullYear() : '?'} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                        </span>
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-sm leading-relaxed">{edu.description}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
