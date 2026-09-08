"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PortfolioAPI } from "@/services/api";
import { Send, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { SocialLink, Profile } from "@/types";
import { motion } from "framer-motion";

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const GlobeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const PLATFORM_ICONS: Record<string, any> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  website: GlobeIcon,
  portfolio: GlobeIcon,
};

function SocialIcon({ platform }: { platform: string }) {
  const Icon = PLATFORM_ICONS[platform.toLowerCase()] || GlobeIcon;
  return <Icon size={18} />;
}

export function ContactSection({
  profile,
  socialLinks,
}: {
  profile: Profile | null;
  socialLinks: SocialLink[];
}) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await PortfolioAPI.submitContact(formData);
      if (res.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    profile?.email ? { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` } : null,
    profile?.location ? { icon: MapPin, label: "Location", value: profile.location, href: null } : null,
    profile?.phone ? { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` } : null,
  ].filter(Boolean) as { icon: any; label: string; value: string; href: string | null }[];

  return (
    <Section id="contact" className="bg-white/[0.015]">
      <SectionHeading className="mb-16">Get In Touch</SectionHeading>
      <p className="text-center text-[var(--text-secondary)] max-w-xl mx-auto -mt-10 mb-20">
        Have a project or an opportunity? I'd love to hear from you. Fill in the form or reach out directly.
      </p>

      <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">Let's Work Together</h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            I'm currently open to full-time roles, freelance projects, and collaboration opportunities. Let's build something amazing together.
          </p>

          {/* Contact Info */}
          <div className="space-y-4 mt-8">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)]/20 transition-colors flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-white hover:text-[var(--primary)] transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm font-medium text-white">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social Links from DB */}
          {socialLinks.length > 0 && (
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-4">Connect</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 transition-all duration-300 text-sm font-medium"
                  >
                    <SocialIcon platform={link.platform} />
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3"
        >
          <Card className="rounded-3xl border border-white/5 bg-[var(--glass-bg)] shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-white/70 font-medium">Your Name</label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Sabarishwaran" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm text-white/70 font-medium">Email Address</label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm text-white/70 font-medium">Subject</label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Project Inquiry / Job Opportunity" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm text-white/70 font-medium">Message</label>
                  <Textarea id="message" name="message" required value={formData.message} onChange={handleChange} placeholder="Tell me about your project or opportunity..." className="min-h-[140px]" />
                </div>

                <Button type="submit" disabled={status === "loading"} size="lg" className="w-full gap-2 rounded-xl font-bold">
                  {status === "loading" ? "Sending..." : "Send Message"}
                  <Send size={17} />
                </Button>

                {status === "success" && (
                  <p className="text-green-400 text-sm text-center bg-green-500/10 rounded-xl py-3 border border-green-500/20">
                    ✅ Message sent! I'll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3 border border-red-500/20">
                    ❌ Failed to send. Please try again or email directly.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
