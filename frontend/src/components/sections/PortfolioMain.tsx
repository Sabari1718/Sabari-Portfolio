"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Profile, Project, Skill, Experience, Education, SocialLink } from "@/types";

interface Props {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  socialLinks: SocialLink[];
}

export function PortfolioMain({
  profile,
  projects,
  skills,
  experience,
  education,
  socialLinks,
}: Props) {
  return (
    <div className="pt-8 pb-20">
      <HeroSection profile={profile} />

      {(experience.length > 0 || education.length > 0) && (
        <AboutSection experiences={experience} education={education} />
      )}

      {projects.length > 0 && (
        <ProjectsSection projects={projects} />
      )}

      {skills.length > 0 && (
        <SkillsSection skills={skills} />
      )}

      <ContactSection profile={profile} socialLinks={socialLinks} />
    </div>
  );
}
