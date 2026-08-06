"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MessageSquare,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

interface EvaluationResult {
  score: number;
  strengths: string[];
  missing_points: string[];
  model_answer: string;
  follow_up: string;
}

export default function InterviewPage() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [targetRole, setTargetRole] = useState<TargetRole | "">("");

  // Interactive Session State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

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
        supabase.from("resume_analyses").select("id").eq("user_id", user.id).limit(1),
        supabase.from("github_analyses").select("id").eq("user_id", user.id).limit(1),
        supabase.from("skill_gap_analyses").select("id").eq("user_id", user.id).limit(1),
      ]);

      setHasResume((resumeRes.data?.length ?? 0) > 0);
      setHasGithub((githubRes.data?.length ?? 0) > 0);
      setHasSkills((skillsRes.data?.length ?? 0) > 0);
    } catch (error) {
      console.error("Failed to fetch context status", error);
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
      setCurrentIndex(0);
      setCandidateAnswer("");
      setEvaluation(null);
      toast.success("Generated 20 tailored mock interview questions!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate questions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!session || !candidateAnswer.trim()) return;

    const currentQ = session.questions[currentIndex];
    setEvaluating(true);

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ.question,
          expectedAnswer: currentQ.expected_answer,
          candidateAnswer: candidateAnswer.trim(),
          targetRole: session.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");

      setEvaluation(data);
      toast.success("Answer evaluated!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Evaluation failed";
      toast.error(message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCandidateAnswer("");
      setEvaluation(null);
    }
  };

  return (
    <div className="space-y-8 text-neutral-100">
      <PageHeader
        title="Interactive AI Technical Mock Interview"
        description="Type your response to live questions and receive instant AI answer scoring, model answers, and follow-ups."
        actions={
          session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSession(null);
                setEvaluation(null);
              }}
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
                Linked Cross-Vector Context
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
                      Generating 20 Tailored Questions...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Start Interactive Mock Session
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
          {/* Progress Header */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {session.questions.length}
              </span>
              <h2 className="text-base font-bold text-neutral-100">
                {TARGET_ROLES.find((r) => r.value === session.role)?.label} Track
              </h2>
            </div>

            <div className="w-32 bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / session.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Question Card */}
          <Card className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                Q{currentIndex + 1}:
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-100 leading-snug">
                {session.questions[currentIndex].question}
              </h3>
            </div>

            {/* Response Form */}
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                Your Answer Response:
              </Label>
              <Textarea
                placeholder="Type your response here as if speaking to the interviewer..."
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                rows={5}
                disabled={evaluating || Boolean(evaluation)}
                className="bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 text-sm resize-none"
              />

              {!evaluation && (
                <div className="flex justify-end">
                  <ShimmerButton
                    shimmerColor="#f59e0b"
                    shimmerDuration="2.2s"
                    borderRadius="12px"
                    disabled={!candidateAnswer.trim() || evaluating}
                    onClick={handleEvaluateAnswer}
                    className="h-11 px-6 text-sm font-semibold text-amber-100 disabled:opacity-50"
                  >
                    {evaluating ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4 text-amber-300" />
                        Evaluating Answer...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Answer for AI Evaluation
                        <Send className="h-3.5 w-3.5 text-amber-400 ml-1" />
                      </span>
                    )}
                  </ShimmerButton>
                </div>
              )}
            </div>

            {/* AI Real-Time Feedback */}
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 border-t border-neutral-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    AI Evaluation Score
                  </span>
                  <span className="text-base font-bold font-mono text-amber-300">
                    {evaluation.score} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {evaluation.strengths.length > 0 && (
                    <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                      <strong className="text-emerald-400 block font-mono">Strengths:</strong>
                      <ul className="space-y-1 text-neutral-300">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.missing_points.length > 0 && (
                    <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-1">
                      <strong className="text-amber-300 block font-mono">Missing Points:</strong>
                      <ul className="space-y-1 text-neutral-300">
                        {evaluation.missing_points.map((m, i) => (
                          <li key={i}>• {m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/80 space-y-1 text-xs">
                  <strong className="text-neutral-200 font-mono block">Ideal Model Answer:</strong>
                  <p className="text-neutral-300 font-mono leading-relaxed">{evaluation.model_answer}</p>
                </div>

                {evaluation.follow_up && (
                  <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/80 text-xs">
                    <strong className="text-amber-400 font-mono block mb-1">Follow-Up Probe Question:</strong>
                    <p className="text-neutral-200 font-mono">{evaluation.follow_up}</p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleNextQuestion}
                    className="h-11 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium text-xs border border-neutral-700"
                  >
                    Next Question
                    <ArrowRight className="w-3.5 h-3.5 ml-2 text-amber-400" />
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
