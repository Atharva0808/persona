import { ai } from "@/lib/gemini";
import type { LinkedInAnalysis, SectionAnalysis } from "@/lib/types";

const sectionSchema = {
  type: "OBJECT" as const,
  properties: {
    score: { type: "INTEGER" as const },
    current: { type: "STRING" as const },
    feedback: { type: "STRING" as const },
    suggestions: {
      type: "ARRAY" as const,
      items: { type: "STRING" as const },
    },
  },
  required: ["score", "current", "feedback", "suggestions"],
};

const linkedInResponseSchema = {
  type: "OBJECT" as const,
  properties: {
    score: { type: "INTEGER" as const },
    headline: sectionSchema,
    about: sectionSchema,
    experience: sectionSchema,
    skills: sectionSchema,
    featured: sectionSchema,
    recruiter_attractiveness: { type: "INTEGER" as const },
    recommendations: {
      type: "ARRAY" as const,
      items: { type: "STRING" as const },
    },
  },
  required: [
    "score",
    "headline",
    "about",
    "experience",
    "skills",
    "featured",
    "recruiter_attractiveness",
    "recommendations",
  ],
};

export async function analyzeLinkedIn(
  input: {
    pdfBuffer?: Buffer;
    headline?: string;
    about?: string;
    experience?: string;
    skills?: string;
    featured?: string;
    profileUrl: string;
  }
): Promise<Omit<LinkedInAnalysis, "id" | "user_id" | "created_at">> {
  const prompt = `You are a high-level executive tech recruiter and LinkedIn algorithm specialist.
Analyze this LinkedIn profile for recruiter search discoverability, magnetic headlines, metric-driven experience impact, and keyword endorsement rank.

Evaluate:
- Headline (Keywords, Role Target, Value Proposition)
- About Summary (Storytelling, Tech Stack, Accomplishments)
- Experience (Impact metrics, Action verbs, Technical leadership)
- Skills (Critical keywords, Tech stack relevance)
- Featured Content (Projects, Repositories, Publications)
- Recruiter Inbound Attractiveness Score (0-100)`;

  const contents = input.pdfBuffer
    ? [
        {
          inlineData: {
            data: input.pdfBuffer.toString("base64"),
            mimeType: "application/pdf",
          },
        },
        {
          text: prompt,
        },
      ]
    : [
        {
          text: `${prompt}\n\nLinkedIn Data:\nHeadline: ${input.headline || "Not provided"}\nAbout: ${input.about || "Not provided"}\nExperience: ${input.experience || "Not provided"}\nSkills: ${input.skills || "Not provided"}\nFeatured: ${input.featured || "Not provided"}`,
        },
      ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: linkedInResponseSchema,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from Gemini");
  }

  const result = JSON.parse(content);

  return {
    profile_url: input.profileUrl,
    score: result.score,
    headline: result.headline as SectionAnalysis,
    about: result.about as SectionAnalysis,
    experience: result.experience as SectionAnalysis,
    skills: result.skills as SectionAnalysis,
    featured: result.featured as SectionAnalysis,
    recruiter_attractiveness: result.recruiter_attractiveness,
    recommendations: result.recommendations,
  };
}
