"use client";

import React from "react";
import {
  FileText,
  Target,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

export function FeatureBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Resume Analysis (Wide 2-col) */}
      <div className="md:col-span-2 rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-100">
                  ATS Resume Analysis
                </h3>
                <span className="text-xs text-neutral-500 font-mono">PDF Text & Action Verb Engine</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30 bg-amber-500/10">
              Deep Audit
            </Badge>
          </div>

          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            Extracts raw resume text, pinpoints weak bullets, checks ATS keyword coverage against target positions, and suggests quantified, high-impact replacements.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-4 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between text-neutral-300">
            <span>ATS Compatibility Target</span>
            <span className="text-amber-400 font-bold">92%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full w-[92%]" />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-neutral-400 font-sans">
            <span className="text-emerald-400 font-medium flex items-center gap-1">✓ Quantified Achievements</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">✓ Action Verbs</span>
            <span className="text-amber-400 font-medium flex items-center gap-1">! 2 Keyword Gaps</span>
          </div>
        </div>
      </div>

      {/* 2. GitHub Analysis (1-col) */}
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-100">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                GitHub Deep Audit
              </h3>
              <span className="text-xs text-neutral-500 font-mono">Repo & Commit Intelligence</span>
            </div>
          </div>

          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            Evaluates commit consistency, repository README quality, star counts, and technical depth.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Commit Frequency</span>
            <span className="text-emerald-400 font-semibold">Active Streak</span>
          </div>
          <div className="flex gap-1.5 py-1">
            {[40, 75, 90, 60, 100, 85, 95, 70, 100, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-neutral-800 h-8 rounded-md flex items-end overflow-hidden">
                <div className="w-full bg-amber-400/80" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            README Rating: <span className="text-amber-300 font-semibold">Excellent</span>
          </div>
        </div>
      </div>

      {/* 3. Skill Gap Analysis (1-col) */}
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Skill Gap & Roadmap
              </h3>
              <span className="text-xs text-neutral-500 font-mono">Role Alignment Matrix</span>
            </div>
          </div>

          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            Maps your skill set against 9 engineering tracks to deliver a 4-phase learning roadmap.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Target Role</span>
            <span className="text-emerald-400 font-bold">AI / Fullstack</span>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-neutral-200">
              <span>Phase 1: Distributed Caching</span>
              <span className="text-amber-400 font-mono">Priority</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Phase 2: Message Queues</span>
              <span className="text-emerald-400 font-mono">Next</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LinkedIn Review (1-col) */}
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                LinkedIn Magnet
              </h3>
              <span className="text-xs text-neutral-500 font-mono">Recruiter Search Rank</span>
            </div>
          </div>

          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            Optimize your headline, experience summaries, and skill tags for inbound recruiter messages.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Recruiter Attractiveness</span>
            <span className="text-sky-400 font-mono font-bold">Top 8%</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            "Headline contains 4 key engineering keywords matched by technical recruiters."
          </p>
        </div>
      </div>

      {/* 5. AI Interview Prep (1-col) */}
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                AI Interview Prep
              </h3>
              <span className="text-xs text-neutral-500 font-mono">20 Tailored Questions</span>
            </div>
          </div>

          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            Generates 20 mock interview questions personalized to your actual projects, resume, and target role.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-amber-400 font-medium">System Design</span>
            <span className="text-neutral-500">Medium</span>
          </div>
          <p className="text-[11px] text-neutral-300 font-sans">
            "How would you architect a distributed rate limiter for high-throughput API endpoints?"
          </p>
        </div>
      </div>
    </div>
  );
}
