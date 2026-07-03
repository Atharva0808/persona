import { ai } from "@/lib/gemini";
import type {
  TargetRole,
  InterviewQuestion,
  QuestionCategory,
} from "@/lib/types";

export async function generateInterviewQuestions(
  context: {
    resumeText?: string;
    githubProjects?: string[];
    targetRole: TargetRole;
    skills?: string[];
  },
  userId: string
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

  const contextParts: string[] = [];
  if (context.resumeText) {
    contextParts.push(`Resume:\n${context.resumeText.slice(0, 3000)}`);
  }
  if (context.githubProjects?.length) {
    contextParts.push(
      `GitHub Projects:\n${context.githubProjects.join(", ")}`
    );
  }
  if (context.skills?.length) {
    contextParts.push(`Skills: ${context.skills.join(", ")}`);
  }

  const prompt = `You are an expert technical interviewer for ${roleMap[context.targetRole]} positions. Generate a comprehensive set of interview questions personalized to the candidate's background.

Target role: ${roleMap[context.targetRole]}

${contextParts.join("\n\n")}

Return a JSON object with this structure:
{
  "questions": [
    {
      "id": "<unique string id>",
      "question": "<the interview question>",
      "category": "hr" | "technical" | "project_based" | "frontend" | "backend" | "database" | "behavioral" | "system_design",
      "difficulty": "easy" | "medium" | "hard",
      "expected_answer": "<key points the interviewer expects>",
      "follow_ups": ["<follow-up question 1>", "<follow-up question 2>"],
      "tips": ["<tip for answering>"]
    }
  ]
}

Generate exactly 20 questions with this distribution:
- 3 HR questions
- 4 technical questions (role-specific)
- 3 project-based questions (personalized to their projects)
- 2 frontend/backend specific
- 2 database questions
- 3 behavioral questions
- 3 system design questions

Make questions specific and relevant to their actual experience and projects where possible.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.5,
      responseMimeType: "application/json",
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from AI");
  }

  const result = JSON.parse(content);
  return result.questions as InterviewQuestion[];
}
