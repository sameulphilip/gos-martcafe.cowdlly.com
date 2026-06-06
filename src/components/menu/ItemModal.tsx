"use client";

import { ProductImage } from "./ProductImage";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { overlayFade, slideUpModal } from "@/lib/motion";
import { ItemBadge } from "./MenuItemCard";
import type { ItemWithCategory } from "@/types";

type ItemModalProps = {
  item: ItemWithCategory | null;
  onClose: () => void;
};

export function ItemModal({ item, onClose }: ItemModalProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key={item.id}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            variants={overlayFade}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            variants={slideUpModal}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-white rounded-t-3xl">
              <div className="h-1 w-10 rounded-full bg-stone-200" />
            </div>

            <div className="relative h-60 w-full -mt-2">
              {item.image ? (
              <ProductImage
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              ) : (
                <div className="h-full w-full bg-cream-dark" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-stone-900/20" />

              {item.tags.length > 0 && (
                <div className="absolute top-4 right-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <ItemBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}

              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-stone-600" />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 pt-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
                    {item.name}
                  </h2>
                  {item.size && (
                    <span className="shrink-0 rounded-lg bg-brand-blue/10 px-2.5 py-1 text-sm font-bold text-brand-blue">
                      {item.size}
                    </span>
                  )}
                </div>
                <span className="shrink-0 rounded-xl bg-brand-gold/10 px-3 py-1.5 text-lg font-bold text-brand-gold tabular-nums">
                  {formatPrice(item.price)}
                </span>
              </div>

              {item.category && (
                <p className="mt-5 inline-flex items-center rounded-full bg-cream-dark px-3 py-1 text-xs font-medium text-stone-500">
                  {item.category.name}
                </p>
              )}

              {!item.isAvailable ? (
                <div className="mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 text-center">
                  غير متوفر حالياً — جرب تاني قريب
                </div>
              ) : (
                <p className="mt-6 text-center text-xs text-stone-400">
                  اسأل الموظف عند الطلب ✨
                </p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
