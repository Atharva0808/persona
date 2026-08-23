"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-7 pb-10 text-[#111827]">
      <PageHeader
        title="Skill Gap Analysis"
        description="Map current skills against target engineering roles to generate a 4-phase roadmap."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalysis(null)}
              className="rounded-xl border-[#E5EBE5] text-[#111827] hover:bg-[#F4F7F4] font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Audit
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <Card className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs">
          <CardContent className="p-0">
            <form onSubmit={handleAnalyze} className="space-y-5 max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#111827]">
                  Target Role Track *
                </Label>
                <Select
                  value={targetRole}
                  onValueChange={(v) => setTargetRole(v as TargetRole)}
                >
                  <SelectTrigger className="h-10 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm">
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5EBE5] text-[#111827] shadow-lg">
                    {TARGET_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#111827]">
                  Current Skills (Comma Separated) *
                </Label>
                <Input
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="h-10 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  disabled={loading || !targetRole || !skillsInput.trim()}
                  type="submit"
                  className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-white" />
                      Computing Skill Matrix...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze Skill Gap
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-bold text-[#113D2B] uppercase tracking-wider">
                Role Alignment Match
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Match: {analysis.match_percentage}%
              </h2>
              <p className="text-xs text-[#6B7280]">
                Target track:{" "}
                <span className="font-bold text-[#113D2B]">
                  {TARGET_ROLES.find((r) => r.value === analysis.target_role)?.label}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-center p-3 rounded-2xl bg-[#F4F7F4] border border-[#E5EBE5] shrink-0">
              <ScoreRing score={analysis.match_percentage} label="Skill Match" size={100} />
            </div>
          </div>

          {/* Roadmap */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Learning Roadmap
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.roadmap.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-3xl border border-[#E5EBE5] bg-white p-6 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-[#E5EBE5] pb-3">
                    <span className="text-xs font-bold text-[#113D2B] bg-[#EAF5EE] px-3 py-1 rounded-lg">
                      Phase {phase.phase}: {phase.title}
                    </span>
                    <span className="text-xs text-[#6B7280] font-mono">{phase.duration}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex flex-wrap gap-1.5 font-mono">
                      {phase.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-lg bg-[#FAFBF9] border border-[#E5EBE5] text-[#111827]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {phase.projects.length > 0 && (
                      <div className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] text-xs text-[#6B7280]">
                        <strong className="text-[#111827] block mb-1">Project Target:</strong>
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
