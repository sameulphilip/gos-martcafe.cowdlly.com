"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection, IntroSection } from "@/components/menu/HeroSection";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { CategoryCard, CategoryCardSkeleton } from "@/components/menu/CategoryCard";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { ItemModal } from "@/components/menu/ItemModal";
import { SearchBar } from "@/components/menu/SearchBar";
import { DesktopCategorySidebar } from "@/components/menu/DesktopSidebar";
import { SectionHeading } from "@/components/menu/SectionHeading";
import { easeOutExpo } from "@/lib/motion";
import type { CategoryWithCount, ItemWithCategory } from "@/types";

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOutExpo } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export function MenuPageClient() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [items, setItems] = useState<ItemWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemWithCategory | null>(null);
  const [search, setSearch] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories ?? []);
        setItems(data.items ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeCategoryId) {
      result = result.filter((i) => i.categoryId === activeCategoryId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    return result;
  }, [items, activeCategoryId, search]);

  const handleCategorySelect = useCallback((id: string | null) => {
    setActiveCategoryId(id);
    setSearch("");
    if (id) {
      setTimeout(() => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const showCategoryGrid = activeCategoryId === null && !search.trim();
  const contentKey = `${activeCategoryId ?? "all"}-${search.trim()}`;

  return (
    <div className="min-h-screen bg-cream pb-12">
      <HeroSection />
      <IntroSection />

      <div className="lg:hidden">
        <CategoryNav
          categories={categories}
          activeId={activeCategoryId}
          onSelect={handleCategorySelect}
        />
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <main className="px-4 md:px-6">
        <div className="mx-auto max-w-6xl lg:flex lg:gap-8">
          <DesktopCategorySidebar
            categories={categories}
            activeId={activeCategoryId}
            onSelect={handleCategorySelect}
          />

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={contentKey}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {showCategoryGrid ? (
                    <>
                      <SectionHeading
                        title="القائمة الرئيسية"
                        subtitle={`${categories.length} أقسام · اختار اللي يناسب مزاجك`}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        {categories.map((cat, i) => (
                          <CategoryCard
                            key={cat.id}
                            category={cat}
                            index={i}
                            onClick={() => handleCategorySelect(cat.id)}
                          />
                        ))}
                      </div>

                      {categories.map((cat) => {
                        const catItems = items.filter((i) => i.categoryId === cat.id);
                        if (catItems.length === 0) return null;
                        return (
                          <section
                            key={cat.id}
                            ref={(el) => { sectionRefs.current[cat.id] = el; }}
                            className="mt-14 scroll-mt-28"
                            id={`category-${cat.id}`}
                          >
                            <SectionHeading
                              title={cat.name}
                              subtitle={`${catItems.length} ${catItems.length === 1 ? "صنف" : "أصناف"}`}
                            />
                            <div className="grid gap-3 md:grid-cols-2">
                              {catItems.map((item, i) => (
                                <MenuItemCard
                                  key={item.id}
                                  item={item}
                                  index={i}
                                  onClick={() => setSelectedItem(item)}
                                />
                              ))}
                            </div>
                          </section>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {activeCategoryId && !search.trim() && (
                        <SectionHeading
                          title={categories.find((c) => c.id === activeCategoryId)?.name ?? ""}
                          subtitle={`${filteredItems.length} ${filteredItems.length === 1 ? "صنف" : "أصناف"}`}
                          className="mt-2"
                        />
                      )}

                      {search.trim() && (
                        <SectionHeading
                          title="نتائج البحث"
                          subtitle={`${filteredItems.length} ${filteredItems.length === 1 ? "نتيجة" : "نتائج"}`}
                          className="mt-2"
                        />
                      )}

                      {filteredItems.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-20 text-center"
                        >
                          <p className="text-4xl mb-3">🔍</p>
                          <p className="text-lg font-medium text-stone-700">مفيش نتائج</p>
                          <p className="text-sm text-stone-500 mt-1">جرب تبحث بكلمة تانية</p>
                        </motion.div>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {filteredItems.map((item, i) => (
                            <MenuItemCard
                              key={item.id}
                              item={item}
                              index={i}
                              onClick={() => setSelectedItem(item)}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/5" />
        <div className="relative border-t border-stone-200/80 py-10 text-center px-4">
          <p className="font-serif text-xl font-bold text-brand-blue">GO&apos;S MART</p>
          <p className="text-sm text-stone-500 mt-2 max-w-xs mx-auto leading-relaxed">
            مكانك اللي بيفهمك — مذاكرة، قهوة، وضحكة مع صحابك
          </p>
          <a
            href="/admin/login"
            className="inline-block mt-4 text-xs text-stone-300 hover:text-stone-400 transition"
          >
            Admin
          </a>
        </div>
      </footer>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
