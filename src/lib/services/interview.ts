import { ai } from "@/lib/gemini";
import type {
  TargetRole,
  InterviewQuestion,
} from "@/lib/types";

export async function generateInterviewQuestions(
  context: {
    resumeText?: string;
    githubProjects?: string[];
    targetRole: TargetRole;
    skills?: string[];
    count?: number;
  },
): Promise<InterviewQuestion[]> {
  const roleMap: Record<TargetRole, string> = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    fullstack: "Full Stack Developer",
    ai_engineer: "AI/ML Engineer",
    data_scientist: "Data Scientist",
    devops: "DevOps Engineer",
    mobile: "Mobile Developer",
    cloud: "Cloud Engineer",
    cybersecurity: "Cybersecurity Engineer",
  };

  const questionCount = context.count || 5;

  const contextParts: string[] = [];
  if (context.resumeText) {
    contextParts.push(`Resume Context:\n${context.resumeText.slice(0, 1500)}`);
  }
  if (context.githubProjects?.length) {
    contextParts.push(
      `GitHub Projects:\n${context.githubProjects.join(", ")}`
    );
  }
  if (context.skills?.length) {
    contextParts.push(`Skills: ${context.skills.join(", ")}`);
  }

  const prompt = `You are a top-tier technical interviewer for ${roleMap[context.targetRole]} roles. Generate ${questionCount} concise, high-impact interview questions tailored to the candidate's background.

Target role: ${roleMap[context.targetRole]}
${contextParts.length > 0 ? `Candidate Profile:\n${contextParts.join("\n\n")}` : ""}

Return JSON with this exact structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "<concise, sharp interview question>",
      "category": "technical",
      "difficulty": "medium",
      "expected_answer": "<3 key points expected in answer>",
      "follow_ups": ["<follow-up question 1>"],
      "tips": ["<key tip>"]
    }
  ]
}

Generate exactly ${questionCount} questions covering HR/Behavioral, Core Role Technical, Project-based, and System Design.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from AI");
  }

  let result;
  try {
    result = JSON.parse(content);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
  return result.questions as InterviewQuestion[];
}
