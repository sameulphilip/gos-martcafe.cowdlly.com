"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Coffee, Gamepad2, Heart, MapPin, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import {
  MART_INTRO_LEAD,
  MART_INTRO_PARAGRAPHS,
  MART_INTRO_SUMMARY,
  MART_INTRO_TITLE,
  MART_QUOTE,
  MART_VIBES,
} from "@/lib/mart-intro";

const vibes = [
  { icon: BookOpen, label: "مذاكرة" },
  { icon: Coffee, label: "قهوة" },
  { icon: Gamepad2, label: "لعب" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[420px] md:min-h-[480px] flex items-end">
      <div className="absolute inset-0">
        <div className="absolute inset-0 hero-ken-burns">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=85"
            alt="GO'S MART Cafe"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/40 via-stone-900/30 to-cream" />
        <div className="absolute inset-0 grain-overlay" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative w-full px-4 pt-12 pb-14 md:px-6 md:pb-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mx-auto mb-5 relative"
          >
            <div className="absolute inset-0 mx-auto h-28 w-28 rounded-full bg-brand-red/20 blur-2xl" />
            <div className="relative mx-auto h-28 w-28 float-gentle">
              <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/40" />
              <div className="relative m-1.5 h-[calc(100%-12px)] w-[calc(100%-12px)] overflow-hidden rounded-full bg-white shadow-2xl ring-4 ring-white/60">
                <Image
                  src="/logo.png"
                  alt="GO'S MART Logo"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/20 mb-4"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-gold-light" />
            مكانك المفضل بعد يوم دراسي طويل
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={2}
            className="font-serif text-5xl md:text-6xl font-bold text-white text-shadow tracking-tight"
          >
            GO&apos;S MART
          </motion.h1>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-3 flex items-center justify-center gap-1.5 text-white/90"
          >
            <MapPin className="h-4 w-4 text-brand-gold-light" />
            <p className="text-sm md:text-base">كافيه وماركت للطلاب</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-6 flex items-center justify-center gap-6"
          >
            {vibes.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 transition hover:bg-white/25">
                  <Icon className={`h-5 w-5 text-white`} />
                </div>
                <span className="text-xs text-white/80 font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
    </section>
  );
}

export function IntroSection() {
  return (
    <section className="px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-stone-200/80 bg-white overflow-hidden card-shadow"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-l from-brand-blue via-brand-gold to-brand-red" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

          <div className="relative p-7 md:p-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-blue leading-tight">
              {MART_INTRO_TITLE}
            </h2>

            <p className="mt-6 text-base md:text-lg text-stone-700 leading-relaxed font-medium max-w-2xl mx-auto">
              {MART_INTRO_LEAD}
            </p>

            <div className="mt-8 space-y-6 text-right max-w-2xl mx-auto">
              {MART_INTRO_PARAGRAPHS.map((para, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg text-stone-600 leading-loose whitespace-pre-line border-t border-stone-100 pt-6 first:border-0 first:pt-0"
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {MART_VIBES.map((vibe) => (
                <span
                  key={vibe}
                  className="rounded-full bg-brand-blue/8 px-4 py-1.5 text-sm font-medium text-brand-blue ring-1 ring-brand-blue/10"
                >
                  {vibe}
                </span>
              ))}
            </div>

            <p className="mt-8 text-base md:text-lg font-semibold text-brand-blue leading-relaxed max-w-2xl mx-auto">
              {MART_INTRO_SUMMARY}
            </p>
          </div>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 relative rounded-3xl bg-gradient-to-br from-brand-blue to-brand-blue-light p-8 md:p-10 text-center overflow-hidden shadow-lg shadow-brand-blue/20"
        >
          <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
          <Heart className="relative mx-auto h-6 w-6 text-white/80 mb-4 fill-white/30" />
          <p className="relative font-serif text-xl md:text-2xl font-semibold text-white leading-relaxed">
            {MART_QUOTE}
          </p>
          <p className="relative mt-3 text-sm text-white/60">— GO&apos;S MART</p>
        </motion.blockquote>
      </div>
    </section>
  );
}
