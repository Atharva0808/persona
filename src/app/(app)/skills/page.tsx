"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Target, ArrowRight, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SkillGapAnalysis, TargetRole } from "@/lib/types";

const TARGET_ROLES: { value: TargetRole; label: string }[] = [
  { value: "frontend", label: "Frontend Developer" },
  { value: "backend", label: "Backend Developer" },
  { value: "fullstack", label: "Full Stack Developer" },
  { value: "ai_engineer", label: "AI/ML Engineer" },
  { value: "data_scientist", label: "Data Scientist" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "mobile", label: "Mobile Developer" },
  { value: "cloud", label: "Cloud Engineer" },
  { value: "cybersecurity", label: "Cybersecurity Engineer" },
];

export default function SkillsPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);

  const [skillsInput, setSkillsInput] = useState("");
  const [targetRole, setTargetRole] = useState<TargetRole | "">("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) {
      toast.error("Please select a target role");
      return;
    }

    const currentSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (currentSkills.length === 0) {
      toast.error("Please enter at least one skill");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/skills/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills, targetRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
      toast.success("Skill gap analyzed successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze skill gap";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-neutral-100">
      <PageHeader
        title="Skill Gap Analysis"
        description="Map current skills against target engineering roles to generate a 4-phase roadmap."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalysis(null)}
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
            <form onSubmit={handleAnalyze} className="space-y-5 max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                  Target Role Track *
                </Label>
                <Select
                  value={targetRole}
                  onValueChange={(v) => setTargetRole(v as TargetRole)}
                >
                  <SelectTrigger className="h-10 bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 font-mono text-sm">
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border-neutral-800 text-neutral-200">
                    {TARGET_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                  Current Skills (Comma Separated) *
                </Label>
                <Input
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="h-10 bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 font-mono text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.5s"
                  borderRadius="12px"
                  disabled={loading || !targetRole || !skillsInput.trim()}
                  type="submit"
                  className="h-11 px-6 text-sm font-semibold text-amber-100 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-amber-300" />
                      Computing Skill Matrix...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze Skill Gap
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
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Role Alignment Match
              </div>
              <h2 className="text-xl font-bold text-neutral-100">
                Match: {analysis.match_percentage}%
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Target track:{" "}
                <span className="font-mono text-amber-300">
                  {TARGET_ROLES.find((r) => r.value === analysis.target_role)?.label}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 shrink-0">
              <ScoreRing score={analysis.match_percentage} label="Skill Match" size={100} />
            </div>
          </div>

          {/* Roadmap */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Learning Roadmap
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.roadmap.map((phase) => (
                <div key={phase.phase} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Phase {phase.phase}: {phase.title}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">{phase.duration}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap gap-1.5 font-mono">
                      {phase.skills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {phase.projects.length > 0 && (
                      <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 text-xs text-neutral-400">
                        <strong className="text-neutral-200 block mb-1">Project Idea:</strong>
                        <span>{phase.projects[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
