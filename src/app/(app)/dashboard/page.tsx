"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  FileText,
  Target,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

interface EngineItem {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  scoreKey: "resume" | "github" | "linkedin" | "skills" | null;
}

const engines: EngineItem[] = [
  {
    id: "resume",
    name: "Resume ATS Audit",
    description: "PDF parsing, ATS keyword matching, action verbs, and bullet rewrites",
    href: "/resume",
    icon: FileText,
    scoreKey: "resume",
  },
  {
    id: "github",
    name: "GitHub Repository Audit",
    description: "Commit activity stream, README documentation quality, and repo depth",
    href: "/github",
    icon: Github,
    scoreKey: "github",
  },
  {
    id: "linkedin",
    name: "LinkedIn Profile Review",
    description: "Headline optimization, recruiter search rank, and skill keyword density",
    href: "/linkedin",
    icon: Linkedin,
    scoreKey: "linkedin",
  },
  {
    id: "skills",
    name: "Skill Gap Analysis",
    description: "Technical stack alignment across 9 engineering tracks & 4-phase roadmap",
    href: "/skills",
    icon: Target,
    scoreKey: "skills",
  },
  {
    id: "interview",
    name: "AI Technical Mock Prep",
    description: "20 tailored mock questions spanning System Design, HR, and Technical domains",
    href: "/interview",
    icon: MessageSquare,
    scoreKey: null,
  },
];

export default function DashboardPage() {
  const [scores, setScores] = useState<{
    resume: number | null;
    github: number | null;
    linkedin: number | null;
    skills: number | null;
  }>({
    resume: null,
    github: null,
    linkedin: null,
    skills: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const [resumeRes, githubRes, linkedinRes, skillsRes] = await Promise.all([
        supabase
          .from("resume_analyses")
          .select("ats_score")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
        supabase
          .from("github_analyses")
          .select("score")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
        supabase
          .from("linkedin_analyses")
          .select("score")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
        supabase
          .from("skill_gap_analyses")
          .select("match_percentage")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      setScores({
        resume: resumeRes.data?.[0]?.ats_score ?? null,
        github: githubRes.data?.[0]?.score ?? null,
        linkedin: linkedinRes.data?.[0]?.score ?? null,
        skills: skillsRes.data?.[0]?.match_percentage ?? null,
      });
      setLoading(false);
    }
    fetchScores();
  }, []);

  const completedScores = Object.values(scores).filter(
    (s): s is number => s !== null
  );
  const completedCount = completedScores.length;
  const totalScore =
    completedCount > 0
      ? Math.round(
          completedScores.reduce((acc, curr) => acc + curr, 0) / completedCount
        )
      : null;

  // Contextual Next Recommended Step based on real user progress
  const getNextAction = () => {
    if (scores.resume === null) {
      return {
        title: "Resume ATS Audit",
        desc: "Upload your resume PDF to scan ATS keyword match and get bullet rewrites.",
        href: "/resume",
        cta: "Upload Resume",
      };
    }
    if (scores.github === null) {
      return {
        title: "GitHub Profile Audit",
        desc: "Scan repository documentation, commit frequency, and technical depth.",
        href: "/github",
        cta: "Scan GitHub",
      };
    }
    if (scores.linkedin === null) {
      return {
        title: "LinkedIn Inbound Review",
        desc: "Optimize your headline keywords and recruiter attractiveness score.",
        href: "/linkedin",
        cta: "Review LinkedIn",
      };
    }
    if (scores.skills === null) {
      return {
        title: "Skill Gap Benchmark",
        desc: "Compare your skills against target roles to generate a phased roadmap.",
        href: "/skills",
        cta: "Run Skill Gap",
      };
    }
    return {
      title: "AI Technical Mock Practice",
      desc: "All 4 assessments completed! Practice your 20 tailored mock questions.",
      href: "/interview",
      cta: "Start Mock Interview",
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-7 pb-10 text-[#111827]">
      {/* ─── Page Title Header (Donezo Style) ─── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-1">
          Candidate interview readiness overview and assessment engines.
        </p>
      </div>

      {/* ─── Top 4 Metric Cards Grid (Donezo Style) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Featured Forest Pine Accent Card */}
        <div className="rounded-3xl bg-[#113D2B] text-white p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80 font-medium">
              Overall Readiness
            </span>
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold font-mono">
              {completedCount}/4
            </span>
          </div>
          <div className="my-4">
            <div className="text-4xl font-bold tracking-tight font-[family-name:var(--font-display)]">
              {loading ? "—" : totalScore !== null ? `${totalScore}%` : "Not ready"}
            </div>
          </div>
          <div className="text-[11px] text-white/80">
            {completedCount === 4
              ? "All 4 assessments completed"
              : `${completedCount} of 4 engines evaluated`}
          </div>
        </div>

        {/* Card 2: ATS Resume Score */}
        <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] font-medium">
              Resume ATS Score
            </span>
            <Link
              href="/resume"
              className="w-7 h-7 rounded-full border border-[#E5EBE5] hover:bg-[#F4F7F4] flex items-center justify-center text-[#111827] transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="my-4">
            <div className="text-4xl font-bold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
              {scores.resume !== null ? `${scores.resume}%` : "—"}
            </div>
          </div>
          <div className="text-[11px] text-[#6B7280]">
            {scores.resume !== null ? "ATS Optimized" : "Not yet analyzed"}
          </div>
        </div>

        {/* Card 3: GitHub Depth */}
        <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] font-medium">
              GitHub Repository Score
            </span>
            <Link
              href="/github"
              className="w-7 h-7 rounded-full border border-[#E5EBE5] hover:bg-[#F4F7F4] flex items-center justify-center text-[#111827] transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="my-4">
            <div className="text-4xl font-bold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
              {scores.github !== null ? `${scores.github}%` : "—"}
            </div>
          </div>
          <div className="text-[11px] text-[#6B7280]">
            {scores.github !== null ? "Repo Depth Evaluated" : "Not yet analyzed"}
          </div>
        </div>

        {/* Card 4: Skill Gap Alignment */}
        <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] font-medium">
              Skill Alignment
            </span>
            <Link
              href="/skills"
              className="w-7 h-7 rounded-full border border-[#E5EBE5] hover:bg-[#F4F7F4] flex items-center justify-center text-[#111827] transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="my-4">
            <div className="text-4xl font-bold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
              {scores.skills !== null ? `${scores.skills}%` : "—"}
            </div>
          </div>
          <div className="text-[11px] text-[#6B7280]">
            {scores.skills !== null ? "Role Track Matched" : "Not yet analyzed"}
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ═══ Left Column (Span 7): Analysis Engines Workspace ═══ */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  Analysis Engines
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Core evaluation tools across your engineering footprint
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-3 py-1 rounded-full">
                {completedCount} / 4 Complete
              </span>
            </div>

            <div className="divide-y divide-[#F0F4F0] pt-2">
              {engines.map((engine) => {
                const score = engine.scoreKey ? scores[engine.scoreKey] : null;
                const isDone = score !== null;

                return (
                  <Link
                    key={engine.id}
                    href={engine.href}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-2 hover:bg-[#F4F7F4] rounded-2xl transition-all group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-[#F4F7F4] border border-[#E5EBE5] flex items-center justify-center text-[#113D2B] group-hover:bg-[#EAF5EE] group-hover:border-[#113D2B]/30 transition-colors shrink-0 mt-0.5">
                        <engine.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#111827] group-hover:text-[#113D2B] transition-colors">
                            {engine.name}
                          </span>
                          {engine.scoreKey === null && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#113D2B] text-white">
                              20 Qs
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] leading-relaxed mt-0.5">
                          {engine.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                      <div className="text-right">
                        {loading ? (
                          <span className="text-xs text-[#9CA3AF] font-mono">
                            Loading...
                          </span>
                        ) : isDone ? (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF5EE] text-[#113D2B]">
                            Score: {score}%
                          </span>
                        ) : engine.scoreKey ? (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F4F7F4] text-[#6B7280] border border-[#E5EBE5]">
                            Not Analyzed
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF5EE] text-[#113D2B]">
                            Ready
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#113D2B] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ Right Column (Span 5): Next Action Card + Readiness Semi-Donut Gauge ═══ */}
        <div className="lg:col-span-5 space-y-5">
          {/* Next Priority Step Card */}
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between text-xs text-[#6B7280] font-medium">
              <span>Next Recommended Action</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAF5EE] text-[#113D2B] font-bold text-[10px]">
                Priority
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                {nextAction.title}
              </h3>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                {nextAction.desc}
              </p>
            </div>

            <Link
              href={nextAction.href}
              className="w-full mt-2 py-3 rounded-full bg-[#113D2B] hover:bg-[#0D3122] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>{nextAction.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Progress Semi-Donut Chart */}
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#111827]">
              Readiness Breakdown
            </h3>

            {/* SVG Semi Donut Gauge */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative w-48 h-28 flex items-end justify-center">
                <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible">
                  {/* Track Background */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#E5EBE5"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                  {/* Active Progress Arc */}
                  {totalScore !== null && totalScore > 0 && (
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#113D2B"
                      strokeWidth="11"
                      strokeLinecap="round"
                      strokeDasharray="125.6"
                      strokeDashoffset={125.6 - (totalScore / 100) * 125.6}
                    />
                  )}
                </svg>
                {/* Center Percentage Display */}
                <div className="absolute bottom-0 flex flex-col items-center">
                  <span className="text-3xl font-bold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
                    {loading ? "—" : totalScore !== null ? `${totalScore}%` : "0%"}
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-medium">
                    {completedCount === 4 ? "Ready to Apply" : "In Progress"}
                  </span>
                </div>
              </div>

              {/* Engine Status Grid */}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-6 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F4F7F4] border border-[#E5EBE5] flex items-center justify-between">
                  <span className="text-[#6B7280] text-[11px]">Resume ATS</span>
                  <span className="font-bold text-[#111827] font-mono">
                    {scores.resume !== null ? `${scores.resume}%` : "—"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4F7F4] border border-[#E5EBE5] flex items-center justify-between">
                  <span className="text-[#6B7280] text-[11px]">GitHub Depth</span>
                  <span className="font-bold text-[#111827] font-mono">
                    {scores.github !== null ? `${scores.github}%` : "—"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4F7F4] border border-[#E5EBE5] flex items-center justify-between">
                  <span className="text-[#6B7280] text-[11px]">LinkedIn Rank</span>
                  <span className="font-bold text-[#111827] font-mono">
                    {scores.linkedin !== null ? `${scores.linkedin}%` : "—"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4F7F4] border border-[#E5EBE5] flex items-center justify-between">
                  <span className="text-[#6B7280] text-[11px]">Skill Alignment</span>
                  <span className="font-bold text-[#111827] font-mono">
                    {scores.skills !== null ? `${scores.skills}%` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
