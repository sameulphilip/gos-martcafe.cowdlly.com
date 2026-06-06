"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Coffee,
  GlassWater,
  Sandwich,
  Cake,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  "classic COFFEE": Coffee,
  "ICED DRINKS": GlassWater,
  "COFFEE FRAPPE": Coffee,
  "NON COFFEE FRAPPE": Coffee,
  MOJITO: GlassWater,
  "HOT DRINK": Coffee,
  "FRESH JUICE": GlassWater,
  SMOOTHIE: GlassWater,
  "ICE TEA": GlassWater,
  MATCHA: Coffee,
  "SOFT DRINK": GlassWater,
  DESSERTS: Cake,
  "SWEET WAFFLE": Cake,
  "DEFFERENT WAFFLE": Sandwich,
  "Croissant Corner": Sandwich,
  "POTATO CORNER": Sandwich,
  markat: LayoutGrid,
};

type CategoryPillProps = {
  id: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
};

export function CategoryPill({ name, isActive, onClick }: CategoryPillProps) {
  const Icon = categoryIcons[name] ?? LayoutGrid;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap z-10",
        "transition-colors duration-300",
        isActive ? "text-white" : "text-stone-600 hover:text-stone-900"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="category-pill-bg"
          className="absolute inset-0 rounded-full bg-brand-red shadow-lg shadow-brand-red/30"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {!isActive && (
        <span className="absolute inset-0 rounded-full bg-white border border-stone-200/80 shadow-sm" />
      )}
      <Icon className={cn("relative h-4 w-4", isActive && "drop-shadow-sm")} />
      <span className="relative">{name}</span>
    </button>
  );
}

type CategoryNavProps = {
  categories: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  sticky?: boolean;
};

export function CategoryNav({
  categories,
  activeId,
  onSelect,
  sticky = true,
}: CategoryNavProps) {
  return (
    <div
      className={cn(
        "z-30 bg-cream/90 backdrop-blur-xl border-b border-stone-200/50",
        sticky && "sticky top-0"
      )}
    >
      <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3 md:px-6">
        <CategoryPill
          id="all"
          name="القائمة الرئيسية"
          isActive={activeId === null}
          onClick={() => onSelect(null)}
        />
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            id={cat.id}
            name={cat.name}
            isActive={activeId === cat.id}
            onClick={() => onSelect(cat.id)}
          />
        ))}
      </div>
    </div>
  );
}
