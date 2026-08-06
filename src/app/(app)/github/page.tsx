"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Star,
  GitFork,
  BookOpen,
  Activity,
  Code2,
  ArrowRight,
  Search,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GitHubAnalysis } from "@/lib/types";

export default function GitHubPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <PageHeader
        title="GitHub Repository & Commit Audit"
        description="Audits repository documentation, commit streak consistency, README depth, and star counts."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnalysis(null);
                setUsername("");
              }}
              className="rounded-xl border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Audit
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 shadow-2xl p-6 sm:p-10">
          <CardContent className="p-0 space-y-6">
            <form onSubmit={handleAnalyze} className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  GitHub Username
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="e.g. torvalds or your-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.5s"
                  borderRadius="16px"
                  disabled={!username.trim() || loading}
                  type="submit"
                  className="h-12 px-8 text-sm font-semibold text-amber-100 disabled:opacity-50 shadow-xl shadow-amber-950/40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-amber-300" />
                      Auditing GitHub Repos...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze Profile
                      <ArrowRight className="h-4 w-4 text-amber-400" />
                    </span>
                  )}
                </ShimmerButton>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Profile & Score Banner */}
          <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-amber-500/30">
                  <AvatarImage src={analysis.profile.avatar_url} />
                  <AvatarFallback className="bg-amber-500/10 text-amber-300 font-mono font-bold">
                    {analysis.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-100">{analysis.profile.name}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono">
                      @{analysis.username}
                    </span>
                  </div>
                  {analysis.profile.bio && (
                    <p className="text-xs text-slate-400 font-normal">{analysis.profile.bio}</p>
                  )}
                  <div className="flex items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
                    <span>{analysis.profile.public_repos} Repos</span>
                    <span>•</span>
                    <span>{analysis.profile.followers} Followers</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/[0.06] shrink-0">
                <ScoreRing score={analysis.score} label="GitHub Rating" size={120} />
              </div>
            </div>
          </Card>

          {/* Commit Activity & Language Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-semibold text-amber-400 uppercase tracking-wide">
                  Commit Consistency
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {analysis.commit_activity.consistency.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-black/40">
                  <div className="text-slate-500">Recent Commits</div>
                  <div className="text-lg font-bold text-slate-100 mt-1">
                    {analysis.commit_activity.total_commits}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-black/40">
                  <div className="text-slate-500">Weekly Avg</div>
                  <div className="text-lg font-bold text-amber-300 mt-1">
                    {analysis.commit_activity.avg_per_week}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 space-y-4 shadow-lg">
              <h3 className="text-sm font-mono font-semibold text-amber-400 uppercase tracking-wide">
                Top Languages
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.entries(analysis.languages).map(([lang, count]) => (
                  <span
                    key={lang}
                    className="text-xs px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 font-mono"
                  >
                    {lang}: <strong className="text-amber-300">{count} repos</strong>
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-sm font-mono font-semibold text-amber-400 uppercase tracking-wide">
              Optimization Recommendations
            </h3>
            <div className="space-y-2.5">
              {analysis.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/[0.06] bg-black/40 text-xs text-slate-300 font-normal"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
