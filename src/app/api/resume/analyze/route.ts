import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeResume } from "@/lib/services/resume";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Parse PDF using pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import for pdf-parse (bypass index.js bug)
    const pdfParseModule = await import("pdf-parse/lib/pdf-parse.js");
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the PDF. Please ensure your resume is not image-based." },
        { status: 400 }
      );
    }

    // Analyze with AI
    const analysis = await analyzeResume(resumeText, user.id);

    // Optionally store the file in Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data: uploadData } = await supabase.storage
      .from("resumes")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    const fileUrl = uploadData?.path
      ? supabase.storage.from("resumes").getPublicUrl(uploadData.path).data
          .publicUrl
      : "";

    // Save analysis to database
    const { data: savedAnalysis, error: dbError } = await supabase
      .from("resume_analyses")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: fileUrl,
        raw_text: resumeText,
        ats_score: analysis.ats_score,
        overall_feedback: analysis.overall_feedback,
        sections: analysis.sections,
        weak_bullets: analysis.weak_bullets,
        improvements: analysis.improvements,
        missing_skills: analysis.missing_skills,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Return analysis even if DB save fails
      return NextResponse.json({
        ...analysis,
        file_name: file.name,
        file_url: fileUrl,
      });
    }

    return NextResponse.json(savedAnalysis);
  } catch (error) {
    console.error("Resume analysis error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze resume. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
