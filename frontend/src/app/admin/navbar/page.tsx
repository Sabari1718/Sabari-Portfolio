"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PortfolioAPI } from "@/services/api";
import { Menu, Save, CheckCircle, AlertCircle } from "lucide-react";

export default function NavbarAdmin() {
  const [settings, setSettings] = useState({
    logo_name: "Sabari Portfolio",
    about_label: "About",
    projects_label: "Projects",
    skills_label: "Skills",
    contact_label: "Contact",
    show_about: true,
    show_projects: true,
    show_skills: true,
    show_contact: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await PortfolioAPI.getNavbarSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch navbar settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await PortfolioAPI.updateNavbarSettings(settings);
      if (res.success) {
        setMessage({ text: "Navbar settings saved successfully!", type: "success" });
      } else {
        setMessage({ text: res.message || "Failed to save settings.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "A network error occurred while saving.", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-[var(--text-secondary)] animate-pulse tracking-widest font-medium">LOADING NAVBAR SETTINGS...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">Navbar Settings</h1>
        <p className="text-[var(--text-secondary)] max-w-2xl text-lg">
          Manage the navigation links displayed on your public portfolio. Changes made here will be reflected instantly across the site.
        </p>
      </div>

      <Card className="border-white/5 bg-[#121212]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
        <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Menu className="text-[var(--primary)]" size={28} />
            Navigation Configuration
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Customize labels and toggle visibility for each section.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Logo Name */}
            <div className="space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
              <label className="text-sm font-bold tracking-wider uppercase text-[var(--primary)]">
                Logo / Brand Name
              </label>
              <Input
                value={settings.logo_name}
                onChange={(e) => setSettings({ ...settings, logo_name: e.target.value })}
                className="bg-black/50 border-white/10 text-white focus:border-[var(--primary)] h-12 text-lg px-4"
                placeholder="e.g. Sabari Portfolio"
                required
              />
              <p className="text-xs text-[var(--text-secondary)]">Displayed on the top left of the navigation bar.</p>
            </div>

            {/* Navigation Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Navigation Links</h3>
              
              <div className="grid gap-4">
                {/* About */}
                <NavItemRow 
                  title="About"
                  label={settings.about_label}
                  isVisible={settings.show_about}
                  onLabelChange={(val) => setSettings({ ...settings, about_label: val })}
                  onToggle={() => setSettings({ ...settings, show_about: !settings.show_about })}
                />
                
                {/* Projects */}
                <NavItemRow 
                  title="Projects"
                  label={settings.projects_label}
                  isVisible={settings.show_projects}
                  onLabelChange={(val) => setSettings({ ...settings, projects_label: val })}
                  onToggle={() => setSettings({ ...settings, show_projects: !settings.show_projects })}
                />
                
                {/* Skills */}
                <NavItemRow 
                  title="Skills"
                  label={settings.skills_label}
                  isVisible={settings.show_skills}
                  onLabelChange={(val) => setSettings({ ...settings, skills_label: val })}
                  onToggle={() => setSettings({ ...settings, show_skills: !settings.show_skills })}
                />
                
                {/* Contact */}
                <NavItemRow 
                  title="Contact"
                  label={settings.contact_label}
                  isVisible={settings.show_contact}
                  onLabelChange={(val) => setSettings({ ...settings, contact_label: val })}
                  onToggle={() => setSettings({ ...settings, show_contact: !settings.show_contact })}
                />
              </div>
            </div>

            {/* Status Messages */}
            {message.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
                message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20'
              }`}>
                {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                {message.text}
              </div>
            )}

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button 
                type="submit"
                disabled={saving}
                className="bg-[var(--primary)] text-black hover:bg-[var(--primary)]/90 font-black tracking-widest px-8 py-6 rounded-full text-sm w-full sm:w-auto shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                    SAVING...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={18} />
                    SAVE CHANGES
                  </span>
                )}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component for Nav Items
function NavItemRow({ 
  title, 
  label, 
  isVisible, 
  onLabelChange, 
  onToggle 
}: { 
  title: string, 
  label: string, 
  isVisible: boolean, 
  onLabelChange: (val: string) => void, 
  onToggle: () => void 
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border transition-all ${isVisible ? 'bg-white/[0.02] border-white/10' : 'bg-black/50 border-white/5 opacity-70'}`}>
      <div className="w-full sm:w-32 text-sm font-semibold text-[var(--text-secondary)]">
        {title} Link
      </div>
      
      <div className="flex-1 w-full">
        <Input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="bg-black/40 border-white/10 text-white focus:border-[var(--primary)] w-full"
          placeholder={`${title} label`}
          disabled={!isVisible}
          required={isVisible}
        />
      </div>
      
      <div className="flex items-center gap-3 mt-2 sm:mt-0 ml-auto">
        <span className={`text-xs font-bold uppercase tracking-wider ${isVisible ? 'text-green-400' : 'text-[var(--text-secondary)]'}`}>
          {isVisible ? 'Visible' : 'Hidden'}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isVisible ? 'bg-[var(--primary)]' : 'bg-white/20'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
              isVisible ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
