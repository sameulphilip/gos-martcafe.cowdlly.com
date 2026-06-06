"use client";

import { ProductImage } from "./ProductImage";
import { motion } from "framer-motion";
import { cn, formatPrice, getTagColor } from "@/lib/utils";
import { Star, Leaf, Flame, Sparkles, ChevronLeft } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import type { ItemWithCategory } from "@/types";

const tagIcons: Record<string, React.ReactNode> = {
  popular: <Star className="h-3 w-3 fill-current" />,
  vegetarian: <Leaf className="h-3 w-3" />,
  spicy: <Flame className="h-3 w-3" />,
  new: <Sparkles className="h-3 w-3" />,
  "chef-special": <Star className="h-3 w-3" />,
};

type MenuItemCardProps = {
  item: ItemWithCategory;
  onClick: () => void;
  index?: number;
};

export function MenuItemCard({ item, onClick, index = 0 }: MenuItemCardProps) {
  const primaryTag = item.tags[0];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      custom={index % 6}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group w-full text-right rounded-2xl bg-white p-4 card-shadow",
        "transition-shadow duration-300 hover:card-shadow-hover",
        "flex gap-4 items-start overflow-hidden relative",
        !item.isAvailable && "opacity-60"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-l from-brand-gold/0 to-brand-gold/0 group-hover:from-brand-gold/5 transition-all duration-500 pointer-events-none rounded-2xl" />

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-stone-100">
        {item.image ? (
          <ProductImage
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="96px"
          />
        ) : (
          <div className="h-full w-full bg-cream-dark flex items-center justify-center text-stone-400 text-xs">
            No image
          </div>
        )}
        {primaryTag && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05, type: "spring", stiffness: 400 }}
            className={cn(
              "absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow-md ring-2 ring-white",
              getTagColor(primaryTag)
            )}
          >
            {tagIcons[primaryTag]}
          </motion.span>
        )}
      </div>

      <div className="flex-1 min-w-0 relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight group-hover:text-brand-blue transition-colors duration-300">
              {item.name}
            </h3>
            {item.size && (
              <span className="shrink-0 rounded-md bg-brand-blue/10 px-2 py-0.5 text-xs font-bold text-brand-blue">
                {item.size}
              </span>
            )}
          </div>
          {!item.isAvailable && (
            <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              نفذ
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-brand-gold tabular-nums">
            {formatPrice(item.price)}
          </p>
          <span className="flex items-center gap-0.5 text-xs text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            التفاصيل
            <ChevronLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export function MenuItemCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 card-shadow">
      <div className="h-24 w-24 shrink-0 rounded-xl skeleton" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-5 w-3/4 rounded skeleton" />
        <div className="h-3 w-full rounded skeleton" />
        <div className="h-3 w-2/3 rounded skeleton" />
        <div className="h-4 w-16 rounded skeleton mt-2" />
      </div>
    </div>
  );
}

export function ItemBadge({ tag }: { tag: string }) {
  const labels: Record<string, string> = {
    popular: "Popular",
    new: "New",
    "chef-special": "Chef Special",
    spicy: "Spicy",
    vegetarian: "Vegetarian",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm",
        getTagColor(tag)
      )}
    >
      {tagIcons[tag]}
      {labels[tag] ?? tag}
    </span>
  );
}
