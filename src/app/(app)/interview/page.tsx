"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import type { InterviewSession, TargetRole, InterviewQuestion } from "@/lib/types";

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

  // Context data state
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
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Unauthorized");

      // Gather context
      let resumeText, githubProjects, skills;

      if (hasResume) {
        const { data } = await supabase
          .from("resume_analyses")
          .select("raw_text")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        resumeText = data?.raw_text;
      }

      if (hasGithub) {
        const { data } = await supabase
          .from("github_analyses")
          .select("repositories")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (data?.repositories) {
          githubProjects = data.repositories.map(
            (r: any) => `${r.name}: ${r.description || "No description"}`
          );
        }
      }

      if (hasSkills) {
        const { data } = await supabase
          .from("skill_gap_analyses")
          .select("current_skills")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        skills = data?.current_skills;
      }

      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          resumeText,
          githubProjects,
          skills,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setSession(data);
      toast.success("Interview questions generated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate questions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "destructive";
      default:
        return "default";
    }
  };

  const groupQuestionsByCategory = (questions: InterviewQuestion[]) => {
    return questions.reduce((acc, q) => {
      const category = q.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(q);
      return acc;
    }, {} as Record<string, InterviewQuestion[]>);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Interview Preparation"
        description="Generate personalized interview questions based on your profile, resume, and GitHub."
        actions={
          session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSession(null)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {!session ? (
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
                    <MessageSquare className="h-8 w-8 text-neutral-400" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-neutral-100 mb-2 text-center">
                  Mock Interview Setup
                </h2>
                <p className="text-sm text-neutral-500 mb-6 text-center">
                  We'll generate questions tailored to the context you've
                  provided across Persona.
                </p>

                <div className="flex justify-center gap-4 mb-8">
                  <Badge variant={hasResume ? "success" : "outline"}>
                    Resume {hasResume ? "Found" : "Missing"}
                  </Badge>
                  <Badge variant={hasGithub ? "success" : "outline"}>
                    GitHub {hasGithub ? "Found" : "Missing"}
                  </Badge>
                  <Badge variant={hasSkills ? "success" : "outline"}>
                    Skills {hasSkills ? "Found" : "Missing"}
                  </Badge>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6">
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !targetRole}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2 text-neutral-950" />
                        Generating Questions...
                      </>
                    ) : (
                      "Start Interview Prep"
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
          >
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="flex-wrap h-auto justify-start">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {Object.keys(groupQuestionsByCategory(session.questions)).map(
                    (category) => (
                      <TabsTrigger key={category} value={category}>
                        {category.replace("_", " ")}
                      </TabsTrigger>
                    )
                  )}
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid gap-4">
                  {session.questions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              </TabsContent>

              {Object.entries(groupQuestionsByCategory(session.questions)).map(
                ([category, questions]) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid gap-4">
                      {questions.map((q) => (
                        <QuestionCard key={q.id} question={q} />
                      ))}
                    </div>
                  </TabsContent>
                )
              )}
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  function QuestionCard({ question }: { question: InterviewQuestion }) {
    return (
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={question.id} className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-neutral-900/50 rounded-lg transition-colors [&[data-state=open]]:rounded-b-none">
                <div className="flex flex-col items-start text-left gap-2 flex-1 pr-4">
                  <div className="flex items-center gap-2 w-full">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {question.category.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant={getDifficultyColor(question.difficulty)}
                      className="text-[10px]"
                    >
                      {question.difficulty}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-neutral-200 leading-relaxed">
                    {question.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <div className="space-y-6 pt-4 border-t border-neutral-800">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                      <HelpCircle className="h-4 w-4" />
                      Expected Answer Elements
                    </h4>
                    <p className="text-sm text-neutral-400 leading-relaxed bg-emerald-950/10 p-4 rounded-lg border border-emerald-900/20">
                      {question.expected_answer}
                    </p>
                  </div>

                  {(question.follow_ups || []).length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                        <MessageSquare className="h-4 w-4" />
                        Potential Follow-ups
                      </h4>
                      <ul className="space-y-2">
                        {(question.follow_ups || []).map((followUp, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-neutral-400 bg-sky-950/10 p-3 rounded-lg border border-sky-900/20"
                          >
                            <span className="text-sky-500 font-bold shrink-0">
                              Q:
                            </span>
                            {followUp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(question.tips || []).length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                        <Lightbulb className="h-4 w-4" />
                        Tips
                      </h4>
                      <ul className="space-y-2 pl-6 list-disc text-sm text-neutral-400">
                        {(question.tips || []).map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    );
  }
}
