import { PortfolioAPI } from '@/services/api';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Profile, Project, Skill, Experience, Education, SocialLink } from '@/types';

// Always SSR — never serve cached HTML from Vercel CDN
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch all data from our Node.js backend — cache: 'no-store' is set inside fetchAPI
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

  // Log on server so we can debug via Vercel logs
  console.log('[page] projects:', projectsRes.success, 'count:', projectsRes.data?.length ?? 0, projectsRes.message || '');

  const profile: Profile | null = profileRes.success ? profileRes.data : null;
  const projects: Project[] = (projectsRes.success && Array.isArray(projectsRes.data)) ? projectsRes.data : [];
  const skills: Skill[] = (skillsRes.success && Array.isArray(skillsRes.data)) ? skillsRes.data : [];
  const experience: Experience[] = (experienceRes.success && Array.isArray(experienceRes.data)) ? experienceRes.data : [];
  const education: Education[] = (educationRes.success && Array.isArray(educationRes.data)) ? educationRes.data : [];
  const socialLinks: SocialLink[] = (socialLinksRes.success && Array.isArray(socialLinksRes.data)) ? socialLinksRes.data : [];

  return (
    <main className="min-h-screen">
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
      
      <footer className="py-8 text-center text-[var(--text-secondary)] border-t border-white/10">
        <p>© {new Date().getFullYear()} {profile?.name || 'Sabari'}. All rights reserved.</p>
      </footer>
    </main>
  );
}
