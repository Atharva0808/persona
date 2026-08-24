"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  RefreshCw,
  Target,
  BookOpen,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
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

const QUICK_SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "GraphQL",
  "Redis",
  "Go",
];

const ROADMAP_PHASES_INFO = [
  {
    phase: "01",
    title: "Language Core & Foundations",
    desc: "Syntax mastery, memory models, data structures, and idiomatic type systems.",
  },
  {
    phase: "02",
    title: "Frameworks & State Management",
    desc: "Component architecture, concurrency models, API design, and client-side optimization.",
  },
  {
    phase: "03",
    title: "Distributed Systems & Cloud",
    desc: "Caching layers, queue architectures, microservices, containerization, and observability.",
  },
  {
    phase: "04",
    title: "Production System Milestone",
    desc: "End-to-end fullstack capstone project with automated CI/CD and deployment.",
  },
];

export default function SkillsPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);

  const [skillsInput, setSkillsInput] = useState("");
  const [targetRole, setTargetRole] = useState<TargetRole | "">("");

  const handleAddSkill = (skill: string) => {
    const existing = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!existing.includes(skill)) {
      setSkillsInput(existing.length > 0 ? `${skillsInput}, ${skill}` : skill);
    }
  };

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
          {/* ═══ Left Column (Span 7): Input Form ═══ */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0F4F0] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    Role Track Benchmark
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Compare technical competencies against role seniority requirements
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-1 rounded-lg">
                  9 Tracks
                </span>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#111827]">
                    Target Role Track *
                  </Label>
                  <Select
                    value={targetRole}
                    onValueChange={(v) => setTargetRole(v as TargetRole)}
                  >
                    <SelectTrigger className="h-11 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm">
                      <SelectValue placeholder="Select target role track..." />
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

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#111827]">
                    Current Skills (Comma Separated) *
                  </Label>
                  <Input
                    placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="h-11 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm font-mono"
                    required
                  />

                  {/* Quick skill chips */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-[#6B7280] font-mono block">
                      Click to add common technologies:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {QUICK_SKILLS.map((sk) => (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => handleAddSkill(sk)}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAFBF9] hover:bg-[#EAF5EE] text-[#113D2B] border border-[#E5EBE5] transition-colors cursor-pointer"
                        >
                          + {sk}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0F4F0] flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">
                    Generates a customized phased learning roadmap
                  </span>
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
            </div>
          </div>

          {/* ═══ Right Column (Span 5): 4-Phase Progression ═══ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111827]">
                  Roadmap Structure
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2 py-0.5 rounded-md">
                  4 Phased Milestones
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {ROADMAP_PHASES_INFO.map((item) => (
                  <div
                    key={item.phase}
                    className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] flex items-start gap-3 transition-colors hover:bg-[#F4F7F4]"
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#EAF5EE] text-[#113D2B] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                      {item.phase}
                    </span>
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
                Tip: Engineering interview loops heavily weight systems design and production operational patterns alongside core syntax.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Forest Pine Hero Card */}
          <div className="rounded-3xl bg-[#113D2B] text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#EAF5EE]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                  Role Alignment Matrix
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-display)]">
                {analysis.match_percentage}% Match
              </h2>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <span>Target Track:</span>
                <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
                  {TARGET_ROLES.find((r) => r.value === analysis.target_role)?.label}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 rounded-2xl bg-white/10 border border-white/15 shrink-0">
              <ScoreRing score={analysis.match_percentage} label="Skill Match" size={105} />
            </div>
          </div>

          {/* Roadmap */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#113D2B]" />
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider font-mono">
                4-Phase Learning Roadmap
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.roadmap.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-3xl border border-[#E5EBE5] bg-white p-6 space-y-4 shadow-2xs hover:border-[#113D2B]/30 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-[#E5EBE5] pb-3">
                    <span className="text-xs font-bold text-[#113D2B] bg-[#EAF5EE] px-3 py-1 rounded-xl font-mono">
                      Phase 0{phase.phase}: {phase.title}
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
                        <strong className="text-[#111827] block mb-1">Project Milestone:</strong>
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
