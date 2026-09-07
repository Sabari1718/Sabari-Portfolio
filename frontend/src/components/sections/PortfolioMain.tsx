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
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    // Determine active tab based on URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["about", "projects", "skills", "contact"].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab("home");
      }
    };

    // Run once on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="pt-8 pb-20">
      {activeTab === "home" && <HeroSection profile={profile} />}

      {activeTab === "about" && (experience.length > 0 || education.length > 0) && (
        <AboutSection experiences={experience} education={education} />
      )}

      {activeTab === "projects" && projects.length > 0 && (
        <ProjectsSection projects={projects} />
      )}

      {activeTab === "skills" && skills.length > 0 && (
        <SkillsSection skills={skills} />
      )}

      {activeTab === "contact" && (
        <ContactSection profile={profile} socialLinks={socialLinks} />
      )}
    </div>
  );
}
