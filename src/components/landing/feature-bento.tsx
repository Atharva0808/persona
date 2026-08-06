"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  FileText,
  Target,
  MessageSquare,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function FeatureBento() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* 1. Resume Analysis (Wide 2-col) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0d0e15] to-[#07080b] p-8 flex flex-col justify-between hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1 group shadow-xl"
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                  ATS Resume Parsing & Bullet Rewriter
                </h3>
                <span className="text-xs text-slate-400 font-mono">Structural Action Verb Engine</span>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full text-amber-300 border border-amber-400/20 bg-amber-400/10 font-mono">
              Vector Audit
            </span>
          </div>

          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-normal">
            Extracts raw resume text, pinpoints weak passive bullets, tests keyword density against ATS software, and recommends quantified, high-impact action statements.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/50 p-5 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-slate-300">
            <span>ATS Keyword Match Target</span>
            <span className="text-amber-300 font-bold">92%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-amber-300 h-full w-[92%]" />
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-400 font-sans">
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Quantified Impact
            </span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Action Verbs
            </span>
            <span className="text-amber-300 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
              2 Keyword Gaps
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. GitHub Analysis (1-col) */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0d0e15] to-[#07080b] p-8 flex flex-col justify-between hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1 group shadow-xl"
      >
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-100">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                GitHub Repository Depth
              </h3>
              <span className="text-xs text-slate-400 font-mono">Repo Audit Engine</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-normal">
            Evaluates commit consistency, repository README depth, architectural docs, stars, and code activity.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/50 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Commit Consistency</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
          <div className="flex gap-1.5 py-1">
            {[40, 75, 90, 60, 100, 85, 95, 70, 100, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-white/10 h-8 rounded-md flex items-end overflow-hidden">
                <div className="w-full bg-amber-400/80" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            README Score: <span className="text-amber-300 font-semibold">Excellent</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Skill Gap Analysis (1-col) */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0d0e15] to-[#07080b] p-8 flex flex-col justify-between hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1 group shadow-xl"
      >
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                Skill Gap & Learning Path
              </h3>
              <span className="text-xs text-slate-400 font-mono">Role Alignment</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-normal">
            Maps your technical capabilities against 9 engineering tracks to deliver a 4-phase learning roadmap.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/50 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Target Role</span>
            <span className="text-emerald-400 font-semibold">AI / Fullstack</span>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-200">
              <span>Phase 1: Distributed Caching</span>
              <span className="text-amber-300 font-mono">Priority</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Phase 2: Message Queues</span>
              <span className="text-emerald-400 font-mono">Next</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. LinkedIn Review (1-col) */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0d0e15] to-[#07080b] p-8 flex flex-col justify-between hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1 group shadow-xl"
      >
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                LinkedIn Recruiter Rank
              </h3>
              <span className="text-xs text-slate-400 font-mono">Inbound Optimization</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-normal">
            Optimizes your headline, experience descriptions, and skill tags for inbound recruiter search algorithms.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/50 p-5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Recruiter Magnet Rating</span>
            <span className="text-sky-400 font-mono font-semibold">Top 8%</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
            "Headline contains 4 key engineering keywords matched by technical recruiters."
          </p>
        </div>
      </motion.div>

      {/* 5. AI Interview Prep (1-col) */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0d0e15] to-[#07080b] p-8 flex flex-col justify-between hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1 group shadow-xl"
      >
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                Personalized Interview Prep
              </h3>
              <span className="text-xs text-slate-400 font-mono">20 Targeted Questions</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-8 leading-relaxed font-normal">
            Generates 20 mock technical interview questions tailored specifically to your resume, projects, and target role.
          </p>
        </div>

        {/* Mini UI Artifact */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/50 p-5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-amber-300 font-medium">System Design</span>
            <span className="text-slate-400">Medium</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-normal font-normal">
            "How would you architect a distributed rate limiter for high-throughput API endpoints?"
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
