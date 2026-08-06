import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeGitHub } from "@/lib/services/github";

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
    const { username } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "GitHub username is required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check 24-Hour Cache in Database
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: cached } = await supabase
      .from("github_analyses")
      .select("*")
      .ilike("username", cleanUsername)
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false })
      .limit(1);

    if (cached && cached.length > 0) {
      return NextResponse.json(cached[0]);
    }

    const analysis = await analyzeGitHub(cleanUsername);

    // Save to database
    const { data: savedAnalysis, error: dbError } = await supabase
      .from("github_analyses")
      .insert({
        user_id: user.id,
        username: analysis.username,
        score: analysis.score,
        profile: analysis.profile,
        repositories: analysis.repositories,
        languages: analysis.languages,
        commit_activity: analysis.commit_activity,
        recommendations: analysis.recommendations,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(analysis);
    }

    return NextResponse.json(savedAnalysis);
  } catch (error) {
    console.error("GitHub analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze GitHub profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
