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

type DesktopSidebarProps = {
  categories: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
};

function SidebarItem({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition text-right",
        isActive ? "text-white" : "text-stone-600 hover:text-stone-900"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-brand-red shadow-md shadow-brand-red/20"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {!isActive && (
        <span className="absolute inset-0 rounded-xl hover:bg-white/80 transition-colors" />
      )}
      <Icon className="relative h-4 w-4 shrink-0" />
      <span className="relative">{label}</span>
    </button>
  );
}

export function DesktopCategorySidebar({
  categories,
  activeId,
  onSelect,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-28 space-y-1 rounded-2xl bg-white/60 backdrop-blur-sm p-3 ring-1 ring-stone-200/60">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3 px-3">
          الأقسام
        </p>
        <SidebarItem
          label="القائمة الرئيسية"
          icon={LayoutGrid}
          isActive={activeId === null}
          onClick={() => onSelect(null)}
        />
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.name] ?? LayoutGrid;
          return (
            <SidebarItem
              key={cat.id}
              label={cat.name}
              icon={Icon}
              isActive={activeId === cat.id}
              onClick={() => onSelect(cat.id)}
            />
          );
        })}
      </div>
    </aside>
  );
}
