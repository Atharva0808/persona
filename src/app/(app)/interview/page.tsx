"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  MessageSquare,
  RefreshCw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <PageHeader
        title="AI Interview Prep & Question Mock"
        description="Generates 20 personalized mock interview questions across HR, Technical, System Design, and Behavioral domains based on your footprint."
        actions={
          session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSession(null)}
              className="rounded-xl border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Session
            </Button>
          ) : null
        }
      />

      {!session ? (
        <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 shadow-2xl p-6 sm:p-10">
          <CardContent className="p-0 space-y-6">
            <div className="p-4 rounded-2xl border border-white/[0.06] bg-black/40 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                Profile Context Ingestion Status
              </span>
              <div className="flex flex-wrap gap-4 font-mono text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasResume ? "text-emerald-400" : "text-slate-600"}`} />
                  Resume Analysis {hasResume ? "(Linked)" : "(Not run)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasGithub ? "text-emerald-400" : "text-slate-600"}`} />
                  GitHub Audit {hasGithub ? "(Linked)" : "(Not run)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasSkills ? "text-emerald-400" : "text-slate-600"}`} />
                  Skill Gap Matrix {hasSkills ? "(Linked)" : "(Not run)"}
                </span>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Target Interview Track *
                </Label>
                <Select
                  value={targetRole}
                  onValueChange={(v) => setTargetRole(v as TargetRole)}
                >
                  <SelectTrigger className="h-11 bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 font-mono text-sm">
                    <SelectValue placeholder="Select target interview track" />
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

              <div className="pt-2 flex justify-end">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.5s"
                  borderRadius="16px"
                  disabled={loading || !targetRole}
                  type="submit"
                  className="h-12 px-8 text-sm font-semibold text-amber-100 disabled:opacity-50 shadow-xl shadow-amber-950/40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-amber-300" />
                      Generating 20 Tailored Questions...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Generate Mock Interview Session
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
          <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  Mock Interview Session
                </span>
                <h2 className="text-xl font-bold text-slate-100">
                  {TARGET_ROLES.find((r) => r.value === session.role)?.label} Track
                </h2>
              </div>
              <Badge variant="outline" className="text-xs text-amber-300 border-amber-400/30 bg-amber-400/10 font-mono">
                20 Custom Questions
              </Badge>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3 pt-4">
              {session.questions.map((q, idx) => (
                <AccordionItem
                  key={q.id || idx}
                  value={q.id || `q-${idx}`}
                  className="rounded-2xl border border-white/[0.06] bg-black/40 px-5 py-1"
                >
                  <AccordionTrigger className="hover:no-underline text-left cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-amber-400 shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-100 leading-snug">
                        {q.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-3 text-xs text-slate-300">
                    <div className="p-3.5 rounded-xl border border-amber-400/20 bg-amber-400/5">
                      <strong className="text-amber-300 font-mono block mb-1">Expected Key Points:</strong>
                      <p className="font-normal leading-relaxed">{q.expected_answer}</p>
                    </div>

                    {q.follow_ups && q.follow_ups.length > 0 && (
                      <div className="p-3.5 rounded-xl border border-white/[0.06] bg-black/40 space-y-1 font-mono">
                        <strong className="text-slate-400 block mb-1">Follow-up Questions:</strong>
                        {q.follow_ups.map((f, i) => (
                          <div key={i} className="text-slate-300">• {f}</div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
