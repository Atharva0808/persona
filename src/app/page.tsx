import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
  Lock,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Logo } from "@/components/ui/logo";
import { HeroPreview } from "@/components/landing/hero-preview";
import { FeatureBento } from "@/components/landing/feature-bento";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[140px] rounded-full" />
      </div>

      {/* Floating Header */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-5xl z-50 px-4">
        <div className="h-14 flex items-center justify-between px-5 bg-neutral-950/80 backdrop-blur-md border border-neutral-800/80 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="text-base font-bold text-neutral-100 tracking-tight font-mono">
              persona
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-neutral-400 hover:text-amber-300 hover:bg-neutral-900"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <ShimmerButton
                shimmerColor="#fbbf24"
                shimmerDuration="2.5s"
                className="h-9 px-4 py-1.5 text-xs text-amber-100 rounded-xl"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-medium">Career Intelligence & Readiness Audit</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.12]">
            Know exactly where you stand <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              before you apply.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Persona deeply analyzes your resume, GitHub repositories, LinkedIn profile, and technical skills to deliver an overall interview readiness score and an actionable roadmap to improve.
          </p>

          {/* Shimmer Button CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <ShimmerButton
                shimmerColor="#f59e0b"
                shimmerDuration="2.5s"
                borderRadius="16px"
                className="w-full sm:w-auto h-12 px-7 text-sm font-semibold text-amber-100"
              >
                Start Free Analysis
                <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
              </ShimmerButton>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-2xl border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-amber-300 h-12 px-6"
              >
                Sign in to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Product Preview Card */}
        <div className="mt-14">
          <HeroPreview />
        </div>
      </section>

      {/* Metrics / Trust Bar */}
      <section className="relative z-10 border-y border-neutral-900 bg-neutral-950/70 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">5 Engines</div>
            <div className="text-xs text-neutral-400 mt-1">Multi-Vector Assessment</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">100% ATS</div>
            <div className="text-xs text-neutral-400 mt-1">Keyword Optimization</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">20 Qs</div>
            <div className="text-xs text-neutral-400 mt-1">Personalized Interview Mock</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">9 Tracks</div>
            <div className="text-xs text-neutral-400 mt-1">Software Engineering Roles</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 font-semibold">
            Integrated Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
            Designed Specifically for Software Engineers
          </h2>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            Stop guessing why recruiters aren't responding. Persona audits your entire professional footprint and gives you actionable steps to fix weak points.
          </p>
        </div>

        <FeatureBento />
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 border-t border-neutral-900 bg-neutral-900/30 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
              Three steps to interview readiness
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              From raw resume PDF to tailored interview questions in under 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-7 relative hover:border-amber-500/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-neutral-100 mb-2">
                Connect Footprint
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Upload your PDF resume, paste your GitHub handle, and share your LinkedIn profile details.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-7 relative hover:border-amber-500/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-neutral-100 mb-2">
                AI Multi-Vector Audit
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Gemini 2.5 Flash analyzes ATS scores, repo quality, recruiter visibility, and skill gaps.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-7 relative hover:border-amber-500/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-neutral-100 mb-2">
                Execute & Practice
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Follow your phase-by-phase learning roadmap and practice tailored mock interview questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Magic UI Shimmer Button */}
      <section className="relative z-10 border-t border-neutral-900 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-10 sm:p-14 space-y-6 shadow-2xl shadow-amber-950/20">
            <h2 className="text-2xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Ready to know where you stand?
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Create your account now and get your complete interview readiness assessment in minutes.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="/signup">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.2s"
                  borderRadius="16px"
                  className="h-12 px-8 text-sm font-bold text-amber-100"
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
      <footer className="relative z-10 border-t border-neutral-900 bg-neutral-950 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={20} className="grayscale opacity-60" />
            <span className="text-xs text-neutral-500 font-mono">
              © {new Date().getFullYear()} Persona. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400/70" /> End-to-End Privacy
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400/70" /> RLS Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
