// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Resume ──────────────────────────────────────────────────────────────────

export interface ResumeAnalysis {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  raw_text: string;
  ats_score: number;
  overall_feedback: string;
  sections: ResumeSection[];
  weak_bullets: WeakBullet[];
  improvements: string[];
  missing_skills: string[];
  created_at: string;
}

export interface ResumeSection {
  name: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface WeakBullet {
  original: string;
  issue: string;
  suggestion: string;
  section: string;
}

// ─── GitHub ──────────────────────────────────────────────────────────────────

export interface GitHubAnalysis {
  id: string;
  user_id: string;
  username: string;
  score: number;
  profile: GitHubProfile;
  repositories: GitHubRepo[];
  languages: Record<string, number>;
  commit_activity: CommitActivity;
  recommendations: string[];
  created_at: string;
}

export interface GitHubProfile {
  name: string;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  has_readme: boolean;
  readme_quality: "excellent" | "good" | "needs_improvement" | "missing";
  last_updated: string;
  topics: string[];
  score: number;
}

export interface CommitActivity {
  total_commits: number;
  avg_per_week: number;
  streak: number;
  consistency: "excellent" | "good" | "inconsistent" | "sparse";
}

// ─── LinkedIn ────────────────────────────────────────────────────────────────

export interface LinkedInAnalysis {
  id: string;
  user_id: string;
  profile_url: string;
  score: number;
  headline: SectionAnalysis;
  about: SectionAnalysis;
  experience: SectionAnalysis;
  skills: SectionAnalysis;
  featured: SectionAnalysis;
  recruiter_attractiveness: number;
  recommendations: string[];
  created_at: string;
}

export interface SectionAnalysis {
  score: number;
  current: string;
  feedback: string;
  suggestions: string[];
}

// ─── Skill Gap ───────────────────────────────────────────────────────────────

export type TargetRole =
  | "frontend"
  | "backend"
  | "fullstack"
  | "ai_engineer"
  | "data_scientist"
  | "devops"
  | "mobile"
  | "cloud"
  | "cybersecurity";

export interface SkillGapAnalysis {
  id: string;
  user_id: string;
  target_role: TargetRole;
  current_skills: string[];
  required_skills: SkillRequirement[];
  match_percentage: number;
  roadmap: RoadmapPhase[];
  created_at: string;
}

export interface SkillRequirement {
  skill: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  has_skill: boolean;
  current_level: "none" | "beginner" | "intermediate" | "advanced" | "expert";
  priority: "critical" | "important" | "nice_to_have";
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  skills: string[];
  resources: Resource[];
  projects: string[];
}

export interface Resource {
  title: string;
  url: string;
  type: "course" | "documentation" | "video" | "article" | "book";
}

// ─── Interview ───────────────────────────────────────────────────────────────

export type QuestionCategory =
  | "hr"
  | "technical"
  | "project_based"
  | "frontend"
  | "backend"
  | "database"
  | "behavioral"
  | "system_design";

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: "easy" | "medium" | "hard";
  expected_answer: string;
  follow_ups: string[];
  tips: string[];
}

export interface InterviewSession {
  id: string;
  user_id: string;
  role: TargetRole;
  questions: InterviewQuestion[];
  created_at: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardData {
  resume_score: number | null;
  github_score: number | null;
  linkedin_score: number | null;
  skill_match: number | null;
  recent_analyses: RecentAnalysis[];
  overall_readiness: number;
}

export interface RecentAnalysis {
  type: "resume" | "github" | "linkedin" | "skills" | "interview";
  title: string;
  score: number | null;
  date: string;
}
