import { ai } from "@/lib/gemini";
import type {
  ResumeAnalysis,
  ResumeSection,
  WeakBullet,
} from "@/lib/types";

export async function analyzeResume(
  resumeText: string,
  userId: string
): Promise<Omit<ResumeAnalysis, "id" | "user_id" | "file_name" | "file_url" | "created_at">> {
  const prompt = `You are an expert resume analyst and ATS (Applicant Tracking System) specialist for software engineering roles. Analyze the given resume text thoroughly and provide a detailed analysis.

Analyze this resume:\n\n${resumeText}

Return a JSON object with exactly this structure:
{
  "ats_score": <number 0-100>,
  "overall_feedback": "<string with 2-3 sentences of overall feedback>",
  "sections": [
    {
      "name": "<section name e.g. Contact Info, Summary, Experience, Education, Skills, Projects>",
      "score": <number 0-100>,
      "feedback": "<specific feedback for this section>",
      "suggestions": ["<improvement suggestion 1>", "<improvement suggestion 2>"]
    }
  ],
  "weak_bullets": [
    {
      "original": "<the weak bullet point text>",
      "issue": "<what's wrong with it>",
      "suggestion": "<improved version>",
      "section": "<which section it's from>"
    }
  ],
  "improvements": ["<general improvement 1>", "<general improvement 2>"],
  "missing_skills": ["<missing skill 1>", "<missing skill 2>"]
}

Evaluation criteria:
- ATS compatibility (keyword optimization, formatting)
- Quantified achievements (numbers, metrics, percentages)
- Action verbs usage
- Technical skills relevance
- Project descriptions quality
- Education section completeness
- Contact information completeness
- Section organization
- Overall clarity and conciseness
- Missing standard sections`;

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
    raw_text: resumeText,
    ats_score: result.ats_score,
    overall_feedback: result.overall_feedback,
    sections: result.sections as ResumeSection[],
    weak_bullets: result.weak_bullets as WeakBullet[],
    improvements: result.improvements,
    missing_skills: result.missing_skills,
  };
}
