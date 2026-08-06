"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Target,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

type TabType = "resume" | "github" | "linkedin" | "skills";

export function HeroPreview() {
  const [activeTab, setActiveTab] = useState<TabType>("resume");

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-amber-500/20 bg-neutral-900/90 shadow-2xl shadow-amber-950/20 overflow-hidden font-sans">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-950/90">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-neutral-700 border border-neutral-600" />
          <div className="w-3 h-3 rounded-full bg-neutral-700 border border-neutral-600" />
          <span className="ml-3 text-xs font-mono text-neutral-400">
            persona.app/candidate-audit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30 font-medium">
            <Award className="w-3 h-3 mr-1 text-amber-400" />
            Readiness Score: 86 / 100
          </Badge>
        </div>
      </div>

      {/* Candidate Profile Header */}
      <div className="p-6 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 shadow-md">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-100">
                  Alex Chen
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
                  Fullstack Engineer Track
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Target Role: Senior Fullstack • 5+ YOE • San Francisco, CA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0">
            <div className="text-center sm:text-right">
              <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Overall Match</div>
              <div className="text-xl font-extrabold text-amber-400 flex items-center justify-end gap-1 font-mono">
                86% <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="h-8 w-[1px] bg-neutral-800 hidden sm:block" />
            <div className="text-center sm:text-right">
              <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">ATS Resume</div>
              <div className="text-xl font-extrabold text-blue-400 font-mono">92/100</div>
            </div>
          </div>
        </div>

        {/* Domain Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          {[
            { id: "resume", label: "ATS Resume", score: 92, color: "text-blue-400", icon: FileText },
            { id: "github", label: "GitHub Depth", score: 84, color: "text-amber-300", icon: Github },
            { id: "linkedin", label: "LinkedIn Rank", score: 88, color: "text-sky-400", icon: Linkedin },
            { id: "skills", label: "Skill Match", score: 82, color: "text-emerald-400", icon: Target },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-neutral-800/90 border-amber-500/40 shadow-md shadow-amber-950/30"
                  : "bg-neutral-950/50 border-neutral-800 hover:bg-neutral-800/40 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-medium flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-neutral-400" />
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

      {/* Dynamic Tab Body */}
      <div className="p-6 bg-neutral-950/80 min-h-[210px]">
        <AnimatePresence mode="wait">
          {activeTab === "resume" && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  ATS Optimization Insight
                </span>
                <Badge variant="outline" className="text-[11px] text-amber-400 border-amber-500/30 bg-amber-500/10">
                  Priority Action
                </Badge>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs">
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-1">
                  <AlertCircle className="w-4 h-4" /> Weak Bullet Point Identified:
                </div>
                <p className="text-neutral-400 line-through pl-6">
                  "Worked on improving frontend performance and fixed React bugs."
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> High-Impact Quantified AI Rewrite:
                </div>
                <p className="text-neutral-100 pl-6 font-mono text-[12px] leading-relaxed">
                  "Engineered React state architecture optimizations, reducing First Contentful Paint by 42% across 120k monthly active users."
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "github" && (
            <motion.div
              key="github"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Github className="w-3.5 h-3.5 text-amber-400" />
                  GitHub Repository Audit
                </span>
                <span className="text-xs text-neutral-400 font-mono">30 Repositories Audited</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-neutral-200">Commit Activity Stream</span>
                    <span className="text-emerald-400 font-bold font-mono">Consistent</span>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {[70, 90, 60, 100, 85, 95, 80, 100, 90, 95, 100, 88].map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-amber-500/15 rounded-md h-7 flex items-end overflow-hidden"
                      >
                        <div
                          className="w-full bg-amber-400"
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-200">README Architecture Depth</div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Top projects contain architectural diagrams, API docs, and benchmarks.
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                  Recruiter Inbound Magnet
                </span>
                <span className="text-xs font-mono text-sky-400 font-bold">Attractiveness: 88/100</span>
              </div>

              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-medium">Matched Keyword Triggers</span>
                  <span className="text-neutral-100 font-mono text-[11px]">React • TypeScript • Next.js • Microservices</span>
                </div>
                <div className="h-[1px] bg-neutral-800" />
                <p className="text-neutral-300 leading-relaxed">
                  <strong className="text-amber-300">Recruiter Optimization Tip:</strong> Adding "Distributed Systems" into your headline boosts inbound recruiter message queries by +34%.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  Target Role Roadmap
                </span>
                <span className="text-xs text-neutral-400 font-mono">Senior Fullstack</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-900/60">
                  <span className="text-neutral-200 font-medium">Distributed Caching (Redis)</span>
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/10">
                    Phase 1 Priority
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-900/60">
                  <span className="text-neutral-200 font-medium">Kubernetes Container Orchestration</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                    Acquired
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Callout */}
      <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>20 Tailored Interview Questions generated for AC's profile.</span>
        </span>
        <span className="text-amber-400 font-mono hidden sm:flex items-center gap-1 font-semibold">
          Try Live Engine <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
