"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Target,
  ArrowRight,
  Code2,
  BookOpen,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SkillGapAnalysis, TargetRole, SkillRequirement } from "@/lib/types";

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "important":
        return "warning";
      case "nice_to_have":
        return "info";
      default:
        return "default";
    }
  };

  const renderSkillIcon = (req: SkillRequirement) => {
    if (req.has_skill) {
      if (req.current_level === "beginner" && req.level !== "beginner") {
        return <AlertCircle className="h-4 w-4 text-amber-400" />;
      }
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    }
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Skill Gap Analysis"
        description="Compare your current skills against your target role and get a personalized learning roadmap."
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
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <Target className="h-8 w-8 text-neutral-400" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-neutral-100 mb-2 text-center">
                  Map Your Journey
                </h2>
                <p className="text-sm text-neutral-500 mb-8 text-center">
                  Tell us what you know and where you want to go.
                </p>

                <form onSubmit={handleAnalyze} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Role</Label>
                    <Select
                      value={targetRole}
                      onValueChange={(val: TargetRole) => setTargetRole(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Current Skills</Label>
                    <Input
                      id="skills"
                      placeholder="React, TypeScript, Node.js..."
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                    />
                    <p className="text-xs text-neutral-500">
                      Separate skills with commas.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !targetRole || !skillsInput.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2 text-neutral-950" />
                        Analyzing Gap...
                      </>
                    ) : (
                      "Generate Roadmap"
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
            className="space-y-8"
          >
            {/* Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <ScoreRing
                    score={analysis.match_percentage}
                    size={160}
                    label="Role Match"
                  />
                  <div className="text-center mt-6">
                    <Badge variant="outline" className="text-sm">
                      Target:{" "}
                      {
                        TARGET_ROLES.find(
                          (r) => r.value === analysis.target_role
                        )?.label
                      }
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-neutral-400" />
                    Required Skills Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysis.required_skills.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between bg-neutral-900/50 p-3 rounded-lg border border-neutral-800"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{renderSkillIcon(req)}</div>
                          <div>
                            <span className="text-sm font-medium text-neutral-200 block">
                              {req.skill}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                Need: {req.level}
                              </span>
                              {req.has_skill && (
                                <>
                                  <span className="text-neutral-600">•</span>
                                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                    Have: {req.current_level}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={getPriorityColor(req.priority)}
                          className="text-[10px] py-0 h-4"
                        >
                          {req.priority.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Roadmap */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-neutral-100">
                  Your Learning Roadmap
                </h2>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
                {analysis.roadmap.map((phase, i) => (
                  <div
                    key={i}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-950 bg-neutral-800 text-neutral-400 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_var(--bg-neutral-950)] z-10 font-bold text-sm">
                      {phase.phase}
                    </div>

                    <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] hover:border-neutral-700 transition-colors">
                      <CardHeader className="pb-3 border-b border-neutral-800/50">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base text-emerald-400">
                            {phase.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {phase.duration}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div>
                          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-2">
                            Focus Skills
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="default"
                                className="bg-neutral-800 text-neutral-300 border-none"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {phase.projects.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-2">
                              Build
                            </span>
                            <ul className="space-y-1.5">
                              {phase.projects.map((project, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-neutral-400"
                                >
                                  <ArrowRight className="h-3.5 w-3.5 text-neutral-600 shrink-0 mt-0.5" />
                                  <span>{project}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {phase.resources.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-2">
                              Resources
                            </span>
                            <div className="grid gap-2">
                              {phase.resources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2 rounded bg-neutral-900/50 hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors group/link"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <BookOpen className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                                    <span className="text-sm text-neutral-300 truncate">
                                      {resource.title}
                                    </span>
                                  </div>
                                  <ExternalLink className="h-3 w-3 text-neutral-600 group-hover/link:text-neutral-400 opacity-0 group-hover/link:opacity-100 transition-all shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
