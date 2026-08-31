"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Profile } from "@/types";
import {
  User, Mail, Phone, MapPin, Globe, GitFork, Link2,
  Link as LinkIcon2, FileText, CheckCircle, AlertCircle, Loader2, Save
} from "lucide-react";

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
        setForm({ ...EMPTY_PROFILE, ...res.data });
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
        await fetchProfile(); // Re-fetch to confirm persistence
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold mb-8">
          <span className="text-[var(--primary)] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Profile</span>{" "}
          <span className="text-[#FDE047] drop-shadow-[0_0_8px_rgba(253,224,71,0.4)]">Settings</span>
        </h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-10">
        {/* ── Basic Info ──────────────────────────────── */}
        <Section title="Basic Information" icon={<User size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              placeholder="Sabari (shown on portfolio)"
            />
          </div>
          <Field
            label="Headline"
            name="headline"
            value={form.headline ?? ""}
            onChange={handleChange}
            placeholder="Flutter Developer | Full-Stack Developer"
          />
          <div className="mt-6">
            <label className="block text-sm font-medium text-white/80" style={{ marginBottom: '10px', marginLeft: '4px' }}>Bio</label>
            <textarea
              name="bio"
              value={form.bio ?? ""}
              onChange={handleChange}
              rows={5}
              placeholder="Tell visitors about yourself..."
              className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#FDE047] focus:shadow-[0_0_10px_rgba(253,224,71,0.1)] transition-all resize-none"
              style={{ paddingTop: '14px', paddingBottom: '14px', paddingLeft: '16px', paddingRight: '16px' }}
            />
          </div>
        </Section>

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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
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
    </div>
  );
}
