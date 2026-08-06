import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInterviewQuestions } from "@/lib/services/interview";
import type { TargetRole } from "@/lib/types";

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

    // Ingest cross-vector profile context from Supabase
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
      ? `Resume feedback: ${resumeRes.data[0].overall_feedback}. Weak bullet points to probe: ${JSON.stringify(resumeRes.data[0].weak_bullets)}`
      : "";

    const githubContext = githubRes.data?.[0]
      ? `GitHub languages used: ${JSON.stringify(githubRes.data[0].languages)}. Recommendations: ${JSON.stringify(githubRes.data[0].recommendations)}`
      : "";

    const linkedinContext = linkedinRes.data?.[0]
      ? `LinkedIn recommendations: ${JSON.stringify(linkedinRes.data[0].recommendations)}`
      : "";

    const combinedContext = [resumeContext, githubContext, linkedinContext]
      .filter(Boolean)
      .join("\n");

    const questions = await generateInterviewQuestions({
      targetRole: targetRole as TargetRole,
      resumeText: combinedContext,
      githubProjects: githubContext ? [githubContext] : [],
      skills: [],
    });

    // Save to database
    const { data: savedSession, error: dbError } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        role: targetRole,
        questions,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ questions });
    }

    return NextResponse.json(savedSession);
  } catch (error) {
    console.error("Interview generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}
