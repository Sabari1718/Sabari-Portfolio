import { PortfolioAPI } from '@/services/api';
import { PortfolioMain } from '@/components/sections/PortfolioMain';
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
      <PortfolioMain 
        profile={profile}
        projects={projects}
        skills={skills}
        experience={experience}
        education={education}
        socialLinks={socialLinks}
      />
      
      <footer className="py-8 text-center text-[var(--text-secondary)] border-t border-white/10">
        <p>© {new Date().getFullYear()} {profile?.name || 'Sabari'}. All rights reserved.</p>
      </footer>
    </main>
  );
}

