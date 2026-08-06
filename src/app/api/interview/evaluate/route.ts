import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ai } from "@/lib/gemini";

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
    const { question, candidateAnswer, expectedAnswer, targetRole } = body;

    if (!question || !candidateAnswer) {
      return NextResponse.json(
        { error: "Question and candidate answer are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert technical interviewer evaluating a candidate for a ${targetRole || "Software Engineering"} position.

Question asked: "${question}"
Expected key points: "${expectedAnswer || "Not specified"}"
Candidate's answer: "${candidateAnswer}"

Evaluate the candidate's answer thoroughly and provide constructive feedback.
Return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "missing_points": ["<missing point 1>", "<missing point 2>"],
  "model_answer": "<a concise, high-scoring ideal response>",
  "follow_up": "<one sharp follow-up question to probe deeper>"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Interview evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate candidate answer" },
      { status: 500 }
    );
  }
}
