"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Award,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Logo } from "@/components/ui/logo";
import { HeroPreview } from "@/components/landing/hero-preview";
import { FeatureBento } from "@/components/landing/feature-bento";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 font-sans selection:bg-amber-500/25 selection:text-amber-200 overflow-x-hidden">
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-amber-500/[0.04] blur-[150px] rounded-full" />
      </div>

      {/* Floating Navbar */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-5xl z-50 px-4">
        <div className="h-14 flex items-center justify-between px-6 bg-[#0c0d12]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60">
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="text-base font-bold text-slate-100 tracking-tight font-mono">
              persona
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-slate-400 hover:text-amber-300 hover:bg-white/[0.05]"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <ShimmerButton
                shimmerColor="#fde68a"
                shimmerDuration="2.5s"
                className="h-9 px-4 text-xs font-semibold text-amber-100 rounded-xl"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-300" />
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/[0.06] text-xs text-amber-300"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono tracking-wide">Candidate Readiness & Intelligence</span>
          </motion.div>

          {/* Headline with Instrument Serif Italic Accent */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-100 tracking-tight leading-[1.12]"
          >
            Know exactly where you stand <br className="hidden sm:block" />
            <em className="font-serif italic font-normal text-amber-200/95 tracking-normal">
              before you apply.
            </em>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Persona evaluates your resume, GitHub repositories, LinkedIn profile, and technical skills to deliver an overall interview readiness score and an actionable roadmap to improve.
          </motion.p>

          {/* Shimmer Button Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <ShimmerButton
                shimmerColor="#f59e0b"
                shimmerDuration="2.5s"
                borderRadius="16px"
                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold text-amber-100 shadow-xl shadow-amber-950/40"
              >
                Start Free Analysis
                <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
              </ShimmerButton>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-2xl border-white/[0.08] text-slate-300 hover:bg-white/[0.04] hover:text-amber-200 h-12 px-7"
              >
                Sign in to Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Interactive Component */}
        <div className="mt-16">
          <HeroPreview />
        </div>
      </section>

      {/* Metric Proof Strip */}
      <section className="relative z-10 border-y border-white/[0.06] bg-[#090a0f]/80 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">5 Engines</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Multi-Vector Assessment</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">100% ATS</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Keyword Optimization</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">20 Qs</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Personalized Mock Interview</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">9 Tracks</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Software Track Benchmarks</div>
          </div>
        </div>
      </section>

      {/* Feature Bento Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-3 font-semibold">
            Comprehensive Assessment
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-100 tracking-tight">
            Designed Specifically for Software Engineers
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed font-normal">
            Stop guessing why recruiters aren't responding. Persona audits your entire professional footprint and delivers actionable steps to fix weak points.
          </p>
        </div>

        <FeatureBento />
      </section>

      {/* 3-Step Process Section */}
      <section className="relative z-10 border-t border-white/[0.06] bg-[#090a0f]/40 py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
              Three steps to interview readiness
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-normal">
              From raw resume PDF to tailored interview questions in under 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/70 p-8 relative hover:border-amber-400/30 transition-all duration-500">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center text-sm mb-5">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">
                Connect Footprint
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                Upload your PDF resume, paste your GitHub handle, and share your LinkedIn profile details.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/70 p-8 relative hover:border-amber-400/30 transition-all duration-500">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center text-sm mb-5">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">
                AI Multi-Vector Audit
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                Gemini 2.5 Flash evaluates ATS scores, repository depth, recruiter rank, and skill gaps.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/70 p-8 relative hover:border-amber-400/30 transition-all duration-500">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center text-sm mb-5">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">
                Execute & Practice
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                Follow your phase-by-phase learning roadmap and practice tailored mock interview questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 border-t border-white/[0.06] py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#0e0f16] to-[#07080b] p-10 sm:p-16 space-y-6 shadow-2xl shadow-black/80">
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-100 tracking-tight">
              Ready to know where you stand?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
              Create your account now and receive your complete interview readiness assessment in minutes.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="/signup">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.2s"
                  borderRadius="16px"
                  className="h-12 px-9 text-sm font-semibold text-amber-100 shadow-xl shadow-amber-950/40"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#07080b] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={20} className="grayscale opacity-50" />
            <span className="text-xs text-slate-500 font-mono">
              © {new Date().getFullYear()} Persona. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400/80" /> Privacy First
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" /> RLS Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
