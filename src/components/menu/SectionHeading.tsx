"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mb-6 text-right", className)}
    >
      <div className="flex items-center justify-end gap-3">
        <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-brand-gold/60 to-transparent" />
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-sm text-stone-500 mt-1.5 pr-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
