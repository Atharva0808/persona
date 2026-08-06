"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, MessageSquare } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/client";

interface ToolItem {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  scoreKey: "resume" | "github" | "linkedin" | "skills" | null;
}

const tools: ToolItem[] = [
  {
    id: "resume",
    name: "Resume ATS Audit",
    description: "PDF parsing, ATS keyword matching, action verbs, and bullet point rewrites",
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
    name: "AI Technical Interview Prep",
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

      if (!user) return;

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
    <div className="space-y-8 text-neutral-100">
      <PageHeader
        title="Dashboard"
        description="Candidate readiness overview and analytical suite."
      />

      {/* Clean Status Strip */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
            Overall Interview Readiness
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-neutral-100">
              {loading ? "—" : Math.round(totalScore)}%
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {completedCount} of 4 assessments completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs text-neutral-400 font-mono">
            <span>Progress</span>
            <span>{completedCount * 25}%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${completedCount * 25}%` }}
            />
          </div>
        </div>
      </div>

      {/* Functional Workspace Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
          <span>Analysis Engines</span>
          <span>Status</span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 divide-y divide-neutral-800/60 overflow-hidden">
          {tools.map((tool) => {
            const score = tool.scoreKey ? scores[tool.scoreKey] : null;
            return (
              <Link key={tool.id} href={tool.href} className="block group">
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-800/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <tool.icon className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 transition-colors mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">
                        {tool.name}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                        {tool.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                    <div className="text-right">
                      {loading ? (
                        <span className="text-xs text-neutral-600 font-mono">Loading...</span>
                      ) : score !== null ? (
                        <span className="text-sm font-bold font-mono text-neutral-200">
                          {Math.round(score)} / 100
                        </span>
                      ) : tool.scoreKey ? (
                        <span className="text-xs text-neutral-500 font-mono">Not analyzed</span>
                      ) : (
                        <span className="text-xs text-neutral-400 font-mono">20 Qs</span>
                      )}
                    </div>

                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
