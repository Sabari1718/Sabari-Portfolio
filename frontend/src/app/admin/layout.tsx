"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Folder, Briefcase, GraduationCap, Award, MessageSquare, ImageIcon, Menu, X, ChevronRight, Settings } from "lucide-react";
import { PortfolioAPI, getFileUrl } from "@/services/api";
import { Profile } from "@/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    // Verify token validity with backend
    const checkAuth = async () => {
      try {
        const authRes = await PortfolioAPI.getCurrentUser();
        if (!authRes.success) {
          localStorage.removeItem("token");
          router.push("/login?expired=true");
          return;
        }
        setIsAuthenticated(true);
        fetchProfile();
      } catch {
        setIsAuthenticated(true);
        fetchProfile();
      }
    };

    checkAuth();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const res = await PortfolioAPI.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile for sidebar", err);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isClient || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[var(--primary)] text-lg animate-pulse font-medium tracking-widest">
          INITIALIZING...
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] flex relative text-white font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--secondary)]/5 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Header (Hamburger) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center font-bold text-black">
            S
          </div>
          <h2 className="text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            SABARI
          </h2>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white/70 hover:text-white transition-colors p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Drawer - Premium Obsidian Developer Theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[270px] bg-[#070a11]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col
        transform transition-transform duration-300 md:translate-x-0 md:static
        ${isMobileMenuOpen ? "translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.8)]" : "-translate-x-full"}
      `}>
        {/* Top Brand Area */}
        <div className="h-24 flex items-center px-6 border-b border-white/[0.08]">
          <Link href="/admin" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] via-[#00B8D4] to-cyan-500 shadow-[0_0_20px_rgba(0,229,255,0.35)] flex items-center justify-center font-black text-black text-lg group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-widest uppercase">SABARI</h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30 uppercase">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider">Dev Admin Control</p>
            </div>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <SidebarLink href="/admin" currentPath={pathname} icon={<LayoutDashboard size={17}/>} text="Dashboard" />
          
          <div className="pt-5 pb-2 px-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Content & Media</p>
          </div>
          <SidebarLink href="/admin/profile" currentPath={pathname} icon={<Settings size={17}/>} text="Profile Settings" />
          <SidebarLink href="/admin/profile/photo" currentPath={pathname} icon={<ImageIcon size={17}/>} text="Profile Photo" />
          <SidebarLink href="/admin/projects" currentPath={pathname} icon={<Folder size={17}/>} text="Projects" />
          <SidebarLink href="/admin/experience" currentPath={pathname} icon={<Briefcase size={17}/>} text="Experience" />
          <SidebarLink href="/admin/education" currentPath={pathname} icon={<GraduationCap size={17}/>} text="Education" />
          <SidebarLink href="/admin/skills" currentPath={pathname} icon={<Award size={17}/>} text="Skills Arsenal" />
          
          <div className="pt-5 pb-2 px-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Preferences</p>
          </div>
          <SidebarLink href="/admin/navbar" currentPath={pathname} icon={<Menu size={17}/>} text="Navigation Bar" />
          <SidebarLink href="/admin/messages" currentPath={pathname} icon={<MessageSquare size={17}/>} text="Client Messages" />
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-white/[0.08] bg-black/40 shrink-0">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-[#121212] relative shadow-lg">
                <img 
                  src={getFileUrl(profile?.profile_image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'S')}&background=0a0a0a&color=00E5FF&size=100`}
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#070a11] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{profile?.name || "Sabari Developer"}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">sabari@portfolio</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl transition-all font-semibold text-xs group cursor-pointer"
          >
            <LogOut size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-white/[0.08] bg-[#070a11]/60 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Environment:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Production Active
            </span>
            <span className="text-white/20">|</span>
            <span className="text-xs text-slate-400 font-mono">Connected to MySQL Cloud</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>View Live Site</span>
              <span className="text-[var(--primary)] font-bold">↗</span>
            </a>
          </div>
        </header>

        {/* Content Body with Spacious Padding */}
        <main className="flex-1 p-6 md:p-12 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, currentPath, icon, text }: { href: string, currentPath: string | null, icon: React.ReactNode, text: string }) {
  const isExactMatch = currentPath === href;
  const isSubMatch = href !== "/admin" && href !== "/admin/profile" && currentPath?.startsWith(href + "/");
  const isActive = isExactMatch || isSubMatch;
  
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium group relative overflow-hidden ${
        isActive 
          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold border border-[var(--primary)]/30 shadow-[0_0_15px_rgba(0,229,255,0.12)]" 
          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div className={`transition-all duration-200 ${
          isActive 
            ? "text-[var(--primary)]" 
            : "text-slate-400 group-hover:text-slate-200"
        }`}>
          {icon}
        </div>
        <span className="text-xs md:text-sm tracking-wide">
          {text}
        </span>
      </div>
      
      {isActive && (
        <ChevronRight size={14} className="text-[var(--primary)] relative z-10" />
      )}
    </Link>
  );
}
