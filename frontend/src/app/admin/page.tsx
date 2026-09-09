"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Folder, Award, MessageSquare, ArrowRight, Briefcase, GraduationCap, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    experience: 0,
    education: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, messagesRes, expRes, eduRes] = await Promise.all([
          PortfolioAPI.getProjects(true),
          PortfolioAPI.getSkills(),
          PortfolioAPI.getMessages(),
          PortfolioAPI.getExperience(),
          PortfolioAPI.getEducation(),
        ]);
        
        let unreadCount = 0;
        if (messagesRes.success && messagesRes.data) {
          unreadCount = messagesRes.data.filter((m: any) => !m.is_read).length;
        }
        
        setStats({
          projects: projectsRes.success ? (projectsRes.data || []).length : 0,
          skills: skillsRes.success ? (skillsRes.data || []).length : 0,
          messages: unreadCount,
          experience: expRes.success ? (expRes.data || []).length : 0,
          education: eduRes.success ? (eduRes.data || []).length : 0,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      <AdminPageHeader
        badge="Mission Control"
        title="Admin"
        titleAccent="Dashboard"
        subtitle="Manage your developer portfolio content, track client messages, and configure live deployments."
        icon={<Sparkles size={13} />}
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all cursor-pointer"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={15} />
          </a>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Featured Projects"
          count={stats.projects}
          href="/admin/projects"
          icon={<Folder size={22} />}
          color="#00E5FF"
        />
        <StatCard
          label="Skills & Frameworks"
          count={stats.skills}
          href="/admin/skills"
          icon={<Award size={22} />}
          color="#38BDF8"
        />
        <StatCard
          label="Work Milestones"
          count={stats.experience}
          href="/admin/experience"
          icon={<Briefcase size={22} />}
          color="#A78BFA"
        />
        <StatCard
          label="Unread Messages"
          count={stats.messages}
          href="/admin/messages"
          icon={<MessageSquare size={22} />}
          color="#34D399"
          badge={stats.messages > 0 ? "Needs Reply" : "Inbox Clear"}
        />
      </div>
      
      {/* Quick Action Hub */}
      <AdminCard
        title="Portfolio Management Hub"
        subtitle="Quick shortcuts to modify live portfolio modules with zero downtime."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionLink
            title="Profile & Identity"
            desc="Update name, bio, social handles, and resume URL."
            href="/admin/profile"
          />
          <ActionLink
            title="Hero Stat Counters ⚡"
            desc="Configure 2+ yrs experience, 1+ projects, 15+ tech & repo stats."
            href="/admin/profile#hero-stats"
          />
          <ActionLink
            title="Projects & Showcase"
            desc="Add new builds, screenshots, live URLs & GitHub links."
            href="/admin/projects"
          />
          <ActionLink
            title="Career Experience"
            desc="Manage work timeline, responsibilities & tech stacks."
            href="/admin/experience"
          />
          <ActionLink
            title="Education & Degrees"
            desc="Manage academic history, CGPA grades & institutions."
            href="/admin/education"
          />
          <ActionLink
            title="Technical Skills"
            desc="Tune proficiency ratings and skill categories."
            href="/admin/skills"
          />
          <ActionLink
            title="Navigation Menu"
            desc="Toggle nav links and customize resume download button."
            href="/admin/navbar"
          />
        </div>
      </AdminCard>
    </div>
  );
}

function StatCard({
  label,
  count,
  href,
  icon,
  color,
  badge,
}: {
  label: string;
  count: number;
  href: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl border border-white/[0.08] bg-[#0c101a]/80 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-[var(--primary)]/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(0,229,255,0.1)] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 transition-transform group-hover:scale-110"
          style={{ background: `${color}15`, color, borderColor: `${color}30` }}
        >
          {icon}
        </div>
        {badge ? (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {badge}
          </span>
        ) : (
          <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        )}
      </div>

      <div>
        <div className="text-4xl font-black text-white tracking-tight group-hover:text-[var(--primary)] transition-colors">
          {count}
        </div>
        <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">{label}</p>
      </div>
    </Link>
  );
}

function ActionLink({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--primary)]/30 transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white group-hover:text-[var(--primary)] transition-colors">
            {title}
          </h4>
          <ArrowRight size={14} className="text-slate-500 group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}
