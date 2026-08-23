import { ai } from "@/lib/gemini";
import type {
  ResumeAnalysis,
  GitHubAnalysis,
  LinkedInAnalysis,
  SkillGapAnalysis,
  PersonaCrossVectorSynthesis,
  CrossVectorDiscrepancy,
  VerifiedStrength,
  Blindspot,
  StrategicActionItem,
} from "@/lib/types";

const synthesisResponseSchema = {
  type: "OBJECT" as const,
  properties: {
    overall_synthesis_score: {
      type: "INTEGER" as const,
      description: "Aggregated readiness score (0-100) reflecting all verified signals",
    },
    readiness_verdict: {
      type: "STRING" as const,
      description: "Short executive verdict (e.g. 'Senior Ready - Strong Engineering Proof' or 'Mid-Level Competitive with Portfolio Discrepancies')",
    },
    executive_summary: {
      type: "STRING" as const,
      description: "2-3 sentences synthesizing the candidate's cross-vector profile strengths and gaps",
    },
    discrepancies: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          title: { type: "STRING" as const },
          severity: {
            type: "STRING" as const,
            enum: ["critical", "moderate", "minor"],
          },
          description: { type: "STRING" as const },
          vectors_involved: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
          fix_action: { type: "STRING" as const },
        },
        required: [
          "title",
          "severity",
          "description",
          "vectors_involved",
          "fix_action",
        ],
      },
    },
    verified_strengths: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          skill_or_trait: { type: "STRING" as const },
          proof_summary: { type: "STRING" as const },
          verified_across: {
            type: "ARRAY" as const,
            items: { type: "STRING" as const },
          },
        },
        required: ["skill_or_trait", "proof_summary", "verified_across"],
      },
    },
    blindspots: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          area: { type: "STRING" as const },
          consequence: { type: "STRING" as const },
          recommendation: { type: "STRING" as const },
        },
        required: ["area", "consequence", "recommendation"],
      },
    },
    strategic_action_plan: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          step: { type: "INTEGER" as const },
          focus: { type: "STRING" as const },
          timeline: { type: "STRING" as const },
          impact: { type: "STRING" as const },
        },
        required: ["step", "focus", "timeline", "impact"],
      },
    },
  },
  required: [
    "overall_synthesis_score",
    "readiness_verdict",
    "executive_summary",
    "discrepancies",
    "verified_strengths",
    "blindspots",
    "strategic_action_plan",
  ],
};

export async function synthesizePersonaVectors(data: {
  resume?: ResumeAnalysis | null;
  github?: GitHubAnalysis | null;
  linkedin?: LinkedInAnalysis | null;
  skills?: SkillGapAnalysis | null;
}): Promise<PersonaCrossVectorSynthesis> {
  const activeVectors: string[] = [];
  if (data.resume) activeVectors.push("Resume ATS");
  if (data.github) activeVectors.push("GitHub Activity");
  if (data.linkedin) activeVectors.push("LinkedIn Inbound");
  if (data.skills) activeVectors.push("Skill Gap Matrix");

  if (activeVectors.length === 0) {
    return {
      overall_synthesis_score: 0,
      readiness_verdict: "Awaiting Assessment Data",
      executive_summary: "Complete at least one assessment engine to generate your cross-vector persona intelligence audit.",
      discrepancies: [],
      verified_strengths: [],
      blindspots: [],
      strategic_action_plan: [],
      completed_vectors_count: 0,
    };
  }

  const prompt = `You are a Principal Engineering Hiring Partner and Staff Recruiter at top tech organizations.
Perform a Cross-Vector Discrepancy & Persona Synthesis across the candidate's available digital presence signals.

Data Sources Available (${activeVectors.length} vectors):
${data.resume ? `[RESUME ATS AUDIT]:
Score: ${data.resume.ats_score}/100
Feedback: ${data.resume.overall_feedback}
Missing Skills Identified: ${data.resume.missing_skills?.join(", ") || "None"}
Weak Bullets: ${JSON.stringify(data.resume.weak_bullets?.slice(0, 3) || [])}` : "[RESUME]: Not submitted yet"}

${data.github ? `[GITHUB REPO AUDIT]:
Score: ${data.github.score}/100
Languages: ${JSON.stringify(data.github.languages || {})}
Commits: ${data.github.commit_activity?.total_commits} commits (${data.github.commit_activity?.consistency})
Repos: ${data.github.repositories?.map((r) => `${r.name} (${r.language || "N/A"}) - Stars: ${r.stars}`).join(", ")}
Recommendations: ${data.github.recommendations?.join("; ")}` : "[GITHUB]: Not connected yet"}

${data.linkedin ? `[LINKEDIN REVIEW]:
Recruiter Magnet Score: ${data.linkedin.recruiter_attractiveness}/100
Headline: ${data.linkedin.headline?.current || "N/A"}
Recommendations: ${data.linkedin.recommendations?.join("; ")}` : "[LINKEDIN]: Not submitted yet"}

${data.skills ? `[SKILL GAP BENCHMARK]:
Target Role: ${data.skills.target_role}
Match: ${data.skills.match_percentage}%
Current Skills: ${data.skills.current_skills?.join(", ")}
Missing Critical Skills: ${data.skills.required_skills?.filter((s) => !s.has_skill && s.priority === "critical").map((s) => s.skill).join(", ")}` : "[SKILL GAP]: Not run yet"}

Task:
1. Cross-correlate all vectors to identify any discrepancies, exaggerated claims, or inconsistencies (e.g. claims on resume vs actual code on GitHub, LinkedIn headline vs skill readiness).
2. Highlight verified strengths (skills backed by multiple vectors).
3. Identify blindspots and deliver a chronological 3-4 step high-impact strategic action plan.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: synthesisResponseSchema,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from Gemini");
  }

  const result = JSON.parse(content);

  return {
    overall_synthesis_score: result.overall_synthesis_score,
    readiness_verdict: result.readiness_verdict,
    executive_summary: result.executive_summary,
    discrepancies: result.discrepancies as CrossVectorDiscrepancy[],
    verified_strengths: result.verified_strengths as VerifiedStrength[],
    blindspots: result.blindspots as Blindspot[],
    strategic_action_plan: result.strategic_action_plan as StrategicActionItem[],
    completed_vectors_count: activeVectors.length,
  };
}
