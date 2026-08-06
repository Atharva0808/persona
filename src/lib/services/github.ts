import { ai } from "@/lib/gemini";
import type {
  GitHubAnalysis,
  GitHubProfile,
  GitHubRepo,
  CommitActivity,
} from "@/lib/types";

const GITHUB_API = "https://api.github.com";

async function githubFetch(path: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`${GITHUB_API}${path}`, { headers });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("GitHub user not found. Please check the username.");
    }
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later or configure a GITHUB_TOKEN.");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function fetchProfile(username: string): Promise<GitHubProfile> {
  const data = await githubFetch(`/users/${username}`);
  return {
    name: data.name || username,
    bio: data.bio,
    avatar_url: data.avatar_url,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at,
  };
}

async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const data = await githubFetch(
    `/users/${username}/repos?sort=updated&per_page=15&type=owner`
  );

  const repos: GitHubRepo[] = [];
  const topRepos = data.filter((r: { fork: boolean }) => !r.fork).slice(0, 5);

  // Fetch READMEs only for top 3 repos to preserve API quota
  for (let i = 0; i < topRepos.length; i++) {
    const repo = topRepos[i];
    let hasReadme = false;
    let readmeQuality: GitHubRepo["readme_quality"] = "missing";

    if (i < 3) {
      try {
        const readmeRes = await githubFetch(
          `/repos/${username}/${repo.name}/readme`
        );
        if (readmeRes) {
          hasReadme = true;
          const content = Buffer.from(readmeRes.content, "base64").toString("utf-8");
          const length = content.length;
          if (length > 2000) readmeQuality = "excellent";
          else if (length > 500) readmeQuality = "good";
          else readmeQuality = "needs_improvement";
        }
      } catch {
        hasReadme = false;
        readmeQuality = "missing";
      }
    } else {
      // Heuristic fallback for remaining repos
      hasReadme = Boolean(repo.description);
      readmeQuality = repo.description ? "good" : "missing";
    }

    let repoScore = 0;
    if (repo.description) repoScore += 15;
    if (hasReadme) repoScore += 20;
    if (readmeQuality === "excellent") repoScore += 20;
    else if (readmeQuality === "good") repoScore += 10;
    if (repo.stargazers_count > 0) repoScore += Math.min(repo.stargazers_count * 2, 20);
    if (repo.topics?.length > 0) repoScore += Math.min(repo.topics.length * 3, 15);
    if (repo.language) repoScore += 10;
    repoScore += Math.min(repo.forks_count * 3, 15);

    repos.push({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      has_readme: hasReadme,
      readme_quality: readmeQuality,
      last_updated: repo.updated_at,
      topics: repo.topics || [],
      score: Math.min(repoScore, 100),
    });
  }

  return repos;
}

async function fetchCommitActivity(
  username: string
): Promise<CommitActivity> {
  try {
    const events = await githubFetch(
      `/users/${username}/events?per_page=30`
    );

    const pushEvents = events.filter(
      (e: { type: string }) => e.type === "PushEvent"
    );
    const totalCommits = pushEvents.reduce(
      (sum: number, e: { payload: { commits: unknown[] } }) =>
        sum + (e.payload?.commits?.length || 0),
      0
    );

    const avgPerWeek = Math.round(totalCommits / 4);

    let consistency: CommitActivity["consistency"] = "sparse";
    if (avgPerWeek >= 15) consistency = "excellent";
    else if (avgPerWeek >= 7) consistency = "good";
    else if (avgPerWeek >= 3) consistency = "inconsistent";

    return {
      total_commits: totalCommits,
      avg_per_week: avgPerWeek,
      streak: Math.min(pushEvents.length, 30),
      consistency,
    };
  } catch {
    return {
      total_commits: 0,
      avg_per_week: 0,
      streak: 0,
      consistency: "sparse",
    };
  }
}

function extractLanguages(repos: GitHubRepo[]): Record<string, number> {
  const langs: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langs[repo.language] = (langs[repo.language] || 0) + 1;
    }
  }
  return langs;
}

export async function analyzeGitHub(
  username: string
): Promise<
  Omit<GitHubAnalysis, "id" | "user_id" | "created_at">
> {
  const [profile, repos, commitActivity] = await Promise.all([
    fetchProfile(username),
    fetchRepos(username),
    fetchCommitActivity(username),
  ]);

  const languages = extractLanguages(repos);

  let score = 0;
  const avgRepoScore =
    repos.length > 0
      ? repos.reduce((sum, r) => sum + r.score, 0) / repos.length
      : 0;

  score += avgRepoScore * 0.4;
  score +=
    commitActivity.consistency === "excellent"
      ? 25
      : commitActivity.consistency === "good"
      ? 18
      : commitActivity.consistency === "inconsistent"
      ? 10
      : 5;
  score += Math.min(profile.public_repos * 1.5, 15);
  score += Math.min(Object.keys(languages).length * 3, 15);
  score += profile.bio ? 5 : 0;

  score = Math.round(Math.min(score, 100));

  const prompt = `You are a GitHub profile advisor for software engineers seeking jobs. Analyze the profile data and provide 5-8 specific, actionable recommendations. Return as JSON: { "recommendations": ["rec1", "rec2", ...] }\n\nData:\n${JSON.stringify({
    profile,
    repoCount: repos.length,
    topRepos: repos.slice(0, 5).map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stars,
      readme_quality: r.readme_quality,
      topics: r.topics,
    })),
    languages,
    commitActivity,
    score,
  })}`;

  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const aiContent = aiResponse.text;
  let recommendations: string[];
  try {
    recommendations = aiContent
      ? JSON.parse(aiContent).recommendations
      : ["Add detailed READMEs to all projects", "Increase commit frequency"];
  } catch {
    recommendations = ["Add detailed READMEs to all projects", "Increase commit frequency"];
  }

  return {
    username,
    score,
    profile,
    repositories: repos,
    languages,
    commit_activity: commitActivity,
    recommendations,
  };
}
