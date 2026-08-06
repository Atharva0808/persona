"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  FileText,
  Target,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { ScoreRing } from "@/components/ui/score";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

const tools = [
  {
    icon: FileText,
    title: "ATS Resume Analysis",
    description: "Upload your PDF resume to get ATS scores, weak bullet points, and quantified rewrites.",
    href: "/resume",
    badge: "PDF Engine",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Github,
    title: "GitHub Repository Audit",
    description: "Evaluate your repositories, commit frequency, README depth, and code quality.",
    href: "/github",
    badge: "Repo Analysis",
    color: "text-amber-300",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Recruiter Rank",
    description: "Optimize headline, about section, and keywords for inbound recruiter visibility.",
    href: "/linkedin",
    badge: "Inbound Rank",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: Target,
    title: "Skill Gap & Roadmap",
    description: "Map your technical skills against 9 target roles and get a 4-phase learning roadmap.",
    href: "/skills",
    badge: "Role Alignment",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: MessageSquare,
    title: "AI Interview Prep",
    description: "Generate 20 personalized mock interview questions tailored to your actual profile.",
    href: "/interview",
    badge: "20 Questions",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

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
  const [userName, setUserName] = useState<string>("Engineer");

  useEffect(() => {
    async function fetchScores() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Engineer");

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
  const totalScore =
    ((scores.resume || 0) +
      (scores.github || 0) +
      (scores.linkedin || 0) +
      (scores.skills || 0)) /
    (completedCount || 1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <PageHeader
        title="Candidate Readiness Command Center"
        description="Comprehensive audit of your professional footprint & interview readiness."
      />

      {/* Executive Banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#0d0e15] via-[#0b0c12] to-[#07080b] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
                Candidate Profile
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300">
                Software Engineer Track
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Welcome back, {userName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Complete all four vector assessments to establish your benchmark interview readiness score and personalized career roadmap.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-slate-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {completedCount} / 4 Assessments Completed
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                {completedCount === 4
                  ? "Interview Benchmark Ready"
                  : completedCount > 0
                  ? "Audit In Progress"
                  : "Needs Initial Audit"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/[0.06] shrink-0">
            <ScoreRing
              score={Math.round(totalScore)}
              label="Readiness"
              size={120}
              strokeWidth={8}
            />
          </div>
        </div>
      </motion.div>

      {/* 4 Vector Audit Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
            Assessment Vectors
          </h2>
          <span className="text-xs font-mono text-slate-500">Live Database Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "ATS Resume",
              score: scores.resume,
              icon: FileText,
              color: "text-blue-400",
              href: "/resume",
              metricLabel: "Keyword Match",
            },
            {
              label: "GitHub Depth",
              score: scores.github,
              icon: Github,
              color: "text-amber-300",
              href: "/github",
              metricLabel: "Repo & Commit Index",
            },
            {
              label: "LinkedIn Rank",
              score: scores.linkedin,
              icon: Linkedin,
              color: "text-sky-400",
              href: "/linkedin",
              metricLabel: "Recruiter Attractiveness",
            },
            {
              label: "Skill Gap",
              score: scores.skills,
              icon: Target,
              color: "text-emerald-400",
              href: "/skills",
              metricLabel: "Target Role Match",
            },
          ].map((vector) => (
            <motion.div key={vector.label} variants={itemVariants}>
              <Link href={vector.href}>
                <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e15]/80 p-5 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1 group shadow-lg flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 group-hover:text-amber-300 transition-colors">
                        <vector.icon className="w-4 h-4" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div className="text-xs font-medium text-slate-300 mb-1">
                      {vector.label}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mb-4">
                      {vector.metricLabel}
                    </div>
                  </div>

                  <div>
                    {loading ? (
                      <div className="text-xs text-slate-600 font-mono animate-pulse">
                        Syncing...
                      </div>
                    ) : vector.score !== null ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-2xl font-bold font-mono ${vector.color}`}>
                          {Math.round(vector.score)}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">/ 100</span>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-400/90 font-mono font-medium flex items-center gap-1">
                        Run Audit <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analysis Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
            Analytical Tool Suite
          </h2>
          <span className="text-xs font-mono text-slate-500">5 Integrated Engines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={itemVariants}>
              <Link href={tool.href}>
                <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1 group shadow-lg flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl border ${tool.bgColor} ${tool.color}`}>
                        <tool.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-black/40 text-slate-400">
                        {tool.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      {tool.title}
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Est. Run Time: &lt; 1 min</span>
                    <span className="text-amber-400/90 font-medium group-hover:underline">Launch</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
