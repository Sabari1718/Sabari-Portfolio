"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Profile } from "@/types";
import {
  User, Mail, Phone, MapPin, Globe, GitFork, Link2,
  Link as LinkIcon2, FileText, CheckCircle, AlertCircle, Loader2, Save,
  Cpu, Folder, Briefcase
} from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";

const EMPTY_PROFILE: Partial<Profile> = {
  name: "",
  display_name: "",
  headline: "",
  bio: "",
  location: "",
  email: "",
  phone: "",
  resume_url: "",
  github_url: "",
  linkedin_url: "",
  portfolio_url: "",
  twitter_url: "",
  years_experience: "2+",
  projects_count: "1+",
  technologies_count: "15+",
  repos_count: "10+",
};

type SaveStatus = "idle" | "saving" | "success" | "error";

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
        setForm((prev) => ({
          ...EMPTY_PROFILE,
          ...res.data,
          years_experience: res.data.years_experience ?? prev.years_experience ?? "2+",
          projects_count: res.data.projects_count ?? prev.projects_count ?? "1+",
          technologies_count: res.data.technologies_count ?? prev.technologies_count ?? "15+",
          repos_count: res.data.repos_count ?? prev.repos_count ?? "10+",
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
    try {
      const res = await PortfolioAPI.updateProfile(form);
      if (res.success) {
        setSaveStatus("success");
        // Keep user's typed changes in form state
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
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
      <AdminPageHeader
        badge="Developer Identity"
        title="Profile"
        titleAccent="Settings"
        subtitle="Configure your public developer brand, headline, contact channels, resume link, and social profiles."
        icon={<User size={13} />}
      />

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* ── Basic Info ──────────────────────────────── */}
        <AdminCard title="Personal & Professional Identity" subtitle="Core identity details shown on the hero banner and navigation.">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Full Name"
                name="name"
                value={form.name ?? ""}
                onChange={handleChange}
                placeholder="Sabarishwaran S"
                required
              />
              <Field
                label="Display Name"
                name="display_name"
                value={form.display_name ?? ""}
                onChange={handleChange}
                placeholder="Sabari (shown on portfolio logo & banner)"
              />
            </div>
            <Field
              label="Headline"
              name="headline"
              value={form.headline ?? ""}
              onChange={handleChange}
              placeholder="e.g. Flutter Developer | Full-Stack Mobile Engineer"
            />
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
                Professional Bio & Summary
              </label>
              <textarea
                name="bio"
                value={form.bio ?? ""}
                onChange={handleChange}
                rows={5}
                placeholder="Introduce yourself, your engineering philosophy, and what problems you solve..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>
        </AdminCard>

        {/* ── Home Page Hero Metrics & Counters ──────── */}
        <div id="hero-stats">
          <AdminCard 
            title="Home Page Hero Counters & Metrics" 
            subtitle="Configure the 4 stat counter cards displayed right beneath your hero banner on the homepage."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Field
                label="Years Experience"
                name="years_experience"
                value={form.years_experience !== undefined && form.years_experience !== null ? String(form.years_experience) : "2+"}
                onChange={handleChange}
                placeholder="2+"
                icon={<Briefcase size={16} />}
                helperText="Displays as: Years Experience"
              />
              <Field
                label="Projects Built"
                name="projects_count"
                value={form.projects_count !== undefined && form.projects_count !== null ? String(form.projects_count) : "1+"}
                onChange={handleChange}
                placeholder="1+"
                icon={<Folder size={16} />}
                helperText="Displays as: Projects Built"
              />
              <Field
                label="Technologies"
                name="technologies_count"
                value={form.technologies_count !== undefined && form.technologies_count !== null ? String(form.technologies_count) : "15+"}
                onChange={handleChange}
                placeholder="15+"
                icon={<Cpu size={16} />}
                helperText="Displays as: Technologies"
              />
              <Field
                label="GitHub Repos"
                name="repos_count"
                value={form.repos_count !== undefined && form.repos_count !== null ? String(form.repos_count) : "10+"}
                onChange={handleChange}
                placeholder="10+"
                icon={<GitFork size={16} />}
                helperText="Displays as: GitHub Repos"
              />
            </div>

            {/* Live Interactive Preview */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Live Home Page Preview:
                </p>
                <span className="text-[11px] text-cyan-400/90 font-mono font-medium">Updates in real-time</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-center p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                    {form.years_experience || "2+"}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                    Years Experience
                  </div>
                </div>
                <div className="text-center p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                    {form.projects_count || "1+"}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                    Projects Built
                  </div>
                </div>
                <div className="text-center p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                    {form.technologies_count || "15+"}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                    Technologies
                  </div>
                </div>
                <div className="text-center p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#38BDF8]">
                    {form.repos_count || "10+"}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                    GitHub Repos
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* ── Contact Info ────────────────────────────── */}
        <Section title="Contact Information" icon={<Mail size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field
              label="Email"
              name="email"
              value={form.email ?? ""}
              onChange={handleChange}
              placeholder="sabarishwaran@example.com"
              type="email"
              icon={<Mail size={16} />}
            />
            <Field
              label="Phone"
              name="phone"
              value={form.phone ?? ""}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              type="tel"
              icon={<Phone size={16} />}
            />
            <Field
              label="Location"
              name="location"
              value={form.location ?? ""}
              onChange={handleChange}
              placeholder="Chennai, Tamil Nadu, India"
              icon={<MapPin size={16} />}
            />
            <Field
              label="Resume URL"
              name="resume_url"
              value={form.resume_url ?? ""}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              type="url"
              icon={<FileText size={16} />}
            />
          </div>
        </Section>

        {/* ── Social Links ────────────────────────────── */}
        <Section title="Social Links" icon={<Globe size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field
              label="GitHub URL"
              name="github_url"
              value={form.github_url ?? ""}
              onChange={handleChange}
              placeholder="https://github.com/username"
              type="url"
              icon={<GitFork size={16} />}
            />
            <Field
              label="LinkedIn URL"
              name="linkedin_url"
              value={form.linkedin_url ?? ""}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              type="url"
              icon={<Link2 size={16} />}
            />
            <Field
              label="Portfolio URL"
              name="portfolio_url"
              value={form.portfolio_url ?? ""}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              type="url"
              icon={<Globe size={16} />}
            />
            <Field
              label="Twitter / X URL"
              name="twitter_url"
              value={form.twitter_url ?? ""}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              type="url"
              icon={<LinkIcon2 size={16} />}
            />
          </div>
        </Section>

        {/* ── Status & Save ───────────────────────────── */}
        {saveStatus === "error" && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
            <AlertCircle size={18} className="shrink-0" />
            {errorMsg}
          </div>
        )}
        {saveStatus === "success" && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium">
            <CheckCircle size={18} className="shrink-0" />
            Profile saved to MySQL successfully!
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#FDE047] to-[#FCD34D] text-black font-extrabold rounded-xl hover:scale-105 hover:shadow-[0_0_25px_rgba(253,224,71,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving to MySQL...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Reusable sub-components ──────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col gap-8 mb-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="text-[#FDE047] p-2 bg-[#FDE047]/10 rounded-lg">{icon}</div>
        <h3 className="text-xl font-bold text-white tracking-wide !m-0 !text-white !bg-none !-webkit-text-fill-color-initial" style={{ WebkitTextFillColor: 'white', background: 'none' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

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
    <div className="flex flex-col mb-4">
      <label className="block text-sm font-medium text-white/80" style={{ marginBottom: '10px', marginLeft: '4px' }}>
        {label}
        {required && <span className="text-[#FDE047] ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
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
          className={`w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white placeholder:text-white/20
            focus:outline-none focus:border-[#FDE047] focus:shadow-[0_0_15px_rgba(253,224,71,0.15)] transition-all font-medium`}
          style={{ 
            paddingTop: '14px', 
            paddingBottom: '14px', 
            paddingLeft: icon ? '44px' : '16px', 
            paddingRight: '16px' 
          }}
        />
      </div>
      {helperText && (
        <p className="text-[11px] text-slate-400 mt-1.5 ml-1">{helperText}</p>
      )}
    </div>
  );
}
