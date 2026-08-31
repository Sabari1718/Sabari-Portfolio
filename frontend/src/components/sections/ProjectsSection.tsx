"use client";

import { Section, SectionHeading } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { Code, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  if (!projects || projects.length === 0) return null;

  return (
    <Section id="projects">
      <SectionHeading>Featured Projects</SectionHeading>
      
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
      >
        {projects.map((project, index) => (
          <motion.div key={project.id || index} variants={item}>
            <Card className="h-full flex flex-col group overflow-hidden">
              {project.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}
              <CardContent className="flex-1 flex flex-col p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                        <Code size={20} />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="text-white/60 hover:text-[var(--primary)] transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-[var(--text-secondary)] text-sm flex-1 mb-6">
                  {project.short_description || project.description?.substring(0, 120) + "..."}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech.id}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--primary)]"
                      >
                        {tech.technology}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-16 text-center">
        <Button variant="outline" size="lg">View All Projects</Button>
      </div>
    </Section>
  );
}
