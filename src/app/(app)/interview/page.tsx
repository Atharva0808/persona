"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Send,
  MessageSquare,
  FileText,
  Target,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type {
  TargetRole,
  InterviewSession,
  InterviewQuestion,
} from "@/lib/types";

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

const INTERVIEW_RUBRIC_ITEMS = [
  {
    title: "20 Tailored Domain Questions",
    desc: "Spans System Architecture, Distributed Scalability, Concurrency, and STAR Behavioral questions.",
    icon: Terminal,
  },
  {
    title: "Candidate Signal Synthesis",
    desc: "Customized to probe actual projects extracted from your uploaded Resume and GitHub repositories.",
    icon: Target,
  },
  {
    title: "Real-Time Answer Evaluation",
    desc: "Scores response depth against technical keypoints with strength recognition and missing items.",
    icon: CheckCircle2,
  },
  {
    title: "Model Answers & Follow-up Probes",
    desc: "Provides ideal staff-engineer model answers and challenging follow-up inquiry questions.",
    icon: HelpCircle,
  },
];

export default function InterviewPage() {
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState<TargetRole | "">("");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Real-time answer interactive state
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    strengths: string[];
    missing_points: string[];
    model_answer: string;
    follow_up: string;
  } | null>(null);

  // Context flags
  const [hasResume, setHasResume] = useState(false);
  const [hasGithub, setHasGithub] = useState(false);
  const [hasSkills, setHasSkills] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkContextData() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isMounted) return;

        const [r, g, s] = await Promise.all([
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

        if (isMounted) {
          setHasResume(Boolean(r.data?.length));
          setHasGithub(Boolean(g.data?.length));
          setHasSkills(Boolean(s.data?.length));
        }
      } catch (err) {
        console.error("Failed to load interview context:", err);
      }
    }

    checkContextData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) {
      toast.error("Please select a target interview role");
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
        throw new Error(data.error || "Failed to generate questions");
      }

      setSession({
        id: "session-" + Date.now(),
        user_id: "",
        role: targetRole,
        questions: data.questions as InterviewQuestion[],
        created_at: new Date().toISOString(),
      });
      setCurrentIndex(0);
      setCandidateAnswer("");
      setEvaluation(null);
      toast.success("20 tailored mock questions generated");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate mock interview questions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!session || !candidateAnswer.trim()) {
      toast.error("Please enter your answer response");
      return;
    }

    const currentQuestion = session.questions[currentIndex];
    setEvaluating(true);

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.question,
          category: currentQuestion.category,
          expectedKeypoints: currentQuestion.expected_answer,
          candidateAnswer: candidateAnswer.trim(),
          role: session.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setEvaluation(data);
      toast.success("Answer evaluated against technical rubrics");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to evaluate answer";
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
    } else {
      toast.success("You have completed all 20 mock questions!");
    }
  };

  return (
    <div className="space-y-7 pb-10 text-[#111827]">
      <PageHeader
        title="Technical Mock Interview Practice"
        description="20 tailored questions generated directly from your actual background, projects, and target role."
        actions={
          session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSession(null);
                setCandidateAnswer("");
                setEvaluation(null);
              }}
              className="rounded-xl border-[#113D2B] text-[#113D2B] hover:bg-[#EAF5EE] font-bold text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Session
            </Button>
          ) : null
        }
      />

      {!session ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ═══ Left Column (Span 7): Session Generator ═══ */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0F4F0] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    Start Mock Interview Session
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Synthesizes 20 tailored questions across 4 technical domains
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-1 rounded-lg">
                  20 Questions
                </span>
              </div>

              {/* Context Signals Status */}
              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] space-y-2">
                <span className="text-xs font-mono font-bold text-[#113D2B] uppercase tracking-wider block">
                  Context Signals Found:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    hasResume ? "bg-[#EAF5EE] border-[#D8E2D8] text-[#113D2B]" : "bg-white border-[#E5EBE5] text-[#9CA3AF]"
                  }`}>
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Resume {hasResume ? "✓" : "—"}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    hasGithub ? "bg-[#EAF5EE] border-[#D8E2D8] text-[#113D2B]" : "bg-white border-[#E5EBE5] text-[#9CA3AF]"
                  }`}>
                    <Github size={14} className="shrink-0" />
                    <span className="truncate">GitHub {hasGithub ? "✓" : "—"}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    hasSkills ? "bg-[#EAF5EE] border-[#D8E2D8] text-[#113D2B]" : "bg-white border-[#E5EBE5] text-[#9CA3AF]"
                  }`}>
                    <Target className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Skill Gap {hasSkills ? "✓" : "—"}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#111827]">
                    Target Interview Role *
                  </Label>
                  <Select
                    value={targetRole}
                    onValueChange={(v) => setTargetRole(v as TargetRole)}
                  >
                    <SelectTrigger className="h-11 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm">
                      <SelectValue placeholder="Select target interview track..." />
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

                <div className="pt-2 border-t border-[#F0F4F0] flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">
                    Interactive practice with instant evaluation
                  </span>
                  <button
                    disabled={loading || !targetRole}
                    type="submit"
                    className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4 text-white" />
                        Generating Tailored Questions...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Start Mock Session
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ═══ Right Column (Span 5): Rubric & Simulation Overview ═══ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111827]">
                  Simulation Rubric
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2 py-0.5 rounded-md">
                  Staff Engineer Level
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {INTERVIEW_RUBRIC_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] flex items-start gap-3 transition-colors hover:bg-[#F4F7F4]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] text-[#113D2B] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
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
                Tip: Type responses thoroughly as if speaking live to the interviewer. Detailed tradeoffs and scale metrics receive higher rubric marks.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Forest Pine Session Header Card */}
          <div className="rounded-3xl bg-[#113D2B] text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#EAF5EE]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                  Question {currentIndex + 1} of {session.questions.length}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-display)]">
                {TARGET_ROLES.find((r) => r.value === session.role)?.label} Track
              </h2>
            </div>

            <div className="space-y-1.5 min-w-[180px]">
              <div className="flex justify-between text-xs font-mono text-white/80">
                <span>Session Progress</span>
                <span>{Math.round(((currentIndex + 1) / session.questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#F2C94C] h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${((currentIndex + 1) / session.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Current Question Card */}
          <Card className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#113D2B] bg-[#EAF5EE] px-3 py-1 rounded-lg uppercase font-mono">
                {session.questions[currentIndex].category || "Technical Architecture"}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug pt-2 font-[family-name:var(--font-display)]">
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
                    className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {evaluating ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4 text-white" />
                        Evaluating Answer...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Answer for Evaluation
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#113D2B] font-mono">
                    Evaluation Score
                  </span>
                  <span className="text-base font-bold font-mono text-[#113D2B] bg-[#EAF5EE] px-3 py-1 rounded-lg">
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
                  <strong className="text-[#111827] block font-mono">Ideal Model Answer:</strong>
                  <p className="text-[#374151] leading-relaxed">{evaluation.model_answer}</p>
                </div>

                {evaluation.follow_up && (
                  <div className="p-4 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] text-xs">
                    <strong className="text-[#113D2B] block mb-1 font-mono">Follow-Up Probe Question:</strong>
                    <p className="text-[#374151]">{evaluation.follow_up}</p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleNextQuestion}
                    className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] text-white font-bold text-xs shadow-sm cursor-pointer"
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
