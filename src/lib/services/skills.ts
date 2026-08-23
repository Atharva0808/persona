import { ai } from "@/lib/gemini";
import type {
  TargetRole,
  SkillGapAnalysis,
  SkillRequirement,
  RoadmapPhase,
} from "@/lib/types";

const ROLE_DESCRIPTIONS: Record<TargetRole, string> = {
  frontend: "Frontend Developer - React, Vue, Angular, TypeScript, CSS, responsive design, state management, testing",
  backend: "Backend Developer - Node.js, Python, Java, Go, REST APIs, GraphQL, databases, microservices, system design",
  fullstack: "Full Stack Developer - Frontend + Backend skills, deployment, DevOps basics, end-to-end development",
  ai_engineer: "AI/ML Engineer - Python, TensorFlow/PyTorch, NLP, computer vision, data pipelines, MLOps, LLMs",
  data_scientist: "Data Scientist - Python, R, statistics, machine learning, data visualization, SQL, experimentation",
  devops: "DevOps Engineer - CI/CD, Docker, Kubernetes, AWS/GCP/Azure, Terraform, monitoring, Linux",
  mobile: "Mobile Developer - React Native, Flutter, Swift, Kotlin, mobile UX, app stores, push notifications",
  cloud: "Cloud Engineer - AWS/GCP/Azure, serverless, infrastructure, networking, security, cost optimization",
  cybersecurity: "Cybersecurity Engineer - Network security, penetration testing, cryptography, compliance, incident response",
};

const skillGapResponseSchema = {
  type: "OBJECT" as const,
  properties: {
    match_percentage: {
      type: "INTEGER" as const,
      description: "Match percentage between 0 and 100",
    },
    required_skills: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          skill: { type: "STRING" as const },
          level: {
            type: "STRING" as const,
            enum: ["beginner", "intermediate", "advanced", "expert"],
          },
          has_skill: { type: "BOOLEAN" as const },
          current_level: {
            type: "STRING" as const,
            enum: ["none", "beginner", "intermediate", "advanced", "expert"],
          },
          priority: {
            type: "STRING" as const,
            enum: ["critical", "important", "nice_to_have"],
          },
        },
        required: ["skill", "level", "has_skill", "current_level", "priority"],
      },
    },
    roadmap: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          phase: { type: "INTEGER" as const },
          title: { type: "STRING" as const },
          duration: { type: "STRING" as const },
          skills: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
          resources: {
            type: "ARRAY" as const,
            items: {
              type: "OBJECT" as const,
              properties: {
                title: { type: "STRING" as const },
                url: { type: "STRING" as const },
                type: {
                  type: "STRING" as const,
                  enum: ["course", "documentation", "video", "article", "book"],
                },
              },
              required: ["title", "url", "type"],
            },
          },
          projects: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
        },
        required: ["phase", "title", "duration", "skills", "resources", "projects"],
      },
    },
  },
  required: ["match_percentage", "required_skills", "roadmap"],
};

export async function analyzeSkillGap(
  currentSkills: string[],
  targetRole: TargetRole
): Promise<Omit<SkillGapAnalysis, "id" | "user_id" | "created_at">> {
  const roleDescription = ROLE_DESCRIPTIONS[targetRole];

  const prompt = `You are a principal tech career advisor and engineering mentor.
Analyze the skill gap between a candidate's current skills and their target role.

Target role: ${roleDescription}
Current skills: ${currentSkills.join(", ")}
Analyze the gap and provide a 4-phase structured learning roadmap with 10-15 specific required skill benchmarks.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: skillGapResponseSchema,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from Gemini");
  }

  const result = JSON.parse(content);

  return {
    target_role: targetRole,
    current_skills: currentSkills,
    required_skills: result.required_skills as SkillRequirement[],
    match_percentage: result.match_percentage,
    roadmap: result.roadmap as RoadmapPhase[],
  };
}
