import { Profile } from "@/types";

export interface HeroStatsData {
  years_experience?: string | number | null;
  projects_count?: string | number | null;
  technologies_count?: string | number | null;
  repos_count?: string | number | null;
  badge_text?: string | null;
  greeting_text?: string | null;
}

export const DEFAULT_BIO =
  "I build high-performance mobile and web applications that solve real-world problems. Specializing in Flutter, React, and Node.js.";

/**
 * Extracts hero stat metrics, badge text, greeting, and bio from profile.
 * Prefers direct column values if available, otherwise seamlessly extracts
 * from metadata embedded in bio.
 */
export function extractProfileStats(profile: Profile | null) {
  const stats: HeroStatsData = {
    years_experience: profile?.years_experience,
    projects_count: profile?.projects_count,
    technologies_count: profile?.technologies_count,
    repos_count: profile?.repos_count,
    badge_text: profile?.badge_text,
    greeting_text: profile?.greeting_text,
  };

  let cleanBio = profile?.bio || "";

  if (cleanBio && cleanBio.includes("<!--STATS:")) {
    try {
      const match = cleanBio.match(/<!--STATS:([\s\S]*?)-->/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (!stats.years_experience && parsed.years_experience) {
          stats.years_experience = parsed.years_experience;
        }
        if (!stats.projects_count && parsed.projects_count) {
          stats.projects_count = parsed.projects_count;
        }
        if (!stats.technologies_count && parsed.technologies_count) {
          stats.technologies_count = parsed.technologies_count;
        }
        if (!stats.repos_count && parsed.repos_count) {
          stats.repos_count = parsed.repos_count;
        }
        if (!stats.badge_text && parsed.badge_text) {
          stats.badge_text = parsed.badge_text;
        }
        if (!stats.greeting_text && parsed.greeting_text) {
          stats.greeting_text = parsed.greeting_text;
        }
      }
      cleanBio = cleanBio.replace(/<!--STATS:[\s\S]*?-->/g, "").trim();
    } catch {
      // if JSON parsing fails, just leave cleanBio as is
    }
  }

  return {
    stats: {
      years_experience: stats.years_experience || "2+",
      projects_count: stats.projects_count || "1+",
      technologies_count: stats.technologies_count || "15+",
      repos_count: stats.repos_count || "10+",
      badge_text: stats.badge_text || "Open to Opportunities",
      greeting_text: stats.greeting_text || "Hello, I'm",
    },
    cleanBio: cleanBio || DEFAULT_BIO,
  };
}

/**
 * Embeds stats metadata into the bio string.
 * This guarantees that even if the backend is running a version without
 * new table columns, the stats, badge, and greeting are 100% saved into MySQL.
 */
export function embedProfileStats(
  rawBio: string | null | undefined,
  stats: HeroStatsData
): string {
  const clean = (rawBio || "").replace(/<!--STATS:[\s\S]*?-->/g, "").trim();
  const payload = JSON.stringify({
    years_experience: stats.years_experience || "2+",
    projects_count: stats.projects_count || "1+",
    technologies_count: stats.technologies_count || "15+",
    repos_count: stats.repos_count || "10+",
    badge_text: stats.badge_text || "Open to Opportunities",
    greeting_text: stats.greeting_text || "Hello, I'm",
  });

  return clean ? `${clean}\n\n<!--STATS:${payload}-->` : `<!--STATS:${payload}-->`;
}
