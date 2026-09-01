"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PortfolioAPI } from "@/services/api";
import { Send, Mail, MapPin, Phone, Link as LinkIcon, Linkedin, Github } from "lucide-react";
import { SocialLink, Profile } from "@/types";

export function ContactSection({ 
  profile, 
  socialLinks 
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
    } catch (err) {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Section id="contact">
      <SectionHeading>Get In Touch</SectionHeading>
      
      <div className="grid lg:grid-cols-5 gap-12 mt-16 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-3xl font-bold">Let’s Build Something Great Together</h3>
          <p className="text-[var(--text-secondary)]">
            Have a project, an idea, or an exciting opportunity? Let’s connect and turn it into something impactful.
          </p>
          
          <div className="space-y-6 mt-8">
            {profile?.email && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--primary)]">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Email</p>
                  <p className="font-medium text-white">{profile.email}</p>
                </div>
              </div>
            )}
            
            {profile?.location && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--primary)]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Location</p>
                  <p className="font-medium text-white">{profile.location}</p>
                </div>
              </div>
            )}
            
            {profile?.phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--primary)]">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Phone</p>
                  <p className="font-medium text-white">{profile.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 mt-8 border-t border-white/10">
            <p className="text-sm text-[var(--text-secondary)] mb-6">Connect with me</p>
            <div className="flex flex-wrap gap-4">
              <a 
                href={socialLinks?.find(l => l.platform.toLowerCase().includes('linkedin'))?.url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:-translate-y-1 cursor-pointer"
              >
                <Linkedin size={20} className="text-[var(--primary)] group-hover:text-[#FFD700] transition-colors duration-300 group-hover:scale-110 transform" />
                <span className="text-sm font-medium text-white/90 group-hover:text-[#FFD700] transition-colors duration-300">LinkedIn</span>
              </a>
              <a 
                href={socialLinks?.find(l => l.platform.toLowerCase().includes('github'))?.url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:-translate-y-1 cursor-pointer"
              >
                <Github size={20} className="text-[var(--primary)] group-hover:text-[#FFD700] transition-colors duration-300 group-hover:scale-110 transform" />
                <span className="text-sm font-medium text-white/90 group-hover:text-[#FFD700] transition-colors duration-300">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="name" className="text-sm text-white/80">Your Name</label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label htmlFor="email" className="text-sm text-white/80">Your Email</label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="subject" className="text-sm text-white/80">Subject</label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Project Inquiry" />
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="message" className="text-sm text-white/80">Message</label>
                  <Textarea id="message" name="message" required value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full gap-2"
                >
                  {status === "loading" ? "Sending..." : "Send Message"} 
                  <Send size={18} />
                </Button>

                {status === "success" && (
                  <p className="text-green-400 text-sm text-center mt-4">Message sent successfully! I'll get back to you soon.</p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-sm text-center mt-4">Failed to send message. Please try again later.</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
