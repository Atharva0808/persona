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

    const contentType = request.headers.get("content-type") || "";

    let profileData = {
      headline: "",
      about: "",
      experience: "",
      skills: "",
      featured: "",
      profileUrl: "https://linkedin.com/in/profile",
    };

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No PDF file provided" },
          { status: 400 }
        );
      }

      // Parse PDF using pdf-parse
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // @ts-expect-error - Internal path
      const pdfParseModule = await import("pdf-parse/lib/pdf-parse.js");
      const pdfParse = pdfParseModule.default || pdfParseModule;
      const pdfData = await pdfParse(buffer);
      const extractedText = pdfData.text;

      if (!extractedText || extractedText.trim().length < 30) {
        return NextResponse.json(
          { error: "Could not extract text from the LinkedIn PDF." },
          { status: 400 }
        );
      }

      profileData = {
        headline: extractedText.slice(0, 300),
        about: extractedText.slice(0, 2000),
        experience: extractedText,
        skills: "Extracted from LinkedIn PDF",
        featured: "Extracted from LinkedIn PDF",
        profileUrl: "LinkedIn PDF Export",
      };
    } else {
      const body = await request.json();
      const { headline, about, experience, skills, featured, profileUrl } = body;
      profileData = {
        headline: headline || "",
        about: about || "",
        experience: experience || "",
        skills: skills || "",
        featured: featured || "",
        profileUrl: profileUrl || "https://linkedin.com/in/profile",
      };
    }

    const analysis = await analyzeLinkedIn(profileData);

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
