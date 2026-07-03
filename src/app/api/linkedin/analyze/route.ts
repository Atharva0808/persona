import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeLinkedIn } from "@/lib/services/linkedin";

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
    const { headline, about, experience, skills, featured, profileUrl } = body;

    if (!profileUrl) {
      return NextResponse.json(
        { error: "LinkedIn profile URL is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeLinkedIn(
      { headline, about, experience, skills, featured, profileUrl },
      user.id
    );

    // Save to database
    const { data: savedAnalysis, error: dbError } = await supabase
      .from("linkedin_analyses")
      .insert({
        user_id: user.id,
        profile_url: analysis.profile_url,
        score: analysis.score,
        headline: analysis.headline,
        about: analysis.about,
        experience: analysis.experience,
        skills: analysis.skills,
        featured: analysis.featured,
        recruiter_attractiveness: analysis.recruiter_attractiveness,
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
    console.error("LinkedIn analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze LinkedIn profile" },
      { status: 500 }
    );
  }
}
