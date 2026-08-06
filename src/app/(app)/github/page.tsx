"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Search,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
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
    <div className="space-y-8 text-neutral-100">
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
              className="rounded-xl border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Audit
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <Card className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
          <CardContent className="p-0">
            <form onSubmit={handleAnalyze} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  GitHub Username
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <Input
                    type="text"
                    placeholder="e.g. torvalds or your-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-10 bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.5s"
                  borderRadius="12px"
                  disabled={!username.trim() || loading}
                  type="submit"
                  className="h-11 px-6 text-sm font-semibold text-amber-100 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-amber-300" />
                      Fetching GitHub Repos...
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
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-neutral-700">
                <AvatarImage src={analysis.profile.avatar_url} />
                <AvatarFallback className="bg-neutral-800 text-neutral-200 font-mono font-bold text-sm">
                  {analysis.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-neutral-100">{analysis.profile.name}</h2>
                  <span className="text-xs text-neutral-400 font-mono">@{analysis.username}</span>
                </div>
                {analysis.profile.bio && (
                  <p className="text-xs text-neutral-400 font-normal">{analysis.profile.bio}</p>
                )}
                <div className="flex items-center gap-4 pt-1 text-xs text-neutral-500 font-mono">
                  <span>{analysis.profile.public_repos} Repos</span>
                  <span>•</span>
                  <span>{analysis.profile.followers} Followers</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 shrink-0">
              <ScoreRing score={analysis.score} label="GitHub Rating" size={100} />
            </div>
          </div>

          {/* Commit & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Commit Activity
                </h3>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  {analysis.commit_activity.consistency}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60">
                  <div className="text-neutral-500">Recent Commits</div>
                  <div className="text-base font-bold text-neutral-200 mt-0.5">
                    {analysis.commit_activity.total_commits}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60">
                  <div className="text-neutral-500">Weekly Avg</div>
                  <div className="text-base font-bold text-amber-300 mt-0.5">
                    {analysis.commit_activity.avg_per_week}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
              <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-800/60 pb-2">
                Language Distribution
              </h3>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {Object.entries(analysis.languages).map(([lang, count]) => (
                  <span
                    key={lang}
                    className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300"
                  >
                    {lang}: <strong className="text-amber-300">{count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-3">
            <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-2.5">
              Recommendations
            </h3>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
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
