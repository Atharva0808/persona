import { ai } from "@/lib/gemini";
import type {
  TargetRole,
  InterviewQuestion,
} from "@/lib/types";

const questionsResponseSchema = {
  type: "OBJECT" as const,
  properties: {
    questions: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          id: { type: "STRING" as const },
          question: { type: "STRING" as const },
          category: {
            type: "STRING" as const,
            enum: ["technical", "behavioral", "system_design", "project_deep_dive"],
          },
          difficulty: {
            type: "STRING" as const,
            enum: ["easy", "medium", "hard"],
          },
          expected_answer: { type: "STRING" as const },
          follow_ups: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
          tips: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
        },
        required: [
          "id",
          "question",
          "category",
          "difficulty",
          "expected_answer",
          "follow_ups",
          "tips",
        ],
      },
    },
  },
  required: ["questions"],
};

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

  const prompt = `You are a principal engineering hiring manager conducting technical interviews for ${roleMap[context.targetRole]} roles.
Generate ${questionCount} tailored, challenging interview questions based on the candidate's cross-vector profile.

Target role: ${roleMap[context.targetRole]}
${contextParts.length > 0 ? `Candidate Profile Context:\n${contextParts.join("\n\n")}` : ""}

Generate exactly ${questionCount} questions covering core architecture, specific project decisions, algorithmic trade-offs, and behavioral ownership.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: questionsResponseSchema,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from Gemini");
  }

  const result = JSON.parse(content);
  return result.questions as InterviewQuestion[];
}
