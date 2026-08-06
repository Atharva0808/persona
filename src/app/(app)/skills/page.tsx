"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <PageHeader
        title="Skill Gap Analysis & Learning Roadmap"
        description="Map your technical stack against target roles and receive a structured 4-phase learning roadmap."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalysis(null)}
              className="rounded-xl border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Skill Gap Audit
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 shadow-2xl p-6 sm:p-10">
          <CardContent className="p-0">
            <form onSubmit={handleAnalyze} className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Target Engineering Track *
                </Label>
                <Select
                  value={targetRole}
                  onValueChange={(v) => setTargetRole(v as TargetRole)}
                >
                  <SelectTrigger className="h-11 bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 font-mono text-sm">
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0c0d12] border-white/10 text-slate-200">
                    {TARGET_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Current Skills (Comma Separated) *
                </Label>
                <Input
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="h-11 bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 font-mono text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <ShimmerButton
                  shimmerColor="#34d399"
                  shimmerDuration="2.5s"
                  borderRadius="16px"
                  disabled={loading || !targetRole || !skillsInput.trim()}
                  type="submit"
                  className="h-12 px-8 text-sm font-semibold text-emerald-100 disabled:opacity-50 shadow-xl shadow-emerald-950/40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-emerald-300" />
                      Computing Skill Matrix...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze Skill Gap
                      <ArrowRight className="h-4 w-4 text-emerald-400" />
                    </span>
                  )}
                </ShimmerButton>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-semibold">
                  <Target className="w-4 h-4" />
                  <span>Role Gap Analysis</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                  Target Role Match Score
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Your current skill set aligns <strong className="text-emerald-400">{analysis.match_percentage}%</strong> with industry standard requirements for{" "}
                  <span className="font-mono text-amber-300">
                    {TARGET_ROLES.find((r) => r.value === analysis.target_role)?.label}
                  </span>.
                </p>
              </div>

              <div className="flex items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/[0.06] shrink-0">
                <ScoreRing score={analysis.match_percentage} label="Skill Match" size={120} />
              </div>
            </div>
          </Card>

          {/* Roadmap */}
          <div className="space-y-6">
            <h3 className="text-sm font-mono font-semibold text-amber-400 uppercase tracking-widest">
              4-Phase Structured Learning Roadmap
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.roadmap.map((phase) => (
                <Card key={phase.phase} className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Phase {phase.phase}: {phase.title}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{phase.duration}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {phase.skills.map((sk) => (
                        <span key={sk} className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {phase.projects.length > 0 && (
                      <div className="p-3 rounded-2xl border border-white/[0.06] bg-black/40 text-xs text-slate-300">
                        <strong className="text-amber-300 font-mono block mb-1">Project Idea to Build:</strong>
                        <span>{phase.projects[0]}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
