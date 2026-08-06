"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/client";
import type { InterviewSession, TargetRole } from "@/lib/types";

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

export default function InterviewPage() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [targetRole, setTargetRole] = useState<TargetRole | "">("");

  const [hasResume, setHasResume] = useState(false);
  const [hasGithub, setHasGithub] = useState(false);
  const [hasSkills, setHasSkills] = useState(false);

  useEffect(() => {
    checkContextData();
  }, []);

  const checkContextData = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const [resumeRes, githubRes, skillsRes] = await Promise.all([
        supabase
          .from("resume_analyses")
          .select("id")
          .eq("user_id", user.id)
          .limit(1),
        supabase
          .from("github_analyses")
          .select("id")
          .eq("user_id", user.id)
          .limit(1),
        supabase
          .from("skill_gap_analyses")
          .select("id")
          .eq("user_id", user.id)
          .limit(1),
      ]);

      setHasResume((resumeRes.data?.length ?? 0) > 0);
      setHasGithub((githubRes.data?.length ?? 0) > 0);
      setHasSkills((skillsRes.data?.length ?? 0) > 0);
    } catch (error) {
      console.error("Failed to fetch context data status", error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) {
      toast.error("Please select a target role");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setSession(data);
      toast.success("Generated 20 tailored mock interview questions!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate questions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-neutral-100">
      <PageHeader
        title="AI Interview Prep"
        description="Generates 20 personalized mock interview questions tailored to your profile."
        actions={
          session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSession(null)}
              className="rounded-xl border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Session
            </Button>
          ) : null
        }
      />

      {!session ? (
        <Card className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
          <CardContent className="p-0 space-y-5">
            <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1.5 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                Linked Profile Context
              </span>
              <div className="flex flex-wrap gap-4 font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasResume ? "text-emerald-400" : "text-neutral-600"}`} />
                  Resume {hasResume ? "(Linked)" : "(Not run)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasGithub ? "text-emerald-400" : "text-neutral-600"}`} />
                  GitHub {hasGithub ? "(Linked)" : "(Not run)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasSkills ? "text-emerald-400" : "text-neutral-600"}`} />
                  Skill Gap {hasSkills ? "(Linked)" : "(Not run)"}
                </span>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5 max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                  Target Role Track *
                </Label>
                <Select
                  value={targetRole}
                  onValueChange={(v) => setTargetRole(v as TargetRole)}
                >
                  <SelectTrigger className="h-10 bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 font-mono text-sm">
                    <SelectValue placeholder="Select target interview track" />
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

              <div className="pt-2 flex justify-end">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.5s"
                  borderRadius="12px"
                  disabled={loading || !targetRole}
                  type="submit"
                  className="h-11 px-6 text-sm font-semibold text-amber-100 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-amber-300" />
                      Generating Questions...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Generate Mock Questions
                      <ArrowRight className="h-4 w-4 text-amber-400" />
                    </span>
                  )}
                </ShimmerButton>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                Mock Interview Questions
              </div>
              <h2 className="text-base font-bold text-neutral-100">
                {TARGET_ROLES.find((r) => r.value === session.role)?.label} Track
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">20 Questions</span>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {session.questions.map((q, idx) => (
              <AccordionItem
                key={q.id || idx}
                value={q.id || `q-${idx}`}
                className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-1"
              >
                <AccordionTrigger className="hover:no-underline text-left cursor-pointer">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-amber-400 shrink-0 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-neutral-200 leading-snug">
                      {q.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3 space-y-2 text-xs text-neutral-400">
                  <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
                    <strong className="text-neutral-200 block mb-0.5 font-mono">Expected Answer Key Points:</strong>
                    <p className="leading-relaxed">{q.expected_answer}</p>
                  </div>

                  {q.follow_ups && q.follow_ups.length > 0 && (
                    <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1 font-mono">
                      <strong className="text-neutral-400 block mb-0.5">Follow-up Questions:</strong>
                      {q.follow_ups.map((f, i) => (
                        <div key={i} className="text-neutral-300">• {f}</div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
