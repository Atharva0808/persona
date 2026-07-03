"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Target,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

const tools = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload and analyze your resume for ATS compatibility",
    href: "/resume",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Github,
    title: "GitHub Analysis",
    description: "Evaluate your repositories and contribution patterns",
    href: "/github",
    color: "text-neutral-400",
    bgColor: "bg-neutral-500/10",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Review",
    description: "Optimize your profile for recruiter visibility",
    href: "/linkedin",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description: "Map your skills against target roles",
    href: "/skills",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description: "Generate personalized interview questions",
    href: "/interview",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const [scores, setScores] = useState<{
    resume: number | null;
    github: number | null;
    linkedin: number | null;
    skills: number | null;
  }>({
    resume: null,
    github: null,
    linkedin: null,
    skills: null,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [resumeRes, githubRes, linkedinRes, skillsRes] = await Promise.all([
        supabase.from("resume_analyses").select("ats_score").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("github_analyses").select("score").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("linkedin_analyses").select("score").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("skill_gap_analyses").select("match_percentage").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
      ]);

      setScores({
        resume: resumeRes.data?.[0]?.ats_score ?? null,
        github: githubRes.data?.[0]?.score ?? null,
        linkedin: linkedinRes.data?.[0]?.score ?? null,
        skills: skillsRes.data?.[0]?.match_percentage ?? null,
      });
      setLoading(false);
    }
    fetchScores();
  }, []);

  const completedCount = Object.values(scores).filter((s) => s !== null).length;
  // +1 for interview prep if we want to count it, but let's say 4 tools are scored.
  const totalScore = 
    ((scores.resume || 0) + (scores.github || 0) + (scores.linkedin || 0) + (scores.skills || 0)) / 
    (completedCount || 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Dashboard"
        description="Your interview readiness at a glance."
      />

      {/* Overview Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Resume", score: scores.resume, icon: FileText },
          { label: "GitHub", score: scores.github, icon: Github },
          { label: "LinkedIn", score: scores.linkedin, icon: Linkedin },
          { label: "Skills", score: scores.skills, icon: Target },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-800">
                  <metric.icon className="h-4 w-4 text-neutral-400" />
                </div>
                <span className="text-sm text-neutral-400">{metric.label}</span>
              </div>
              {loading ? (
                <div className="text-sm text-neutral-600 animate-pulse">Loading...</div>
              ) : metric.score !== null ? (
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-semibold text-neutral-100 tabular-nums">
                    {Math.round(metric.score)}
                  </span>
                  <span className="text-sm text-neutral-500 mb-0.5">/100</span>
                </div>
              ) : (
                <div className="text-sm text-neutral-600">Not analyzed yet</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Readiness */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-1">
                Overall Readiness
              </h3>
              <p className="text-sm text-neutral-500">
                Complete all analyses to get your interview readiness score.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {completedCount}/4 completed
                </Badge>
                <Badge variant="outline">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {completedCount === 4 ? "Ready for Interviews!" : "Getting started"}
                </Badge>
              </div>
            </div>
            <ScoreRing score={Math.round(totalScore)} label="Ready" size={100} />
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-neutral-300">Analysis Tools</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          Run each analysis to build your complete profile.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-3"
      >
        {tools.map((tool) => (
          <motion.div key={tool.title} variants={item}>
            <Link href={tool.href}>
              <Card className="group hover:border-neutral-700 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex items-start gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${tool.bgColor} shrink-0`}
                  >
                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-neutral-200">
                        {tool.title}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                    </div>
                    <p className="text-sm text-neutral-500">
                      {tool.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
