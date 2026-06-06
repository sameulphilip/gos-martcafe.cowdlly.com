"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "ابحث في القائمة...",
}: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative px-4 py-3 md:px-6"
    >
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-2xl border border-stone-200/80 bg-white py-3.5 pr-11 pl-11",
            "text-sm text-stone-800 placeholder:text-stone-400",
            "shadow-sm focus:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue/15 focus:border-brand-blue/30",
            "transition-all duration-300"
          )}
        />
        {value && (
          <motion.button
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => onChange("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition"
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
