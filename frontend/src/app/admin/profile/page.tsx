"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Profile } from "@/types";
import {
  User, Mail, Phone, MapPin, Globe, GitFork, Link2,
  Link as LinkIcon2, FileText, CheckCircle, AlertCircle, Loader2, Save,
  Cpu, Folder, Briefcase, Sparkles, RefreshCw
} from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { extractProfileStats, embedProfileStats, DEFAULT_BIO } from "@/lib/profile-stats";

const EMPTY_PROFILE: Partial<Profile> = {
  name: "",
  display_name: "",
  headline: "",
  bio: DEFAULT_BIO,
  location: "COIMBATORE",
  email: "",
  phone: "",
  resume_url: "",
  github_url: "",
  linkedin_url: "",
  portfolio_url: "",
  twitter_url: "",
  years_experience: "1+",
  projects_count: "10+",
  technologies_count: "15+",
  repos_count: "10+",
  badge_text: "Open to Opportunities",
  greeting_text: "Hello, I'm",
};

type SaveStatus = "idle" | "saving" | "success" | "error";

const BADGE_PRESETS = [
  "Open to Opportunities",
  "Open to Full-Time Roles",
  "Available for Work",
  "Actively Interviewing",
];

const GREETING_PRESETS = [
  "Software Engineer",
  "Hello, I'm",
  "Full-Stack Developer",
  "Mobile Engineer",
];

export default function ProfileAdmin() {
  const [form, setForm] = useState<Partial<Profile>>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await PortfolioAPI.getProfile();
      if (res.success && res.data) {
        const { stats: extractedStats, cleanBio } = extractProfileStats(res.data);
        setForm((prev) => ({
          ...EMPTY_PROFILE,
          ...res.data,
          bio: cleanBio || prev.bio || DEFAULT_BIO,
          location: res.data.location || prev.location || "COIMBATORE",
          years_experience: extractedStats.years_experience || prev.years_experience || "1+",
          projects_count: extractedStats.projects_count || prev.projects_count || "10+",
          technologies_count: extractedStats.technologies_count || prev.technologies_count || "15+",
          repos_count: extractedStats.repos_count || prev.repos_count || "10+",
          badge_text: extractedStats.badge_text || prev.badge_text || "Open to Opportunities",
          greeting_text: extractedStats.greeting_text || prev.greeting_text || "Hello, I'm",
        }));
      }
    } catch {
      // profile might not exist yet — use empty form
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (saveStatus !== "idle") setSaveStatus("idle");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setSaveStatus("error");
      setErrorMsg("Full name is required.");
      return;
    }
    setSaveStatus("saving");
    setErrorMsg("");

    // Send dual-layer payload so both existing and updated backend persist the stats
    const payload = {
      ...form,
      bio: embedProfileStats(form.bio, form),
    };

    try {
      const res = await PortfolioAPI.updateProfile(payload);
      if (res.success) {
        setSaveStatus("success");
        setForm((prev) => ({ ...prev, ...form }));
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save profile.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Network error. Could not reach the server.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto pb-16">
      <AdminPageHeader
        badge="Developer Identity"
        title="Profile"
        titleAccent="Settings"
        subtitle="Configure your public developer brand, headline, recruitment badge, location, and social profiles."
        icon={<User size={13} />}
      />

      <form onSubmit={handleSave} className="flex flex-col gap-10">
        {/* ── 1. Hero Banner & Recruiter Introductions ── */}
        <AdminCard
          title="Hero Banner & Recruiter Introductions"
          subtitle="Customize your job availability badge, greeting, location, and the bio tagline shown to companies on the homepage."
        >
          <div className="space-y-8">
            {/* Top Row: Availability Badge & Greeting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col justify-between h-full space-y-4">
                <Field
                  label="Availability / Recruiter Status Badge"
                  name="badge_text"
                  value={form.badge_text ?? "Open to Opportunities"}
                  onChange={handleChange}
                  placeholder="e.g. Open to Opportunities"
                  helperText="Displays in a glowing pill above your greeting on the homepage"
                  icon={<Sparkles size={16} />}
                />

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles size={11} className="text-emerald-400" />
                      Suggested Presets
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Click to apply</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_PRESETS.map((preset) => {
                      const isSelected = form.badge_text === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, badge_text: preset }))}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                            isSelected
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.18)] font-semibold"
                              : "bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/10 hover:border-white/20"
                          }`}
                        >
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between h-full space-y-4">
                <Field
                  label="Greeting / Subheading"
                  name="greeting_text"
                  value={form.greeting_text ?? "Hello, I'm"}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer or Hello, I'm"
                  helperText="Displays above your name in glowing uppercase letters"
                  icon={<User size={16} />}
                />

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles size={11} className="text-cyan-400" />
                      Suggested Presets
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Click to apply</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {GREETING_PRESETS.map((preset) => {
                      const isSelected = form.greeting_text === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, greeting_text: preset }))}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                            isSelected
                              ? "bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/40 shadow-[0_0_12px_rgba(0,229,255,0.18)] font-semibold"
                              : "bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/10 hover:border-white/20"
                          }`}
                        >
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-6" />

            {/* Second Row: Headline & Current Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field
                label="Headline (Role & Specialties)"
                name="headline"
                value={form.headline ?? ""}
                onChange={handleChange}
                placeholder="e.g. Flutter Developer | Full-Stack Mobile Engineer"
                helperText="Appears below your name in dynamic rotating titles on hero"
              />
              <Field
                label="Current Location"
                name="location"
                value={form.location ?? ""}
                onChange={handleChange}
                placeholder="e.g. Coimbatore, Tamil Nadu, India"
                icon={<MapPin size={16} />}
                helperText="Shown with a location pin directly on your hero banner"
              />
            </div>

            <div className="border-t border-white/[0.06] pt-6" />

            {/* Third Row: Hero Introduction & Bio Tagline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Hero Introduction & Bio Tagline
                </label>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, bio: DEFAULT_BIO }))}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all font-mono cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Reset to default</span>
                </button>
              </div>
              <textarea
                name="bio"
                value={form.bio ?? ""}
                onChange={handleChange}
                rows={4}
                placeholder="Introduce yourself, your engineering philosophy, and what problems you solve..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none leading-relaxed font-sans"
              />
              <p className="text-xs text-slate-400">
                This exact text displays directly under your location pin on the homepage hero.
              </p>
            </div>
          </div>
        </AdminCard>

        {/* ── 2. Personal & Professional Identity ── */}
        <AdminCard
          title="Personal & Professional Identity"
          subtitle="Core identity details shown on the hero banner and navigation."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field
              label="Full Name"
              name="name"
              value={form.name ?? ""}
              onChange={handleChange}
              placeholder="Sabarishwaran S"
              required
              helperText="Primary developer name displayed across the website"
            />
            <Field
              label="Display Name"
              name="display_name"
              value={form.display_name ?? ""}
              onChange={handleChange}
              placeholder="Sabari"
              helperText="Short branding name shown on navbar logo & title"
            />
          </div>
        </AdminCard>

        {/* ── 3. Home Page Hero Counters & Metrics ── */}
        <div id="hero-stats">
          <AdminCard 
            title="Home Page Hero Counters & Metrics" 
            subtitle="Configure the 4 stat counter cards displayed right beneath your hero banner on the homepage."
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Field
                  label="Years Experience"
                  name="years_experience"
                  value={form.years_experience !== undefined && form.years_experience !== null ? String(form.years_experience) : "1+"}
                  onChange={handleChange}
                  placeholder="1+"
                  icon={<Briefcase size={16} />}
                  helperText="Metric: Years Exp."
                />
                <Field
                  label="Projects Built"
                  name="projects_count"
                  value={form.projects_count !== undefined && form.projects_count !== null ? String(form.projects_count) : "10+"}
                  onChange={handleChange}
                  placeholder="10+"
                  icon={<Folder size={16} />}
                  helperText="Metric: Projects"
                />
                <Field
                  label="Technologies"
                  name="technologies_count"
                  value={form.technologies_count !== undefined && form.technologies_count !== null ? String(form.technologies_count) : "15+"}
                  onChange={handleChange}
                  placeholder="15+"
                  icon={<Cpu size={16} />}
                  helperText="Metric: Tech Stack"
                />
                <Field
                  label="GitHub Repos"
                  name="repos_count"
                  value={form.repos_count !== undefined && form.repos_count !== null ? String(form.repos_count) : "10+"}
                  onChange={handleChange}
                  placeholder="10+"
                  icon={<GitFork size={16} />}
                  helperText="Metric: Repos"
                />
              </div>

              {/* Live Interactive Preview */}
              <div className="pt-6 border-t border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Live Home Page Preview:
                  </p>
                  <span className="text-xs text-cyan-400/90 font-mono font-medium">Updates in real-time</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                      {form.years_experience || "1+"}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                      {form.projects_count || "10+"}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                      Projects Built
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                      {form.technologies_count || "15+"}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                      Technologies
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                      {form.repos_count || "10+"}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                      GitHub Repos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* ── 4. Contact Information ── */}
        <AdminCard
          title="Contact Information"
          subtitle="Direct communication channels and CV resume download link."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field
              label="Email Address"
              name="email"
              value={form.email ?? ""}
              onChange={handleChange}
              placeholder="sabarishwaran@example.com"
              type="email"
              icon={<Mail size={16} />}
              helperText="Used for client inquiry notifications and contact button"
            />
            <Field
              label="Phone Number"
              name="phone"
              value={form.phone ?? ""}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              type="tel"
              icon={<Phone size={16} />}
              helperText="Direct contact phone or WhatsApp number"
            />
            <div className="md:col-span-2">
              <Field
                label="Resume URL (PDF / Drive Link)"
                name="resume_url"
                value={form.resume_url ?? ""}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/..."
                type="url"
                icon={<FileText size={16} />}
                helperText="Google Drive or direct PDF link opened by 'Download CV' and 'Hire Me' buttons"
              />
            </div>
          </div>
        </AdminCard>

        {/* ── 5. Social & Professional Profiles ── */}
        <AdminCard
          title="Social Links & Networks"
          subtitle="Public profile links shown in footer, hero social icons, and contact section."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field
              label="GitHub URL"
              name="github_url"
              value={form.github_url ?? ""}
              onChange={handleChange}
              placeholder="https://github.com/username"
              type="url"
              icon={<GitFork size={16} />}
              helperText="Opens developer profile on GitHub"
            />
            <Field
              label="LinkedIn URL"
              name="linkedin_url"
              value={form.linkedin_url ?? ""}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              type="url"
              icon={<Link2 size={16} />}
              helperText="Opens professional profile on LinkedIn"
            />
            <Field
              label="Portfolio URL"
              name="portfolio_url"
              value={form.portfolio_url ?? ""}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              type="url"
              icon={<Globe size={16} />}
              helperText="Domain or live deployment link"
            />
            <Field
              label="Twitter / X URL"
              name="twitter_url"
              value={form.twitter_url ?? ""}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              type="url"
              icon={<LinkIcon2 size={16} />}
              helperText="Personal or developer Twitter / X link"
            />
          </div>
        </AdminCard>

        {/* ── Status & Save Footer ── */}
        <div className="space-y-4 pt-2">
          {saveStatus === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 text-sm font-medium">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {saveStatus === "success" && (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-sm font-medium">
              <CheckCircle size={18} className="shrink-0" />
              <span>Profile updated in MySQL database successfully!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
            <p className="text-xs text-slate-400 font-mono">
              Safe Auto-Sync • Persisted directly to MySQL database
            </p>
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary)] via-cyan-400 to-[#00B8D4] text-black font-extrabold text-sm shadow-[0_0_24px_rgba(0,229,255,0.3)] hover:shadow-[0_0_32px_rgba(0,229,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving to MySQL...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Reusable Form Field Component with Clean Spacing ─────────────────────────

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  icon,
  helperText,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
        {label}
        {required && <span className="text-[var(--primary)] ml-1 font-bold">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-medium ${
            icon ? "pl-11 pr-4 py-3" : "px-4 py-3"
          }`}
        />
      </div>
      {helperText && (
        <p className="text-xs text-slate-400 leading-normal">{helperText}</p>
      )}
    </div>
  );
}
