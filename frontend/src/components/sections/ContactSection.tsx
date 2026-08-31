"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PortfolioAPI } from "@/services/api";
import { Send, Mail, MapPin, Phone, Link as LinkIcon } from "lucide-react";
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
          <h3 className="text-3xl font-bold">Let's talk about your next project</h3>
          <p className="text-[var(--text-secondary)]">
            Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
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

          {socialLinks && socialLinks.length > 0 && (
            <div className="pt-8 mt-8 border-t border-white/10">
              <p className="text-sm text-[var(--text-secondary)] mb-4">Follow me on</p>
              <div className="flex gap-4">
                {socialLinks.map(link => {
                  return (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--primary)] hover:text-black transition-colors"
                    >
                      <LinkIcon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm text-white/80">Your Name</label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm text-white/80">Your Email</label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm text-white/80">Subject</label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Project Inquiry" />
                </div>
                <div className="space-y-2">
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
