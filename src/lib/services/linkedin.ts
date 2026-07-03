import { ai } from "@/lib/gemini";
import type { LinkedInAnalysis, SectionAnalysis } from "@/lib/types";

export async function analyzeLinkedIn(
  profileData: {
    headline?: string;
    about?: string;
    experience?: string;
    skills?: string;
    featured?: string;
    profileUrl: string;
  },
  userId: string
): Promise<Omit<LinkedInAnalysis, "id" | "user_id" | "created_at">> {
  const prompt = `You are an expert LinkedIn profile optimizer for software engineers. Analyze each section of the LinkedIn profile and provide detailed feedback.

Analyze this LinkedIn profile:\n\nHeadline: ${profileData.headline || "Not provided"}\n\nAbout: ${profileData.about || "Not provided"}\n\nExperience: ${profileData.experience || "Not provided"}\n\nSkills: ${profileData.skills || "Not provided"}\n\nFeatured: ${profileData.featured || "Not provided"}

Return a JSON object with this exact structure:
{
  "score": <overall score 0-100>,
  "headline": {
    "score": <number 0-100>,
    "current": "<what they currently have or 'Not provided'>",
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "about": {
    "score": <number 0-100>,
    "current": "<summary or 'Not provided'>",
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "experience": {
    "score": <number 0-100>,
    "current": "<summary or 'Not provided'>",
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "skills": {
    "score": <number 0-100>,
    "current": "<summary or 'Not provided'>",
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "featured": {
    "score": <number 0-100>,
    "current": "<summary or 'Not provided'>",
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "recruiter_attractiveness": <number 0-100>,
  "recommendations": ["<overall rec 1>", "<overall rec 2>"]
}

Focus on:
- Keyword optimization for ATS and recruiter searches
- Professional tone and clarity
- Quantified achievements
- Industry-relevant skills
- Profile completeness
- Recruiter search visibility`;

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

  return {
    profile_url: profileData.profileUrl,
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
