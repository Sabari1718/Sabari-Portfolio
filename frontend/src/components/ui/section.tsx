"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, children, className, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32 relative overflow-hidden scroll-mt-24", className)}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-6 relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-center text-gradient font-display text-mass-glow",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface MassSectionHeaderProps {
  badge: string;
  titleWhite: string;
  titleGradient: string;
  subtitle?: string;
  watermark: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MassSectionHeader({
  badge,
  titleWhite,
  titleGradient,
  subtitle,
  watermark,
  icon,
  className,
}: MassSectionHeaderProps) {
  return (
    <div className={cn("mass-header-wrapper", className)}>
      {/* Huge background watermark */}
      <span className="mass-watermark" aria-hidden="true">
        {watermark}
      </span>

      {/* Futuristic chip badge */}
      <div className="mass-chip">
        <span className="mass-chip-dot" />
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{badge}</span>
      </div>

      {/* Mass Gethu Title */}
      <h2 className="mass-title">
        <span className="text-white drop-shadow-[0_2px_16px_rgba(255,255,255,0.18)]">
          {titleWhite}{" "}
        </span>
        <span className="text-gradient text-mass-glow">{titleGradient}</span>
      </h2>

      {/* Cyber Glowing Accent Line */}
      <div className="mass-divider" />

      {/* Subtitle */}
      {subtitle && <p className="mass-subtitle">{subtitle}</p>}
    </div>
  );
}
