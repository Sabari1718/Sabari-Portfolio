import { PortfolioAPI } from '@/services/api';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Profile, Project, Skill, Experience, Education, SocialLink } from '@/types';

export default async function Home() {
  // Fetch all data from our Node.js backend
  const [
    profileRes,
    projectsRes,
    skillsRes,
    experienceRes,
    educationRes,
    socialLinksRes
  ] = await Promise.all([
    PortfolioAPI.getProfile(),
    PortfolioAPI.getProjects(),
    PortfolioAPI.getSkills(),
    PortfolioAPI.getExperience(),
    PortfolioAPI.getEducation(),
    PortfolioAPI.getSocialLinks(),
  ]);

  const profile: Profile | null = profileRes.success ? profileRes.data : null;
  const projects: Project[] = projectsRes.success ? projectsRes.data : [];
  const skills: Skill[] = skillsRes.success ? skillsRes.data : [];
  const experience: Experience[] = experienceRes.success ? experienceRes.data : [];
  const education: Education[] = educationRes.success ? educationRes.data : [];
  const socialLinks: SocialLink[] = socialLinksRes.success ? socialLinksRes.data : [];

  return (
    <main className="min-h-screen">
      <HeroSection profile={profile} />
      
      {/* Show other sections if data exists */}
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
      
      {/* Footer */}
      <footer className="py-8 text-center text-[var(--text-secondary)] border-t border-white/10">
        <p>© {new Date().getFullYear()} {profile?.name || 'Sabari'}. All rights reserved.</p>
      </footer>
    </main>
  );
}
