"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Search,
  RefreshCw,
  CheckCircle2,
  GitBranch,
  Users,
  GitCommit,
  BookOpen,
  Code2,
  Globe,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GitHubAnalysis } from "@/lib/types";

const GITHUB_RUBRIC_ITEMS = [
  {
    title: "Commit Cadence & Consistency",
    desc: "Evaluates sustainable commit frequency, active streak rhythm, and repository update regularity.",
    icon: GitCommit,
  },
  {
    title: "README & Architecture Depth",
    desc: "Scans repository documentation, setup guides, system architecture diagrams, and live demos.",
    icon: BookOpen,
  },
  {
    title: "Language & Codebase Diversity",
    desc: "Analyzes polyglot breadth, test suite coverage, and modern framework proficiency.",
    icon: Code2,
  },
  {
    title: "Open Source Community Footprint",
    desc: "Measures public repo traction, pull request contributions, and star engagement.",
    icon: Globe,
  },
];

const SUGGESTED_USERNAMES = ["shadcn", "leerob", "torvalds", "antfu", "gaearon"];

export default function GitHubPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);

  const handleAnalyze = async (e?: React.FormEvent, customUser?: string) => {
    if (e) e.preventDefault();
    const userToFetch = customUser || username;
    if (!userToFetch.trim()) return;

    if (customUser) {
      setUsername(customUser);
    }

    setLoading(true);

    try {
      const res = await fetch("/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userToFetch.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
      toast.success("GitHub profile analyzed successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze GitHub profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7 pb-10 text-[#111827]">
      <PageHeader
        title="GitHub Repository Audit"
        description="Audits commit activity, README documentation depth, and repository code quality."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnalysis(null);
                setUsername("");
              }}
              className="rounded-xl border-[#113D2B] text-[#113D2B] hover:bg-[#EAF5EE] font-bold text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Audit
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ═══ Left Column (Span 7): Search Form ═══ */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0F4F0] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    Connect GitHub Profile
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Analyzes public repository history, commits, and codebase depth
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-1 rounded-lg">
                  Public API
                </span>
              </div>

              <form onSubmit={(e) => handleAnalyze(e)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111827]">
                    GitHub Username
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      type="text"
                      placeholder="e.g. torvalds or your-handle"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] font-mono text-sm"
                    />
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-[#6B7280] font-mono mr-1">
                      Quick examples:
                    </span>
                    {SUGGESTED_USERNAMES.map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => {
                          setUsername(handle);
                          handleAnalyze(undefined, handle);
                        }}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAFBF9] hover:bg-[#EAF5EE] text-[#113D2B] border border-[#E5EBE5] transition-colors cursor-pointer"
                      >
                        @{handle}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0F4F0] flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">
                    Only public repo metadata is analyzed. No tokens stored.
                  </span>
                  <button
                    disabled={!username.trim() || loading}
                    type="submit"
                    className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4 text-white" />
                        Scanning Repositories...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Analyze Profile
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ═══ Right Column (Span 5): Rubric Signals ═══ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111827]">
                  Codebase Evaluation Criteria
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2 py-0.5 rounded-md">
                  4 Dimensions
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {GITHUB_RUBRIC_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] flex items-start gap-3 transition-colors hover:bg-[#F4F7F4]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] text-[#113D2B] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#111827]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] p-4 text-xs text-[#6B7280] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#113D2B] shrink-0 mt-0.5" />
              <span>
                Tip: Technical recruiters look for pinned repos with clean README files, architecture diagrams, and active commit momentum.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Forest Pine Hero Card */}
          <div className="rounded-3xl bg-[#113D2B] text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <Avatar className="h-18 w-18 border-2 border-white/20 shrink-0">
                <AvatarImage src={analysis.profile.avatar_url} />
                <AvatarFallback className="bg-white/10 text-white font-mono font-bold text-base">
                  {analysis.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {analysis.profile.name || analysis.username}
                  </h2>
                  <span className="text-xs text-white/70 font-mono bg-white/10 px-2.5 py-0.5 rounded-lg">
                    @{analysis.username}
                  </span>
                </div>
                {analysis.profile.bio && (
                  <p className="text-xs text-white/80 max-w-lg leading-relaxed">{analysis.profile.bio}</p>
                )}
                <div className="flex items-center gap-4 pt-1 text-xs text-white/70 font-mono">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5" />
                    {analysis.profile.public_repos} Repositories
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {analysis.profile.followers} Followers
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 rounded-2xl bg-white/10 border border-white/15 shrink-0">
              <ScoreRing score={analysis.score} label="GitHub Rating" size={105} />
            </div>
          </div>

          {/* Commit & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 space-y-3 shadow-2xs hover:border-[#113D2B]/30 transition-colors">
              <div className="flex items-center justify-between border-b border-[#E5EBE5] pb-3">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono">
                  Commit Activity Stream
                </h3>
                <span className="text-xs font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-0.5 rounded-lg">
                  {analysis.commit_activity.consistency}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9]">
                  <div className="text-[#6B7280]">Recent Commits</div>
                  <div className="text-xl font-bold text-[#111827] mt-1 font-[family-name:var(--font-display)]">
                    {analysis.commit_activity.total_commits}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9]">
                  <div className="text-[#6B7280]">Weekly Average</div>
                  <div className="text-xl font-bold text-[#113D2B] mt-1 font-[family-name:var(--font-display)]">
                    {analysis.commit_activity.avg_per_week}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 space-y-3 shadow-2xs hover:border-[#113D2B]/30 transition-colors">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono border-b border-[#E5EBE5] pb-3">
                Language Distribution
              </h3>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {Object.entries(analysis.languages).map(([lang, count]) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 rounded-xl bg-[#FAFBF9] border border-[#E5EBE5] text-[#111827]"
                  >
                    {lang}: <strong className="text-[#113D2B]">{count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono border-b border-[#E5EBE5] pb-3">
              Actionable Portfolio Recommendations
            </h3>
            <div className="space-y-2.5">
              {analysis.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#374151]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#113D2B] shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
