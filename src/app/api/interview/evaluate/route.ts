import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ai } from "@/lib/gemini";

const evaluationResponseSchema = {
  type: "OBJECT" as const,
  properties: {
    score: {
      type: "INTEGER" as const,
      description: "Answer evaluation score between 0 and 100",
    },
    strengths: {
      type: "ARRAY" as const,
      items: { type: "STRING" as const },
    },
    missing_points: {
      type: "ARRAY" as const,
      items: { type: "STRING" as const },
    },
    model_answer: {
      type: "STRING" as const,
      description: "A concise, high-scoring ideal response",
    },
    follow_up: {
      type: "STRING" as const,
      description: "One sharp follow-up probe question",
    },
  },
  required: ["score", "strengths", "missing_points", "model_answer", "follow_up"],
};

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

Evaluate the candidate's answer thoroughly for technical accuracy, clarity, and depth.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: evaluationResponseSchema,
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("No response from Gemini");
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
