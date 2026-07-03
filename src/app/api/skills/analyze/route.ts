import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeSkillGap } from "@/lib/services/skills";
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
    const { currentSkills, targetRole } = body;

    if (
      !targetRole ||
      !VALID_ROLES.includes(targetRole as TargetRole)
    ) {
      return NextResponse.json(
        { error: "Valid target role is required" },
        { status: 400 }
      );
    }

    if (!currentSkills || !Array.isArray(currentSkills) || currentSkills.length === 0) {
      return NextResponse.json(
        { error: "At least one current skill is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeSkillGap(
      currentSkills,
      targetRole as TargetRole,
      user.id
    );

    // Save to database
    const { data: savedAnalysis, error: dbError } = await supabase
      .from("skill_gap_analyses")
      .insert({
        user_id: user.id,
        target_role: analysis.target_role,
        current_skills: analysis.current_skills,
        required_skills: analysis.required_skills,
        match_percentage: analysis.match_percentage,
        roadmap: analysis.roadmap,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(analysis);
    }

    return NextResponse.json(savedAnalysis);
  } catch (error) {
    console.error("Skill gap analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze skill gap" },
      { status: 500 }
    );
  }
}
