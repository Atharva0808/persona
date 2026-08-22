"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

/* ── Animation Presets ──
   Crisp, confident easing — no bounce, no spring wobble.
   This is editorial/brutalist, animations should feel intentional and sharp. */

const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

// Clip-reveal: text slides up from behind a mask
const slideUp = (delay = 0) => ({
  initial: { y: "100%", opacity: 0 },
  animate: { y: "0%", opacity: 1 },
  transition: { duration: 0.8, delay, ease: EASE_REVEAL },
});

// Fade in with slight upward drift
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE_REVEAL },
});

// Scroll-triggered fade up
const scrollFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: EASE_REVEAL },
});

// Scroll-triggered slide from left
const scrollSlideLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: EASE_REVEAL },
});

// Scroll-triggered scale reveal for color blocks
const scrollBlockReveal = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: EASE_REVEAL },
});

// Stagger container
const staggerContainer = (staggerDelay = 0.1) => ({
  initial: "initial",
  animate: "animate",
  variants: {
    initial: {},
    animate: { transition: { staggerChildren: staggerDelay } },
  },
});

// Child variant for stagger
const staggerChild = {
  initial: { y: "110%", opacity: 0 },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_REVEAL },
  },
};

const FEATURES = [
  {
    word: "Resume",
    desc: "Upload your PDF. Get ATS compatibility scoring, weak bullet detection, and quantified action rewrites.",
  },
  {
    word: "GitHub",
    desc: "Paste your handle. Commit consistency, README quality, repository depth — all evaluated.",
  },
  {
    word: "LinkedIn",
    desc: "Share your profile details. Headline keyword analysis and recruiter search optimization tips.",
  },
  {
    word: "Skills",
    desc: "Select your target role. Gap analysis across engineering tracks with a phased learning roadmap.",
  },
  {
    word: "Interview",
    desc: "Get tailored mock questions generated from your actual resume, projects, and target position.",
  },
];

const HERO_WORDS = ["Know", "where", "you", "stand"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0A0A0A] font-sans overflow-x-hidden selection:bg-[#E84B2B]/20 selection:text-[#E84B2B]">
      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full px-6 sm:px-10 py-5 flex items-center justify-between bg-[#0A0A0A] text-[#FAFAF8]"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)]">
            persona
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/login" className="text-[#FAFAF8]/70 hover:text-[#FAFAF8] transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-[#FAFAF8] text-[#0A0A0A] px-5 py-2.5 text-sm font-semibold hover:bg-[#FAFAF8]/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* ─── Hero: Color Block Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 min-h-[80vh] md:min-h-[85vh]">
        {/* Left block — warm red, massive type with staggered word reveals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#E84B2B] text-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-end relative overflow-hidden min-h-[50vh] md:min-h-0"
        >
          <motion.h1
            {...staggerContainer(0.08)}
            className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,12vw,9rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase"
          >
            {HERO_WORDS.map((word) => (
              <span key={word} className="block overflow-hidden">
                <motion.span className="block" variants={staggerChild}>
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>
        </motion.div>

        {/* Center block — black, value proposition */}
        <motion.div
          {...fadeUp(0.4)}
          className="bg-[#0A0A0A] text-[#FAFAF8] p-8 sm:p-12 flex flex-col justify-between min-h-[40vh] md:min-h-0"
        >
          <motion.div
            {...fadeUp(0.6)}
            className="text-xs uppercase tracking-[0.2em] text-[#FAFAF8]/40 font-[family-name:var(--font-display)]"
          >
            Interview Readiness Tool
          </motion.div>
          <div className="mt-auto">
            <motion.p
              {...fadeUp(0.7)}
              className="text-lg sm:text-xl leading-relaxed text-[#FAFAF8]/80 max-w-sm"
            >
              Persona evaluates your resume, GitHub, LinkedIn profile, and technical skills — then tells you
              exactly what to fix.
            </motion.p>
            <motion.p
              {...fadeUp(0.9)}
              className="text-sm text-[#FAFAF8]/40 mt-6 leading-relaxed max-w-xs"
            >
              No vanity metrics. No inflated scores.
              <br />
              Just an honest assessment and a roadmap.
            </motion.p>
          </div>
        </motion.div>

        {/* Right block — warm golden yellow, serif accent + CTA */}
        <motion.div
          {...fadeUp(0.5)}
          className="bg-[#F2C94C] text-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh] md:min-h-0"
        >
          <motion.div
            {...fadeUp(0.7)}
            className="text-xs uppercase tracking-[0.2em] text-[#0A0A0A]/60 font-[family-name:var(--font-display)]"
          >
            For Software Engineers
          </motion.div>
          <div className="mt-auto">
            <div className="overflow-hidden">
              <motion.p
                {...slideUp(0.8)}
                className="font-serif italic text-[clamp(2.5rem,6vw,5rem)] leading-[1] text-[#0A0A0A] tracking-[-0.01em]"
              >
                before
                <br />
                you apply.
              </motion.p>
            </div>
            <motion.div {...fadeUp(1.1)}>
              <Link
                href="/signup"
                className="inline-block mt-8 text-sm font-semibold text-[#0A0A0A] border-b-2 border-[#0A0A0A]/60 pb-1 hover:border-[#0A0A0A] transition-colors font-[family-name:var(--font-display)]"
              >
                Get Started →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── What It Does: Typography Feature Stack ─── */}
      <section className="bg-[#0A0A0A] text-[#FAFAF8] py-20 sm:py-28 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...scrollFadeUp(0)}
            className="text-xs uppercase tracking-[0.25em] text-[#FAFAF8]/30 mb-16 font-[family-name:var(--font-display)]"
          >
            What Persona Does
          </motion.div>

          {/* Feature list — massive type with descriptions, scroll-triggered */}
          <div className="space-y-0">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.word}
                className="border-t border-[#FAFAF8]/10 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-12 items-end group"
              >
                <div className="overflow-hidden">
                  <motion.h2
                    {...scrollSlideLeft(i * 0.06)}
                    className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-[#FAFAF8]/90 group-hover:text-[#E84B2B] transition-colors duration-300"
                  >
                    {feature.word}
                  </motion.h2>
                </div>
                <motion.p
                  {...scrollFadeUp(i * 0.06 + 0.15)}
                  className="text-sm sm:text-base text-[#FAFAF8]/50 leading-relaxed max-w-md pb-1"
                >
                  {feature.desc}
                </motion.p>
              </div>
            ))}
            <div className="border-t border-[#FAFAF8]/10" />
          </div>
        </div>
      </section>

      {/* ─── How It Works: Color Block Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {/* Connect — navy */}
        <motion.div
          {...scrollBlockReveal(0)}
          className="bg-[#1A1F5C] text-[#FAFAF8] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh]"
        >
          <motion.div
            {...scrollFadeUp(0.1)}
            className="text-xs uppercase tracking-[0.2em] text-[#FAFAF8]/40 font-[family-name:var(--font-display)]"
          >
            Step 01
          </motion.div>
          <div className="mt-auto">
            <div className="overflow-hidden">
              <motion.h3
                {...scrollSlideLeft(0.15)}
                className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase mb-6"
              >
                Connect
              </motion.h3>
            </div>
            <motion.p
              {...scrollFadeUp(0.25)}
              className="text-sm text-[#FAFAF8]/60 leading-relaxed max-w-xs"
            >
              Upload your resume PDF, paste your GitHub username, and fill in your LinkedIn profile details.
            </motion.p>
          </div>
        </motion.div>

        {/* Analyze — cream */}
        <motion.div
          {...scrollBlockReveal(0.12)}
          className="bg-[#F5DDD5] text-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh]"
        >
          <motion.div
            {...scrollFadeUp(0.22)}
            className="text-xs uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-[family-name:var(--font-display)]"
          >
            Step 02
          </motion.div>
          <div className="mt-auto">
            <div className="overflow-hidden">
              <motion.h3
                {...scrollSlideLeft(0.27)}
                className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase mb-6"
              >
                Analyze
              </motion.h3>
            </div>
            <motion.p
              {...scrollFadeUp(0.37)}
              className="text-sm text-[#0A0A0A]/60 leading-relaxed max-w-xs"
            >
              AI evaluates ATS keyword matching, repository quality, profile optimization, and skill alignment against your target role.
            </motion.p>
          </div>
        </motion.div>

        {/* Improve — yellow */}
        <motion.div
          {...scrollBlockReveal(0.24)}
          className="bg-[#F2C94C] text-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh]"
        >
          <motion.div
            {...scrollFadeUp(0.34)}
            className="text-xs uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-[family-name:var(--font-display)]"
          >
            Step 03
          </motion.div>
          <div className="mt-auto">
            <div className="overflow-hidden">
              <motion.h3
                {...scrollSlideLeft(0.39)}
                className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase mb-6"
              >
                Improve
              </motion.h3>
            </div>
            <motion.p
              {...scrollFadeUp(0.49)}
              className="text-sm text-[#0A0A0A]/60 leading-relaxed max-w-xs"
            >
              Get your readiness score, rewritten bullet points, skill gap roadmap, and mock interview questions — all personalized.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ─── CTA: Split Block ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — red, massive question */}
        <motion.div
          {...scrollBlockReveal(0)}
          className="bg-[#E84B2B] text-[#0A0A0A] p-8 sm:p-14 flex flex-col justify-end min-h-[45vh]"
        >
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%", rotate: 2 }}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE_REVEAL }}
              className="font-[family-name:var(--font-display)] text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.82] tracking-[-0.05em] uppercase"
            >
              Ready?
            </motion.h2>
          </div>
        </motion.div>

        {/* Right — black, CTA copy */}
        <motion.div
          {...scrollBlockReveal(0.1)}
          className="bg-[#0A0A0A] text-[#FAFAF8] p-8 sm:p-14 flex flex-col justify-end min-h-[45vh]"
        >
          <motion.p
            {...scrollFadeUp(0.2)}
            className="text-lg sm:text-xl text-[#FAFAF8]/70 leading-relaxed max-w-sm mb-8"
          >
            Create your account. Upload your resume. Get your honest assessment in minutes — not marketing promises.
          </motion.p>
          <motion.div {...scrollFadeUp(0.35)}>
            <Link
              href="/signup"
              className="inline-flex items-center self-start bg-[#FAFAF8] text-[#0A0A0A] px-8 py-4 text-sm font-bold tracking-wide uppercase hover:bg-[#FAFAF8]/90 transition-colors font-[family-name:var(--font-display)] group"
            >
              <span>Get Started</span>
              <motion.span
                className="inline-block ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#0A0A0A] text-[#FAFAF8]/40 px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#FAFAF8]/8">
        <span className="flex items-center gap-2 text-xs font-[family-name:var(--font-display)]">
          <Logo size={18} />
          persona
        </span>
        <span className="text-xs">
          © {new Date().getFullYear()} Persona. Built for software engineers.
        </span>
      </footer>
    </div>
  );
}
