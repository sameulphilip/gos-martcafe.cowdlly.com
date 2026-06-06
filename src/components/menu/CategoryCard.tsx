"use client";

import { ProductImage } from "./ProductImage";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import type { CategoryWithCount } from "@/types";

type CategoryCardProps = {
  category: CategoryWithCount;
  onClick: () => void;
  index?: number;
};

export function CategoryCard({ category, onClick, index = 0 }: CategoryCardProps) {
  const itemCount = category._count?.items ?? 0;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={index}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl aspect-[16/9]",
        "card-shadow transition-shadow duration-500 hover:card-shadow-lift"
      )}
    >
      {category.image ? (
        <ProductImage
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-red" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/25 to-transparent transition-opacity duration-500 group-hover:from-stone-900/90" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-brand-gold/10 mix-blend-overlay" />

      <div className="absolute bottom-0 right-0 left-0 p-5 md:p-6 text-right">
        <motion.h3
          className="font-serif text-2xl md:text-3xl font-bold text-white text-shadow"
        >
          {category.name}
        </motion.h3>
        <div className="mt-2 flex items-center justify-end gap-2">
          <p className="text-sm text-white/75">
            {itemCount} {itemCount === 1 ? "صنف" : "أصناف"}
          </p>
          <span className="flex items-center gap-1 text-xs font-medium text-white/90 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            استكشف
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export function CategoryCardSkeleton() {
  return <div className="w-full aspect-[16/9] rounded-2xl skeleton" />;
}
