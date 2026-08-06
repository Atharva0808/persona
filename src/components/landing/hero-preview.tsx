"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Target,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";

type TabType = "resume" | "github" | "linkedin" | "skills";

export function HeroPreview() {
  const [activeTab, setActiveTab] = useState<TabType>("resume");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-[#0c0d12]/90 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      {/* Top Window Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#08090d]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="ml-3 text-[11px] font-mono tracking-wide text-slate-400">
            persona.engine / evaluation-v2
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">Readiness: 86 / 100</span>
          </div>
        </div>
      </div>

      {/* Candidate Profile Header */}
      <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-gradient-to-r from-[#0e0f16] via-[#0c0d12] to-[#08090d]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center font-bold text-amber-200 text-sm shadow-inner">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                  Alex Chen
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono">
                  Fullstack Track
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-normal">
                Target: Senior Fullstack Engineer • 5+ YOE • San Francisco, CA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 border-t sm:border-t-0 border-white/[0.06] pt-4 sm:pt-0">
            <div className="text-left sm:text-right">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">Overall Match</div>
              <div className="text-xl font-bold text-amber-300 flex items-center justify-start sm:justify-end gap-1.5 font-mono mt-0.5">
                86% <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/[0.08] hidden sm:block" />
            <div className="text-left sm:text-right">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">ATS Rating</div>
              <div className="text-xl font-bold text-blue-400 font-mono mt-0.5">92 / 100</div>
            </div>
          </div>
        </div>

        {/* Domain Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
          {[
            { id: "resume", label: "ATS Resume", score: 92, color: "text-blue-400", icon: FileText },
            { id: "github", label: "GitHub Depth", score: 84, color: "text-amber-300", icon: Github },
            { id: "linkedin", label: "LinkedIn Rank", score: 88, color: "text-sky-400", icon: Linkedin },
            { id: "skills", label: "Skill Gap", score: 82, color: "text-emerald-400", icon: Target },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                activeTab === item.id
                  ? "bg-white/[0.06] border-amber-400/30 shadow-lg shadow-amber-950/20"
                  : "bg-black/30 border-white/[0.05] hover:bg-white/[0.03] hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  {item.label}
                </span>
                <span className={`text-xs font-bold font-mono ${item.color}`}>
                  {item.score}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Body */}
      <div className="p-6 sm:p-7 bg-[#07080b]/90 min-h-[220px]">
        <AnimatePresence mode="wait">
          {activeTab === "resume" && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  ATS Optimization Analysis
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full text-amber-400 border border-amber-500/20 bg-amber-500/10 font-mono">
                  High Impact Rewrites
                </span>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs">
                <div className="text-rose-400 font-semibold mb-1 flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Original Resume Bullet:
                </div>
                <p className="text-slate-400 line-through pl-3.5 font-normal">
                  "Worked on improving frontend performance and fixed React bugs."
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4 text-xs">
                <div className="text-amber-300 font-semibold mb-1 flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Quantified AI Action Rewrite:
                </div>
                <p className="text-slate-100 pl-3.5 font-mono text-[12px] leading-relaxed">
                  "Engineered React state architecture optimizations, reducing First Contentful Paint by 42% across 120k monthly active users."
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "github" && (
            <motion.div
              key="github"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Github className="w-3.5 h-3.5 text-amber-400" />
                  Repository Quality Audit
                </span>
                <span className="text-xs text-slate-400 font-mono">30 Repositories Checked</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl border border-white/[0.06] bg-black/40">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-slate-200">Commit Frequency</span>
                    <span className="text-emerald-400 font-semibold font-mono">Consistent</span>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {[70, 90, 60, 100, 85, 95, 80, 100, 90, 95, 100, 88].map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-amber-400/15 rounded-md h-7 flex items-end overflow-hidden"
                      >
                        <div
                          className="w-full bg-amber-400"
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-white/[0.06] bg-black/40 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-200">README Depth Index</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      Top projects contain architectural diagrams, API documentation, and benchmark suites.
                    </p>
                  </div>
                  <div className="text-xs text-emerald-400 font-mono font-medium mt-2">
                    ✓ High recruiter conversion score
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "linkedin" && (
            <motion.div
              key="linkedin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                  Recruiter Inbound Index
                </span>
                <span className="text-xs font-mono text-sky-400 font-semibold">Rank: Top 8%</span>
              </div>

              <div className="p-4 rounded-2xl border border-white/[0.06] bg-black/40 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Headline Keywords</span>
                  <span className="text-slate-200 font-mono text-[11px]">React • TypeScript • Next.js • Distributed Systems</span>
                </div>
                <div className="h-[1px] bg-white/[0.06]" />
                <p className="text-slate-300 leading-relaxed font-normal">
                  <strong className="text-amber-300">Recruiter Tip:</strong> Adding "System Design" into headline increases inbound recruiter search volume by +34%.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  Target Role Skill Gap Matrix
                </span>
                <span className="text-xs text-slate-400 font-mono">Senior Fullstack</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-black/40">
                  <span className="text-slate-200 font-medium">Distributed Caching (Redis)</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full text-amber-300 border border-amber-500/20 bg-amber-500/10 font-mono">
                    Phase 1 Priority
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-black/40">
                  <span className="text-slate-200 font-medium">Kubernetes Container Orchestration</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 font-mono">
                    Acquired
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Callout */}
      <div className="px-6 py-4 border-t border-white/[0.06] bg-[#08090d] flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>20 Tailored Mock Interview Questions generated for AC's profile.</span>
        </span>
        <span className="text-amber-300 font-mono hidden sm:flex items-center gap-1 font-medium">
          Explore Evaluation Engine <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
}
