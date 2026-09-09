import { PortfolioAPI } from '@/services/api';
import { PortfolioMain } from '@/components/sections/PortfolioMain';
import { Profile, Project, Skill, Experience, Education, SocialLink } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [profileRes, projectsRes, skillsRes, experienceRes, educationRes, socialLinksRes] =
    await Promise.all([
      PortfolioAPI.getProfile(),
      PortfolioAPI.getProjects(),
      PortfolioAPI.getSkills(),
      PortfolioAPI.getExperience(),
      PortfolioAPI.getEducation(),
      PortfolioAPI.getSocialLinks(),
    ]);

  console.log('[page] projects:', projectsRes.success, 'count:', projectsRes.data?.length ?? 0);

  const profile: Profile | null = profileRes.success ? profileRes.data : null;
  const projects: Project[] = projectsRes.success && Array.isArray(projectsRes.data) ? projectsRes.data : [];
  const skills: Skill[] = skillsRes.success && Array.isArray(skillsRes.data) ? skillsRes.data : [];
  const experience: Experience[] = experienceRes.success && Array.isArray(experienceRes.data) ? experienceRes.data : [];
  const education: Education[] = educationRes.success && Array.isArray(educationRes.data) ? educationRes.data : [];
  const socialLinks: SocialLink[] = socialLinksRes.success && Array.isArray(socialLinksRes.data) ? socialLinksRes.data : [];

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

      <footer className="footer border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-400">
          <p>© {new Date().getFullYear()} {profile?.name || 'Sabarishwaran S'}. Built with ❤️ using Next.js & Node.js</p>
          <div className="flex items-center gap-5 font-medium">
            <a
              href={profile?.github_url || "https://github.com/Sabari1718"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[var(--primary)] transition-colors"
            >
              GitHub ↗
            </a>
            <span className="text-white/20">•</span>
            <a
              href={profile?.linkedin_url || "https://linkedin.com/in/sabarishwaran"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[var(--primary)] transition-colors"
            >
              LinkedIn ↗
            </a>
            {profile?.resume_url && (
              <>
                <span className="text-white/20">•</span>
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#F5C542] transition-colors"
                >
                  Resume ↗
                </a>
              </>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}
