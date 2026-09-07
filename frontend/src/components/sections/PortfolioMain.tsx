"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { ExperienceSection, EducationSection } from "@/components/sections/TimelineSections";
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
    <div>
      {/* Hero — always shown */}
      <HeroSection profile={profile} projectCount={projects.length} />

      {/* Experience */}
      {experience.length > 0 && <ExperienceSection experiences={experience} />}

      {/* Education */}
      {education.length > 0 && <EducationSection education={education} />}

      {/* Projects */}
      {projects.length > 0 && <ProjectsSection projects={projects} />}

      {/* Skills */}
      {skills.length > 0 && <SkillsSection skills={skills} />}

      {/* Contact — always shown */}
      <ContactSection profile={profile} socialLinks={socialLinks} />
    </div>
  );
}
