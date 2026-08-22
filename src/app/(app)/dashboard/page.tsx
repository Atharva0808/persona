"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Target,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

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

  // Live Practice Stopwatch State
  const [seconds, setSeconds] = useState(1122); // 18m 42s default
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

  const completedCount = Object.values(scores).filter((s) => s !== null).length;
  const rawScore =
    ((scores.resume || 92) +
      (scores.github || 84) +
      (scores.linkedin || 88) +
      (scores.skills || 82)) /
    4;
  const overallReadiness = Math.round(rawScore);

  return (
    <div className="space-y-7 pb-10 text-[#111827]">
      {/* ─── Page Title & Action Header (Donezo Style) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-1">
            Plan, prioritize, and benchmark your engineering interview readiness with ease.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#113D2B] hover:bg-[#0D3122] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F0F5F0] border border-[#113D2B] text-[#113D2B] text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Practice Mock
          </Link>
        </div>
      </div>

      {/* ─── Top 4 Metric Cards Grid (Donezo Style) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Featured Forest Pine Accent Card */}
        <div className="rounded-3xl bg-[#113D2B] text-white p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80 font-medium">
              Overall Readiness
            </span>
            <Link
              href="/dashboard"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="my-4">
            <div className="text-4xl font-bold tracking-tight font-[family-name:var(--font-display)]">
              {loading ? "—" : `${overallReadiness}%`}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <span className="px-1.5 py-0.5 rounded-md bg-[#22C55E]/30 text-[#4ADE80] font-bold text-[10px]">
              +6%
            </span>
            <span>Top candidate benchmark</span>
          </div>
        </div>

        {/* Card 2: ATS Resume Score */}
        <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] font-medium">
              ATS Resume Score
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
              {scores.resume !== null ? scores.resume : 92}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#059669]">
            <span className="px-1.5 py-0.5 rounded-md bg-[#EAF5EE] text-[#113D2B] font-bold text-[10px]">
              ATS
            </span>
            <span className="text-[#6B7280]">100% Parsed • Optimized</span>
          </div>
        </div>

        {/* Card 3: GitHub Depth */}
        <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] font-medium">
              GitHub Quality
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
              {scores.github !== null ? scores.github : 84}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#059669]">
            <span className="px-1.5 py-0.5 rounded-md bg-[#EAF5EE] text-[#113D2B] font-bold text-[10px]">
              Repo
            </span>
            <span className="text-[#6B7280]">Active Commit Stream</span>
          </div>
        </div>

        {/* Card 4: Skill Gap Track */}
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
              {scores.skills !== null ? `${scores.skills}%` : "82%"}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
            <span className="px-1.5 py-0.5 rounded-md bg-[#EAF5EE] text-[#113D2B] font-bold text-[10px]">
              Role
            </span>
            <span className="truncate">Fullstack Senior Track</span>
          </div>
        </div>
      </div>

      {/* ─── Main 3-Column Content Layout (Donezo Style) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ═══ COLUMN 1 (Span 4): Analytics Stadium Pill Chart + Vectors List ═══ */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card A: Readiness Analytics Stadium Capsule Bar Chart */}
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827]">
                Readiness Analytics
              </h3>
              <span className="text-[11px] text-[#6B7280] font-medium">
                Weekly Trajectory
              </span>
            </div>

            {/* Stadium Capsule Chart */}
            <div className="pt-3 pb-1 flex items-end justify-between gap-2.5 h-44">
              {[
                { day: "S", height: "45%", type: "hatched" },
                { day: "M", height: "70%", type: "solid-dark" },
                { day: "T", height: "86%", type: "mint-active", label: "86%" },
                { day: "W", height: "92%", type: "solid-dark" },
                { day: "T", height: "60%", type: "hatched" },
                { day: "F", height: "50%", type: "hatched" },
                { day: "S", height: "75%", type: "hatched" },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex flex-col items-center justify-end h-full relative">
                    {/* Active tooltip badge */}
                    {bar.label && (
                      <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-[#113D2B] text-white text-[10px] font-bold font-mono shadow-sm">
                        {bar.label}
                      </div>
                    )}
                    {/* Capsule bar shape */}
                    <div
                      className="w-full rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ height: bar.height }}
                    >
                      {bar.type === "hatched" && (
                        <div
                          className="w-full h-full border-2 border-[#D1DCD1] rounded-full"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(45deg, #E2ECE2 0, #E2ECE2 2px, transparent 0, transparent 6px)",
                          }}
                        />
                      )}
                      {bar.type === "solid-dark" && (
                        <div className="w-full h-full bg-[#113D2B] rounded-full" />
                      )}
                      {bar.type === "mint-active" && (
                        <div className="w-full h-full bg-[#22C55E] rounded-full shadow-sm" />
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#9CA3AF]">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card B: Evaluation Vectors Breakdown (Team Collaboration Style) */}
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827]">
                Evaluation Vectors
              </h3>
              <Link
                href="/resume"
                className="text-xs font-bold text-[#113D2B] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add File</span>
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Resume ATS Parsing",
                  sub: "PDF bullets & action verbs",
                  status: "Completed",
                  badgeColor: "bg-[#EAF5EE] text-[#113D2B]",
                  icon: FileText,
                },
                {
                  title: "GitHub Depth Audit",
                  sub: "30 repositories & commits",
                  status: "Completed",
                  badgeColor: "bg-[#EAF5EE] text-[#113D2B]",
                  icon: Github,
                },
                {
                  title: "LinkedIn Recruiter Rank",
                  sub: "Headline keyword density",
                  status: "In Progress",
                  badgeColor: "bg-[#FEF3C7] text-[#92400E]",
                  icon: Linkedin,
                },
                {
                  title: "Target Skill Gap Matrix",
                  sub: "Senior Fullstack benchmark",
                  status: "Pending",
                  badgeColor: "bg-[#FEE2E2] text-[#991B1B]",
                  icon: Target,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F4F7F4] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#F4F7F4] border border-[#E5EBE5] flex items-center justify-center text-[#113D2B] shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#111827] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#9CA3AF] truncate">
                        {item.sub}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${item.badgeColor}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ COLUMN 2 (Span 4): Next Priority Reminders + Semi-Donut Gauge ═══ */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card A: Next Priority Action Card (Reminders Style in Donezo) */}
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-4">
            <span className="text-xs text-[#6B7280] font-medium">
              Next Priority Action
            </span>
            <div>
              <h3 className="text-base font-bold text-[#111827] leading-snug">
                Mock Interview: Distributed Systems
              </h3>
              <p className="text-xs text-[#6B7280] mt-1">
                Time: 15-20 min • 5 Custom Questions
              </p>
            </div>

            <Link
              href="/interview"
              className="w-full mt-2 py-3 rounded-full bg-[#113D2B] hover:bg-[#0D3122] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Mock Session</span>
            </Link>
          </div>

          {/* Card B: Project Progress Semi-Donut Chart (Donezo Style) */}
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#111827]">
              Readiness Progress
            </h3>

            {/* SVG Semi Donut Gauge */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative w-48 h-28 flex items-end justify-center">
                <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible">
                  {/* Background Track Arc */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#E2ECE2"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                  {/* In Progress Mid Segment */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 82 25"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                  {/* Completed Segment */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 65 14"
                    fill="none"
                    stroke="#113D2B"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center Percentage Display */}
                <div className="absolute bottom-0 flex flex-col items-center">
                  <span className="text-3xl font-bold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
                    {overallReadiness}%
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-medium">
                    Ready for Apply
                  </span>
                </div>
              </div>

              {/* Legend Chips */}
              <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#113D2B]" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-[#9CA3AF] bg-[#E2ECE2]" />
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ COLUMN 3 (Span 4): Engines Workspace + Live Stopwatch Widget ═══ */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card A: Analysis Engines List (Donezo Project Tasks Style) */}
          <div className="rounded-3xl bg-white border border-[#E5EBE5] p-6 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827]">
                Engines Workspace
              </h3>
              <Link
                href="/resume"
                className="text-xs font-bold text-[#113D2B] hover:underline"
              >
                + Run All
              </Link>
            </div>

            <div className="space-y-2">
              {[
                {
                  name: "Resume ATS Audit",
                  desc: "PDF bullet point rewrites",
                  href: "/resume",
                  dot: "bg-[#22C55E]",
                },
                {
                  name: "GitHub Repository Audit",
                  desc: "Commit activity & README depth",
                  href: "/github",
                  dot: "bg-[#113D2B]",
                },
                {
                  name: "LinkedIn Profile Review",
                  desc: "Recruiter inbound keyword rank",
                  href: "/linkedin",
                  dot: "bg-[#3B82F6]",
                },
                {
                  name: "Skill Gap Roadmap",
                  desc: "Phase 1: Distributed Caching",
                  href: "/skills",
                  dot: "bg-[#F59E0B]",
                },
                {
                  name: "AI Mock Prep",
                  desc: "20 tailored technical questions",
                  href: "/interview",
                  dot: "bg-[#10B981]",
                },
              ].map((engine, idx) => (
                <Link
                  key={idx}
                  href={engine.href}
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-[#F0F4F0] hover:border-[#D1DCD1] hover:bg-[#F4F7F4] transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${engine.dot} shrink-0`} />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#111827] group-hover:text-[#113D2B] transition-colors truncate">
                        {engine.name}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] truncate">
                        {engine.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#113D2B] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Card B: Live Stopwatch / Practice Timer Widget (Donezo Time Tracker Style) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0F3827] via-[#113D2B] to-[#0A261A] text-white p-6 shadow-md relative overflow-hidden">
            {/* Background geometric curves */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border-8 border-white/5 pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full border-8 border-white/5 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="font-bold tracking-wide uppercase text-[10px]">
                  Interview Timer
                </span>
                <Clock className="w-3.5 h-3.5 text-[#4ADE80]" />
              </div>

              {/* Huge Stopwatch Numbers */}
              <div className="text-3xl font-bold font-mono tracking-wider text-center py-2 text-white">
                {formatTimer(seconds)}
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="w-10 h-10 rounded-full bg-white hover:bg-white/90 text-[#113D2B] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-sm"
                  aria-label={isRunning ? "Pause timer" : "Start timer"}
                >
                  {isRunning ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setSeconds(0);
                  }}
                  className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-sm"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
