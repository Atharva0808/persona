"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
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
    let isMounted = true;
    const fetchContext = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isMounted) return;

        const [resumeRes, githubRes, skillsRes] = await Promise.all([
          supabase.from("resume_analyses").select("id").eq("user_id", user.id).limit(1),
          supabase.from("github_analyses").select("id").eq("user_id", user.id).limit(1),
          supabase.from("skill_gap_analyses").select("id").eq("user_id", user.id).limit(1),
        ]);

        if (isMounted) {
          setHasResume((resumeRes.data?.length ?? 0) > 0);
          setHasGithub((githubRes.data?.length ?? 0) > 0);
          setHasSkills((skillsRes.data?.length ?? 0) > 0);
        }
      } catch (error) {
        console.error("Failed to fetch context status", error);
      }
    };

    fetchContext();

    return () => {
      isMounted = false;
    };
  }, []);

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
    <div className="space-y-7 pb-10 text-[#111827]">
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
              className="rounded-full border-[#E5EBE5] text-[#111827] hover:bg-[#F4F7F4] font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Session
            </Button>
          ) : null
        }
      />

      {!session ? (
        <Card className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs">
          <CardContent className="p-0 space-y-5">
            <div className="p-4 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#113D2B] block">
                Linked Profile Context
              </span>
              <div className="flex flex-wrap gap-4 text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      hasResume ? "text-[#113D2B]" : "text-[#D1DCD1]"
                    }`}
                  />
                  Resume {hasResume ? "(Linked)" : "(Not run)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      hasGithub ? "text-[#113D2B]" : "text-[#D1DCD1]"
                    }`}
                  />
                  GitHub {hasGithub ? "(Linked)" : "(Not run)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      hasSkills ? "text-[#113D2B]" : "text-[#D1DCD1]"
                    }`}
                  />
                  Skill Gap {hasSkills ? "(Linked)" : "(Not run)"}
                </span>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5 max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#111827]">
                  Target Role Track *
                </Label>
                <Select
                  value={targetRole}
                  onValueChange={(v) => setTargetRole(v as TargetRole)}
                >
                  <SelectTrigger className="h-10 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm">
                    <SelectValue placeholder="Select target interview track" />
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

              <div className="pt-2 flex justify-end">
                <button
                  disabled={loading || !targetRole}
                  type="submit"
                  className="h-11 px-7 rounded-full bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-white" />
                      Generating 20 Tailored Questions...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Start Interactive Mock Session
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
          {/* Progress Header */}
          <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 flex items-center justify-between shadow-2xs">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#113D2B] uppercase tracking-wider">
                Question {currentIndex + 1} of {session.questions.length}
              </span>
              <h2 className="text-base font-bold text-[#111827]">
                {TARGET_ROLES.find((r) => r.value === session.role)?.label} Track
              </h2>
            </div>

            <div className="w-36 bg-[#E5EBE5] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#113D2B] h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentIndex + 1) / session.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Question Card */}
          <Card className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#113D2B] bg-[#EAF5EE] px-3 py-1 rounded-full uppercase">
                Question {currentIndex + 1}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug pt-2">
                {session.questions[currentIndex].question}
              </h3>
            </div>

            {/* Response Form */}
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-bold text-[#111827]">
                Your Answer Response:
              </Label>
              <Textarea
                placeholder="Type your response here as if speaking to the interviewer..."
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                rows={5}
                disabled={evaluating || Boolean(evaluation)}
                className="bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm resize-none"
              />

              {!evaluation && (
                <div className="flex justify-end">
                  <button
                    disabled={!candidateAnswer.trim() || evaluating}
                    onClick={handleEvaluateAnswer}
                    className="h-11 px-7 rounded-full bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {evaluating ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4 text-white" />
                        Evaluating Answer...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Answer for AI Evaluation
                        <Send className="h-3.5 w-3.5 ml-1" />
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* AI Real-Time Feedback */}
            {evaluation && (
              <div className="space-y-4 pt-4 border-t border-[#E5EBE5]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#113D2B]">
                    AI Evaluation Score
                  </span>
                  <span className="text-base font-bold font-mono text-[#113D2B] bg-[#EAF5EE] px-3 py-1 rounded-full">
                    {evaluation.score} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {evaluation.strengths.length > 0 && (
                    <div className="p-4 rounded-2xl border border-[#E5EBE5] bg-[#EAF5EE] space-y-1">
                      <strong className="text-[#113D2B] block">Strengths:</strong>
                      <ul className="space-y-1 text-[#374151]">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.missing_points.length > 0 && (
                    <div className="p-4 rounded-2xl border border-[#E5EBE5] bg-[#FEF3C7] space-y-1">
                      <strong className="text-[#92400E] block">Missing Points:</strong>
                      <ul className="space-y-1 text-[#78350F]">
                        {evaluation.missing_points.map((m, i) => (
                          <li key={i}>• {m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] space-y-1 text-xs">
                  <strong className="text-[#111827] block">Ideal Model Answer:</strong>
                  <p className="text-[#374151] leading-relaxed">{evaluation.model_answer}</p>
                </div>

                {evaluation.follow_up && (
                  <div className="p-4 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] text-xs">
                    <strong className="text-[#113D2B] block mb-1">Follow-Up Probe Question:</strong>
                    <p className="text-[#374151]">{evaluation.follow_up}</p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleNextQuestion}
                    className="h-11 px-7 rounded-full bg-[#113D2B] hover:bg-[#0D3122] text-white font-bold text-xs shadow-sm"
                  >
                    Next Question
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
