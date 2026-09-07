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
        "text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-gradient",
        className
      )}
    >
      {children}
    </h2>
  );
}
