import { ai } from "@/lib/gemini";
import type {
  ResumeAnalysis,
  ResumeSection,
  WeakBullet,
} from "@/lib/types";

const resumeResponseSchema = {
  type: "OBJECT" as const,
  properties: {
    ats_score: {
      type: "INTEGER" as const,
      description: "ATS compatibility score between 0 and 100",
    },
    overall_feedback: {
      type: "STRING" as const,
      description: "2-3 sentences of overall executive resume feedback",
    },
    sections: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          name: { type: "STRING" as const },
          score: { type: "INTEGER" as const },
          feedback: { type: "STRING" as const },
          suggestions: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
        },
        required: ["name", "score", "feedback", "suggestions"],
      },
    },
    weak_bullets: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          original: { type: "STRING" as const },
          issue: { type: "STRING" as const },
          suggestion: { type: "STRING" as const },
          section: { type: "STRING" as const },
        },
        required: ["original", "issue", "suggestion", "section"],
      },
    },
    improvements: {
      type: "ARRAY" as const,
      items: { type: "STRING" as const },
    },
    missing_skills: {
      type: "ARRAY" as const,
      items: { type: "STRING" as const },
    },
  },
  required: [
    "ats_score",
    "overall_feedback",
    "sections",
    "weak_bullets",
    "improvements",
    "missing_skills",
  ],
};

export async function analyzeResume(
  input: { buffer?: Buffer; text?: string }
): Promise<Omit<ResumeAnalysis, "id" | "user_id" | "file_name" | "file_url" | "created_at">> {
  const prompt = `You are a world-class resume auditor and ATS (Applicant Tracking System) engineer for top software engineering companies (Google, Meta, Apple, high-growth startups).

Perform a thorough, fine-grained audit of this resume:
1. ATS Score (0-100): Evaluate keyword density, standard header detection, column clarity, and formatting parseability.
2. Section Breakdowns: Evaluate Contact Info, Executive Summary, Experience, Projects, Skills, and Education.
3. Weak Bullet Rewrites: Identify weak bullets (vague verbs, lack of numbers/metrics/impact) and provide production-ready XYZ formula rewrites ("Accomplished [X], as measured by [Y], by doing [Z]").
4. Identify critical missing industry skills and actionable improvements.`;

  // Multimodal Gemini 2.5 Input: Provide direct PDF inline bytes if available
  const contents = input.buffer
    ? [
        {
          inlineData: {
            data: input.buffer.toString("base64"),
            mimeType: "application/pdf",
          },
        },
        {
          text: prompt,
        },
      ]
    : [
        {
          text: `${prompt}\n\nResume Content:\n${input.text || ""}`,
        },
      ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: resumeResponseSchema,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from Gemini");
  }

  const result = JSON.parse(content);

  return {
    raw_text: input.text || "Direct PDF Multimodal Analysis",
    ats_score: result.ats_score,
    overall_feedback: result.overall_feedback,
    sections: result.sections as ResumeSection[],
    weak_bullets: result.weak_bullets as WeakBullet[],
    improvements: result.improvements,
    missing_skills: result.missing_skills,
  };
}
