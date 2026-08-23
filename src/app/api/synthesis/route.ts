import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { synthesizePersonaVectors } from "@/lib/services/synthesis";
import { redis } from "@/lib/redis";
import type {
  ResumeAnalysis,
  GitHubAnalysis,
  LinkedInAnalysis,
  SkillGapAnalysis,
  PersonaCrossVectorSynthesis,
} from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const cacheKey = `persona:synthesis:${user.id}`;

    if (!forceRefresh) {
      const cached = await redis.get<PersonaCrossVectorSynthesis>(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    // Fetch all 4 vectors in parallel
    const [resumeRes, githubRes, linkedinRes, skillsRes] = await Promise.all([
      supabase
        .from("resume_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("github_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("linkedin_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("skill_gap_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    const resume = (resumeRes.data?.[0] as ResumeAnalysis) || null;
    const github = (githubRes.data?.[0] as GitHubAnalysis) || null;
    const linkedin = (linkedinRes.data?.[0] as LinkedInAnalysis) || null;
    const skills = (skillsRes.data?.[0] as SkillGapAnalysis) || null;

    const synthesis = await synthesizePersonaVectors({
      resume,
      github,
      linkedin,
      skills,
    });

    // Cache for 2 hours (7200s)
    await redis.set(cacheKey, synthesis, { ex: 7200 });

    return NextResponse.json(synthesis);
  } catch (error) {
    console.error("Synthesis API error:", error);
    return NextResponse.json(
      { error: "Failed to generate cross-vector synthesis" },
      { status: 500 }
    );
  }
}
