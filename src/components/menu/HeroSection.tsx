"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Coffee, Gamepad2, Heart, MapPin, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

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

const storyBlocks = [
  {
    emoji: "☕",
    text: "إحنا هنا مش مجرد كافيه… إحنا المكان اللي معمول مخصوص عشان يظبط مزاج الطلاب",
  },
  {
    emoji: "📚",
    text: "جو هادي ومريح يساعدكم تركزوا وتذاكروا براحتكم، مع مشروبات وأكل بأعلى جودة",
  },
  {
    emoji: "🎮",
    text: "محتاج تفصل بعد يوم طويل؟ عندنا مساحة للعب والترفيه مع صحابك",
  },
];

export function IntroSection() {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <span className="inline-block h-0.5 w-12 shimmer-line rounded-full mb-4" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-blue">
            أهلاً بيك في GO&apos;S MART
          </h2>
          <p className="mt-2 text-stone-500 text-sm">
            كل حاجة في مكان واحد — مذاكرة، هدوء، قهوة، أكل، لعب، وراحة نفسية
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl border border-stone-200/80 bg-white p-6 md:p-8 card-shadow overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-brand-blue via-brand-gold to-brand-red" />

          <div className="space-y-5">
            {storyBlocks.map((block, i) => (
              <div
                key={i}
                className={`flex gap-4 items-start text-right ${
                  i > 0 ? "pt-5 border-t border-stone-100" : ""
                }`}
              >
                <span className="text-2xl shrink-0 leading-none mt-0.5">{block.emoji}</span>
                <p className="text-sm md:text-base text-stone-700 leading-relaxed">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 relative rounded-2xl bg-white p-6 md:p-8 card-shadow text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-brand-blue via-brand-gold to-brand-red" />
          <Heart className="mx-auto h-5 w-5 text-brand-red/70 mb-3 fill-brand-red/20" />
          <p className="font-serif text-lg md:text-xl font-semibold text-brand-blue leading-relaxed">
            بعد يومك الدراسي… تعالى اقعد، خد مشروبك، وفكّر انت عايز تعمل إيه
          </p>
          <p className="mt-2 text-sm text-stone-400">— GO&apos;S MART</p>
        </motion.blockquote>
      </div>
    </section>
  );
}
