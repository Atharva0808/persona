"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, MessageSquare } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { Logo } from "@/components/ui/logo";

const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

// Clip-reveal: text slides up from behind a mask
const slideUp = (delay = 0) => ({
  initial: { y: "100%", opacity: 0 },
  animate: { y: "0%", opacity: 1 },
  transition: { duration: 0.8, delay, ease: EASE_REVEAL },
});

// Fade in with slight upward drift
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE_REVEAL },
});

// Scroll-triggered fade up
const scrollFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: EASE_REVEAL },
});

// Stagger container
const staggerContainer = (staggerDelay = 0.08) => ({
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
    word: "Resume ATS",
    icon: FileText,
    desc: "Upload your PDF resume. Get ATS compatibility scoring, weak bullet detection, and XYZ-formula quantified action rewrites.",
  },
  {
    word: "GitHub Depth",
    icon: Github,
    desc: "Analyze your profile and codebases. Commit frequency, README architecture depth, and technical quality are evaluated.",
  },
  {
    word: "LinkedIn Rank",
    icon: Linkedin,
    desc: "Audit your public profile or exported PDF. Headline keyword optimization and recruiter search rank recommendations.",
  },
  {
    word: "Skill Gap",
    icon: Target,
    desc: "Benchmark your current competencies against target roles to generate a prioritized 4-phase learning roadmap.",
  },
  {
    word: "Mock Interview",
    icon: MessageSquare,
    desc: "Get 20 tailored mock questions generated from your actual background with real-time feedback and model answers.",
  },
];

const HERO_WORDS = ["Know", "where", "you", "stand"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F4] text-[#111827] font-sans overflow-x-hidden selection:bg-[#113D2B]/15 selection:text-[#113D2B]">
      {/* ─── Floating Rectangular Navbar ─── */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between bg-white/95 backdrop-blur-md border border-[#E5EBE5] rounded-2xl shadow-2xs"
        >
          <Link href="/" className="flex items-center gap-3">
            <Logo size={32} />
            <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-display)] text-[#111827]">
              persona
            </span>
          </Link>
          <div className="flex items-center gap-5 text-xs font-bold">
            <Link
              href="/login"
              className="text-[#6B7280] hover:text-[#111827] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#113D2B] text-white px-5 py-2.5 rounded-xl hover:bg-[#0D3122] transition-colors shadow-2xs cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </motion.nav>
      </header>

      {/* ─── Hero: 3 Separated Rounded-3xl Cards Grid ─── */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[68vh]">
          {/* Card 1 — Deep Forest Pine, Massive Staggered Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#113D2B] text-white p-8 sm:p-12 rounded-3xl flex flex-col justify-end relative overflow-hidden shadow-sm"
          >
            <motion.h1
              {...staggerContainer(0.08)}
              className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,9.5vw,7.5rem)] font-bold leading-[0.88] tracking-[-0.04em] uppercase text-white"
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

          {/* Card 2 — Crisp White, Clean Separated Card */}
          <motion.div
            {...fadeUp(0.2)}
            className="bg-white border border-[#E5EBE5] text-[#111827] p-8 sm:p-12 rounded-3xl flex flex-col justify-end shadow-2xs"
          >
            <div className="mt-auto">
              <motion.p
                {...fadeUp(0.3)}
                className="text-xl sm:text-2xl font-bold leading-snug text-[#111827]"
              >
                Persona evaluates your resume, GitHub, LinkedIn profile, and technical skills — then tells you exactly what to fix.
              </motion.p>
              <motion.p
                {...fadeUp(0.4)}
                className="text-xs sm:text-sm text-[#6B7280] mt-4 leading-relaxed"
              >
                No vanity metrics. No inflated scores. Just an honest assessment and an actionable engineering roadmap.
              </motion.p>
            </div>
          </motion.div>

          {/* Card 3 — Warm Golden Butter Yellow, Serif Display + CTA Button */}
          <motion.div
            {...fadeUp(0.3)}
            className="bg-[#F2C94C] text-[#111827] p-8 sm:p-12 rounded-3xl flex flex-col justify-end shadow-sm"
          >
            <div className="mt-auto">
              <div className="overflow-hidden">
                <motion.p
                  {...slideUp(0.4)}
                  className="font-serif italic text-[clamp(3.5rem,7vw,5.5rem)] leading-[0.95] text-[#111827] tracking-tight"
                >
                  before
                  <br />
                  you apply.
                </motion.p>
              </div>
              <motion.div {...fadeUp(0.5)} className="pt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-[#113D2B] text-white px-6 py-3.5 rounded-xl text-xs font-bold hover:bg-[#0D3122] transition-colors shadow-sm cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── What Persona Does: Feature Cards Stack ─── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Five pillars of candidate readiness
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.word}
                {...scrollFadeUp(i * 0.08)}
                className="rounded-3xl bg-white border border-[#E5EBE5] p-8 flex flex-col justify-between shadow-2xs space-y-4 hover:border-[#113D2B]/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#EAF5EE] flex items-center justify-center text-[#113D2B]">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">
                    {feature.word}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Final Highlight Card */}
            <motion.div
              {...scrollFadeUp(0.4)}
              className="rounded-3xl bg-[#113D2B] text-white p-8 flex flex-col justify-between shadow-sm space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-white">
                  Honest Readiness Score
                </h3>
                <p className="text-xs text-white/80 mt-2 leading-relaxed">
                  Calculated from your genuine code, resume ATS parse, and live interview responses. No fake scores.
                </p>
              </div>
              <div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-white text-[#113D2B] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#F4F7F4] transition-colors"
                >
                  <span>Start Evaluation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works: 3 Step Cards ─── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white border-y border-[#E5EBE5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Three steps to complete clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-3xl bg-[#FAFBF9] border border-[#E5EBE5] p-8 space-y-4">
              <span className="text-xs font-bold text-[#113D2B] font-mono">
                01.
              </span>
              <h3 className="text-xl font-bold text-[#111827] pt-1">
                Connect Signals
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Upload your resume PDF, paste your public GitHub handle, and provide your LinkedIn profile details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl bg-[#FAFBF9] border border-[#E5EBE5] p-8 space-y-4">
              <span className="text-xs font-bold text-[#113D2B] font-mono">
                02.
              </span>
              <h3 className="text-xl font-bold text-[#111827] pt-1">
                Deep Audit
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Gemini 2.5 Flash analyzes ATS keyword matching, repository commit depth, and skill gaps across 9 engineering tracks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl bg-[#FAFBF9] border border-[#E5EBE5] p-8 space-y-4">
              <span className="text-xs font-bold text-[#113D2B] font-mono">
                03.
              </span>
              <h3 className="text-xl font-bold text-[#111827] pt-1">
                Action Roadmap
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Get your rewritten bullet points, phased learning roadmap, and practice 20 tailored mock questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Banner ─── */}
      <section className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#113D2B] text-white p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-[family-name:var(--font-display)]">
              Ready to benchmark your profile?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Create your account. Upload your resume. Get your honest assessment in minutes.
            </p>
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-[#113D2B] px-7 py-3.5 rounded-xl text-xs font-bold hover:bg-[#F4F7F4] transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-white text-[#6B7280] px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5EBE5]">
        <span className="flex items-center gap-2.5 text-xs font-bold text-[#111827] font-[family-name:var(--font-display)]">
          <Logo size={22} />
          persona
        </span>
        <span className="text-xs">
          © {new Date().getFullYear()} Persona. Built for software engineers.
        </span>
      </footer>
    </div>
  );
}
