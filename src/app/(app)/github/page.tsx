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
  Trophy,
  ArrowRight,
  Search,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { GitHubAnalysis, GitHubRepo } from "@/lib/types";

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

  const getConsistencyColor = (consistency: string) => {
    switch (consistency) {
      case "excellent":
        return "success";
      case "good":
        return "info";
      case "inconsistent":
        return "warning";
      default:
        return "destructive";
    }
  };

  const getReadmeQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "success";
      case "good":
        return "info";
      case "needs_improvement":
        return "warning";
      default:
        return "destructive";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="GitHub Analysis"
        description="Analyze your repositories, commit activity, and code quality."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalysis(null)}
            >
              New Analysis
            </Button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto mt-12"
          >
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <Github className="h-8 w-8 text-neutral-400" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-neutral-100 mb-2">
                  Connect your GitHub
                </h2>
                <p className="text-sm text-neutral-500 mb-8">
                  Enter your GitHub username to analyze your profile and get an
                  objective score on your open-source presence.
                </p>

                <form onSubmit={handleAnalyze} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      placeholder="torvalds"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" disabled={loading || !username.trim()}>
                    {loading ? (
                      <Spinner size="sm" className="text-neutral-950" />
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Overview Profile */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-neutral-800">
                      <AvatarImage src={analysis.profile.avatar_url} />
                      <AvatarFallback>
                        {analysis.profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-neutral-100 truncate">
                        {analysis.profile.name}
                      </h2>
                      <p className="text-sm text-neutral-500 truncate mb-3">
                        @{analysis.username}
                      </p>
                      {analysis.profile.bio && (
                        <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                          {analysis.profile.bio}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-neutral-200">
                            {analysis.profile.public_repos}
                          </span>{" "}
                          repos
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span className="text-neutral-200">
                            {analysis.profile.followers}
                          </span>{" "}
                          followers
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <ScoreRing
                    score={analysis.score}
                    size={120}
                    label="GitHub Score"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <Activity className="h-5 w-5 text-neutral-400 mb-2" />
                  <div className="text-2xl font-semibold text-neutral-100 tabular-nums">
                    {analysis.commit_activity.total_commits}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Commits (last 100 events)
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <Code2 className="h-5 w-5 text-neutral-400 mb-2" />
                  <div className="text-2xl font-semibold text-neutral-100 tabular-nums">
                    {Object.keys(analysis.languages).length}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Languages Used</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <Trophy className="h-5 w-5 text-neutral-400 mb-2" />
                  <div className="text-xl font-semibold text-neutral-100 mb-1">
                    <Badge variant={getConsistencyColor(analysis.commit_activity.consistency)}>
                      {analysis.commit_activity.consistency.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-neutral-500">Activity Consistency</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <Activity className="h-5 w-5 text-neutral-400 mb-2" />
                  <div className="text-2xl font-semibold text-neutral-100 tabular-nums">
                    {analysis.commit_activity.avg_per_week}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Commits / Week</div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations & Top Repos */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-neutral-400"
                      >
                        <ArrowRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Repositories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.repositories.slice(0, 4).map((repo: GitHubRepo) => (
                      <div key={repo.name}>
                        <div className="flex items-center justify-between mb-1">
                          <a
                            href={`https://github.com/${analysis.username}/${repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-neutral-200 hover:text-white transition-colors truncate"
                          >
                            {repo.name}
                          </a>
                          <div className="flex items-center gap-3 text-xs text-neutral-500">
                            {repo.language && (
                              <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                {repo.language}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {repo.stars}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {repo.forks}
                            </div>
                          </div>
                        </div>
                        {repo.description && (
                          <p className="text-xs text-neutral-500 line-clamp-1 mb-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/50">
                          <span className="text-[10px] text-neutral-600 uppercase tracking-wider">
                            README
                          </span>
                          <Badge
                            variant={getReadmeQualityColor(repo.readme_quality)}
                            className="text-[10px] py-0 h-4"
                          >
                            {repo.readme_quality.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
