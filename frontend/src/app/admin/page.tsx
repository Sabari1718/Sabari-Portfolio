"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Folder, Award, MessageSquare, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0
  });

  useEffect(() => {
    // Basic stats fetch simulation - in a real scenario you'd have an /api/stats endpoint
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, messagesRes] = await Promise.all([
          PortfolioAPI.getProjects(),
          PortfolioAPI.getSkills(),
          PortfolioAPI.getMessages()
        ]);
        
        let unreadCount = 0;
        if (messagesRes.success && messagesRes.data) {
          unreadCount = messagesRes.data.filter((m: any) => !m.is_read).length;
        }
        
        setStats({
          projects: projectsRes.success ? projectsRes.data.length : 0,
          skills: skillsRes.success ? skillsRes.data.length : 0,
          messages: unreadCount
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">
            Dashboard
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Welcome back to your portfolio control center.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
          <Activity size={16} className="animate-pulse" />
          <span className="text-sm font-semibold tracking-wider uppercase">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projects Stat Card */}
        <div className="glass-card flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 transform translate-x-4 -translate-y-4">
            <Folder size={120} />
          </div>
          <div className="flex items-center gap-4 mb-4 z-10">
            <div className="p-3 bg-[var(--primary)]/20 rounded-xl border border-[var(--primary)]/30 text-[var(--primary)] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Folder size={24} />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">Total Projects</h3>
          </div>
          <div className="text-5xl font-black text-white z-10 drop-shadow-md">
            {stats.projects}
          </div>
        </div>

        {/* Skills Stat Card */}
        <div className="glass-card flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 transform translate-x-4 -translate-y-4">
            <Award size={120} />
          </div>
          <div className="flex items-center gap-4 mb-4 z-10">
            <div className="p-3 bg-[var(--secondary)]/20 rounded-xl border border-[var(--secondary)]/30 text-[var(--secondary)] shadow-[0_0_15px_rgba(0,184,212,0.2)]">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">Total Skills</h3>
          </div>
          <div className="text-5xl font-black text-white z-10 drop-shadow-md">
            {stats.skills}
          </div>
        </div>

        {/* Messages Stat Card */}
        <div className="glass-card flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 transform translate-x-4 -translate-y-4">
            <MessageSquare size={120} />
          </div>
          <div className="flex items-center gap-4 mb-4 z-10">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">Unread Messages</h3>
          </div>
          <div className="text-5xl font-black text-white z-10 drop-shadow-md">
            {stats.messages}
          </div>
        </div>
      </div>
      
      <div className="glass-card mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent z-0" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            Quick Actions
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/profile" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all font-medium">
              Manage Profile <ArrowRight size={16} className="opacity-50" />
            </Link>
            <Link href="/admin/projects" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all font-medium">
              Manage Projects <ArrowRight size={16} className="opacity-50" />
            </Link>
            <Link href="/admin/experience" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all font-medium">
              Manage Experience <ArrowRight size={16} className="opacity-50" />
            </Link>
            <Link href="/admin/education" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all font-medium">
              Manage Education <ArrowRight size={16} className="opacity-50" />
            </Link>
            <Link href="/admin/skills" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all font-medium">
              Manage Skills <ArrowRight size={16} className="opacity-50" />
            </Link>
            <a href="/" target="_blank" className="flex items-center gap-2 px-6 py-3 ml-auto btn-primary rounded-xl">
              View Live Site <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
