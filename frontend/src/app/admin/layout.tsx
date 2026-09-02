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
    } else {
      setIsAuthenticated(true);
      fetchProfile();
    }
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
    <div className="min-h-screen bg-[#050505] flex relative overflow-hidden text-white font-sans">
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

      {/* Sidebar Drawer - Premium Glassmorphism */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0A0A0A]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col
        transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static
        ${isMobileMenuOpen ? "translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.5)]" : "-translate-x-full"}
      `}>
        {/* Top Brand Area */}
        <div className="h-28 flex flex-col justify-center px-8 relative">
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center font-black text-black text-xl">
              S
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase">SABARI</h2>
              <p className="text-[10px] text-[var(--primary)] mt-1 tracking-[0.3em] font-medium uppercase">Admin Panel</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarLink href="/admin" currentPath={pathname} icon={<LayoutDashboard size={18}/>} text="Dashboard" />
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Content</p>
          </div>
          <SidebarLink href="/admin/profile" currentPath={pathname} icon={<Settings size={18}/>} text="Profile Settings" />
          <SidebarLink href="/admin/navbar" currentPath={pathname} icon={<Menu size={18}/>} text="Navbar Settings" />
          <SidebarLink href="/admin/profile/photo" currentPath={pathname} icon={<ImageIcon size={18}/>} text="Profile Photo" />
          <SidebarLink href="/admin/projects" currentPath={pathname} icon={<Folder size={18}/>} text="Projects" />
          <SidebarLink href="/admin/experience" currentPath={pathname} icon={<Briefcase size={18}/>} text="Experience" />
          <SidebarLink href="/admin/education" currentPath={pathname} icon={<GraduationCap size={18}/>} text="Education" />
          <SidebarLink href="/admin/skills" currentPath={pathname} icon={<Award size={18}/>} text="Skills" />
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Inbox</p>
          </div>
          <SidebarLink href="/admin/messages" currentPath={pathname} icon={<MessageSquare size={18}/>} text="Messages" />
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 pb-12 md:pb-8 mt-auto relative shrink-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
          
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-[#121212] z-10 relative shadow-xl">
                <img 
                  src={getFileUrl(profile?.profile_image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'S')}&background=0a0a0a&color=FDE047&size=100`}
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0A0A0A] z-20 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{profile?.name || "Admin User"}</p>
              <p className="text-[11px] text-[#FDE047] truncate font-medium mt-0.5 tracking-wider uppercase">System Admin</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300 font-bold group shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wide">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 pt-16 md:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, currentPath, icon, text }: { href: string, currentPath: string | null, icon: React.ReactNode, text: string }) {
  // Exact match for dashboard and profile to prevent overlapping with profile/photo
  const isExactMatch = currentPath === href;
  const isSubMatch = href !== "/admin" && href !== "/admin/profile" && currentPath?.startsWith(href + "/");
  const isActive = isExactMatch || isSubMatch;
  
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${
        isActive 
          ? "text-white" 
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {/* Active State Background Gradient */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDE047]/20 to-transparent border-l-2 border-[#FDE047] z-0" />
      )}
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={`transition-all duration-300 ${
          isActive 
            ? "text-[#FDE047] drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" 
            : "text-white/40 group-hover:text-[#FDE047] group-hover:scale-110"
        }`}>
          {icon}
        </div>
        <span className={`text-sm tracking-wide transition-all duration-300 ${
          isActive ? "font-bold text-[#FDE047]" : ""
        }`}>
          {text}
        </span>
      </div>
      
      {isActive && (
        <ChevronRight size={16} className="text-[#FDE047]/60 relative z-10" />
      )}
    </Link>
  );
}
