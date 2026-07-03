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

export async function analyzeSkillGap(
  currentSkills: string[],
  targetRole: TargetRole,
  userId: string
): Promise<Omit<SkillGapAnalysis, "id" | "user_id" | "created_at">> {
  const roleDescription = ROLE_DESCRIPTIONS[targetRole];

  const prompt = `You are a career advisor specializing in software engineering roles. Analyze the skill gap between a candidate's current skills and their target role.

Target role: ${roleDescription}
Current skills: ${currentSkills.join(", ")}
Analyze the gap and provide a learning roadmap.

Return a JSON object with this exact structure:
{
  "match_percentage": <number 0-100>,
  "required_skills": [
    {
      "skill": "<skill name>",
      "level": "beginner" | "intermediate" | "advanced" | "expert",
      "has_skill": <boolean>,
      "current_level": "none" | "beginner" | "intermediate" | "advanced" | "expert",
      "priority": "critical" | "important" | "nice_to_have"
    }
  ],
  "roadmap": [
    {
      "phase": <number 1-4>,
      "title": "<phase title>",
      "duration": "<e.g., 2-3 weeks>",
      "skills": ["<skill to learn>"],
      "resources": [
        {
          "title": "<resource name>",
          "url": "<url>",
          "type": "course" | "documentation" | "video" | "article" | "book"
        }
      ],
      "projects": ["<project idea to build>"]
    }
  ]
}

Provide 12-15 required skills and a 4-phase roadmap. Be specific and actionable.`;

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
    target_role: targetRole,
    current_skills: currentSkills,
    required_skills: result.required_skills as SkillRequirement[],
    match_percentage: result.match_percentage,
    roadmap: result.roadmap as RoadmapPhase[],
  };
}
