import Link from "next/link";
import {
  FileText,
  Target,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description:
      "Upload your PDF resume and get an ATS score, weak bullet points highlighted, and actionable improvements.",
  },
  {
    icon: Github,
    title: "GitHub Analysis",
    description:
      "Analyze your repositories, commit activity, README quality, and project depth with a comprehensive score.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Review",
    description:
      "Get feedback on your headline, about section, skills, and overall recruiter attractiveness.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description:
      "Compare your current skills against target roles and get a personalized learning roadmap.",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description:
      "Generate tailored interview questions based on your resume, projects, and target role.",
  },
];



export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Floating Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 px-6">
        <div className="h-14 flex items-center justify-between px-6 bg-neutral-950/60 backdrop-blur-lg border border-neutral-800 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="text-sm font-semibold text-neutral-100 tracking-tight">
              persona
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-neutral-400 hover:text-white">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 mt-14">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold text-neutral-100 tracking-tight leading-[1.15]">
            Know exactly where you
            <br />
            stand before you apply.
          </h1>
          <p className="text-base text-neutral-500 mt-4 leading-relaxed max-w-lg">
            Persona analyzes your resume, GitHub, LinkedIn, and skills to give
            you a clear picture of your interview readiness — and a roadmap to
            improve.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <Link href="/signup">
              <Button size="lg">
                Start analyzing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-neutral-100 tracking-tight">
            Everything you need
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Five integrated tools to evaluate and improve your candidacy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 hover:bg-neutral-900 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 mb-4 group-hover:bg-neutral-700 transition-colors">
                <feature.icon className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-xl font-semibold text-neutral-100 tracking-tight">
            Ready to improve your chances?
          </h2>
          <p className="text-sm text-neutral-500 mt-2 mb-8">
            Create a free account and start analyzing in minutes.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={20} className="grayscale opacity-50" />
            <span className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Persona
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-600">
            <span>Built for builders.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
