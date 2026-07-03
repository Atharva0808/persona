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
    const { targetRole, resumeText, githubProjects, skills } = body;

    if (!targetRole || !VALID_ROLES.includes(targetRole as TargetRole)) {
      return NextResponse.json(
        { error: "Valid target role is required" },
        { status: 400 }
      );
    }

    const questions = await generateInterviewQuestions(
      {
        targetRole: targetRole as TargetRole,
        resumeText,
        githubProjects,
        skills,
      },
      user.id
    );

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
