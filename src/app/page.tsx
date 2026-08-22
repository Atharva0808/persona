import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0A0A0A] font-sans overflow-x-hidden selection:bg-[#E84B2B]/20 selection:text-[#E84B2B]">
      {/* ─── Navigation ─── */}
      <nav className="w-full px-6 sm:px-10 py-5 flex items-center justify-between bg-[#0A0A0A] text-[#FAFAF8]">
        <Link href="/" className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)]">
          persona
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
      </nav>

      {/* ─── Hero: Color Block Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 min-h-[80vh] md:min-h-[85vh]">
        {/* Left block — warm red, massive type */}
        <div className="bg-[#E84B2B] text-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-end relative overflow-hidden min-h-[50vh] md:min-h-0">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,12vw,9rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase">
            Know
            <br />
            where
            <br />
            you
            <br />
            stand
          </h1>
        </div>

        {/* Center block — black, value proposition */}
        <div className="bg-[#0A0A0A] text-[#FAFAF8] p-8 sm:p-12 flex flex-col justify-between min-h-[40vh] md:min-h-0">
          <div className="text-xs uppercase tracking-[0.2em] text-[#FAFAF8]/40 font-[family-name:var(--font-display)]">
            Interview Readiness Tool
          </div>
          <div className="mt-auto">
            <p className="text-lg sm:text-xl leading-relaxed text-[#FAFAF8]/80 max-w-sm">
              Persona evaluates your resume, GitHub, LinkedIn profile, and technical skills — then tells you
              exactly what to fix.
            </p>
            <p className="text-sm text-[#FAFAF8]/40 mt-6 leading-relaxed max-w-xs">
              No vanity metrics. No inflated scores.
              <br />
              Just an honest assessment and a roadmap.
            </p>
          </div>
        </div>

        {/* Right block — green, serif accent + CTA */}
        <div className="bg-[#0D6B4F] text-[#FAFAF8] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh] md:min-h-0">
          <div className="text-xs uppercase tracking-[0.2em] text-[#FAFAF8]/50 font-[family-name:var(--font-display)]">
            For Software Engineers
          </div>
          <div className="mt-auto">
            <p className="font-serif italic text-[clamp(2.5rem,6vw,5rem)] leading-[1] text-[#FAFAF8]/95 tracking-[-0.01em]">
              before
              <br />
              you apply.
            </p>
            <Link
              href="/signup"
              className="inline-block mt-8 text-sm font-semibold text-[#FAFAF8] border-b-2 border-[#FAFAF8]/60 pb-1 hover:border-[#FAFAF8] transition-colors font-[family-name:var(--font-display)]"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── What It Does: Typography Feature Stack ─── */}
      <section className="bg-[#0A0A0A] text-[#FAFAF8] py-20 sm:py-28 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs uppercase tracking-[0.25em] text-[#FAFAF8]/30 mb-16 font-[family-name:var(--font-display)]">
            What Persona Does
          </div>

          {/* Feature list — massive type with descriptions */}
          <div className="space-y-0">
            {[
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
            ].map((feature, i) => (
              <div
                key={feature.word}
                className="border-t border-[#FAFAF8]/10 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-12 items-end group"
              >
                <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-[#FAFAF8]/90 group-hover:text-[#E84B2B] transition-colors duration-300">
                  {feature.word}
                </h2>
                <p className="text-sm sm:text-base text-[#FAFAF8]/50 leading-relaxed max-w-md pb-1">
                  {feature.desc}
                </p>
              </div>
            ))}
            <div className="border-t border-[#FAFAF8]/10" />
          </div>
        </div>
      </section>

      {/* ─── How It Works: Color Block Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {/* Connect — navy */}
        <div className="bg-[#1A1F5C] text-[#FAFAF8] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh]">
          <div className="text-xs uppercase tracking-[0.2em] text-[#FAFAF8]/40 font-[family-name:var(--font-display)]">
            Step 01
          </div>
          <div className="mt-auto">
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase mb-6">
              Connect
            </h3>
            <p className="text-sm text-[#FAFAF8]/60 leading-relaxed max-w-xs">
              Upload your resume PDF, paste your GitHub username, and fill in your LinkedIn profile details.
            </p>
          </div>
        </div>

        {/* Analyze — cream */}
        <div className="bg-[#F5DDD5] text-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh]">
          <div className="text-xs uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-[family-name:var(--font-display)]">
            Step 02
          </div>
          <div className="mt-auto">
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase mb-6">
              Analyze
            </h3>
            <p className="text-sm text-[#0A0A0A]/60 leading-relaxed max-w-xs">
              AI evaluates ATS keyword matching, repository quality, profile optimization, and skill alignment against your target role.
            </p>
          </div>
        </div>

        {/* Improve — yellow */}
        <div className="bg-[#F2C94C] text-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-between min-h-[50vh]">
          <div className="text-xs uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-[family-name:var(--font-display)]">
            Step 03
          </div>
          <div className="mt-auto">
            <h3 className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase mb-6">
              Improve
            </h3>
            <p className="text-sm text-[#0A0A0A]/60 leading-relaxed max-w-xs">
              Get your readiness score, rewritten bullet points, skill gap roadmap, and mock interview questions — all personalized.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA: Split Block ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — red, massive question */}
        <div className="bg-[#E84B2B] text-[#0A0A0A] p-8 sm:p-14 flex flex-col justify-end min-h-[45vh]">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.82] tracking-[-0.05em] uppercase">
            Ready?
          </h2>
        </div>

        {/* Right — black, CTA copy */}
        <div className="bg-[#0A0A0A] text-[#FAFAF8] p-8 sm:p-14 flex flex-col justify-end min-h-[45vh]">
          <p className="text-lg sm:text-xl text-[#FAFAF8]/70 leading-relaxed max-w-sm mb-8">
            Create your account. Upload your resume. Get your honest assessment in minutes — not marketing promises.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center self-start bg-[#FAFAF8] text-[#0A0A0A] px-8 py-4 text-sm font-bold tracking-wide uppercase hover:bg-[#FAFAF8]/90 transition-colors font-[family-name:var(--font-display)]"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#0A0A0A] text-[#FAFAF8]/40 px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#FAFAF8]/8">
        <span className="text-xs font-[family-name:var(--font-display)]">
          persona
        </span>
        <span className="text-xs">
          © {new Date().getFullYear()} Persona. Built for software engineers.
        </span>
      </footer>
    </div>
  );
}
