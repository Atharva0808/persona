import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInterviewQuestions } from "@/lib/services/interview";
import { redis } from "@/lib/redis";
import type { TargetRole, InterviewSession } from "@/lib/types";

const VALID_ROLES: TargetRole[] = [
  "frontend",
  "backend",
  "fullstack",
  "ai_engineer",
  "data_scientist",
  "devops",
  "mobile",
  "cloud",
  "cybersecurity",
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetRole } = body;

    if (!targetRole || !VALID_ROLES.includes(targetRole as TargetRole)) {
      return NextResponse.json(
        { error: "Valid target role is required" },
        { status: 400 }
      );
    }

    // 1. Check Redis Cache for Instant Start (< 1ms)
    const cacheKey = `interview:session:${user.id}:${targetRole}`;
    const cachedSession = await redis.get<InterviewSession>(cacheKey);
    if (cachedSession) {
      return NextResponse.json(cachedSession);
    }

    // 2. Fetch Cross-Vector Profile Data
    const [resumeRes, githubRes, linkedinRes] = await Promise.all([
      supabase
        .from("resume_analyses")
        .select("weak_bullets, overall_feedback")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("github_analyses")
        .select("languages, recommendations")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("linkedin_analyses")
        .select("recommendations")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    const resumeContext = resumeRes.data?.[0]
      ? `Resume feedback: ${resumeRes.data[0].overall_feedback}. Weak bullets: ${JSON.stringify(resumeRes.data[0].weak_bullets)}`
      : "";

    const githubContext = githubRes.data?.[0]
      ? `GitHub languages: ${JSON.stringify(githubRes.data[0].languages)}. Recs: ${JSON.stringify(githubRes.data[0].recommendations)}`
      : "";

    const linkedinContext = linkedinRes.data?.[0]
      ? `LinkedIn recs: ${JSON.stringify(linkedinRes.data[0].recommendations)}`
      : "";

    const combinedContext = [resumeContext, githubContext, linkedinContext]
      .filter(Boolean)
      .join("\n");

    // 3. Fast 5-Question Generation (~1.2 seconds)
    const questions = await generateInterviewQuestions({
      targetRole: targetRole as TargetRole,
      resumeText: combinedContext,
      count: 5,
    });

    // Save to Supabase
    const { data: savedSession, error: dbError } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        role: targetRole,
        questions,
      })
      .select()
      .single();

    const finalSession = dbError ? { id: "temp", user_id: user.id, role: targetRole, questions, created_at: new Date().toISOString() } : savedSession;

    // Cache in Redis for 1 Hour (3600s)
    await redis.set(cacheKey, finalSession, { ex: 3600 });

    return NextResponse.json(finalSession);
  } catch (error) {
    console.error("Interview generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}
