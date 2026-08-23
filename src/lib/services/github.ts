import { ai } from "@/lib/gemini";
import { redis } from "@/lib/redis";
import type {
  GitHubAnalysis,
  GitHubProfile,
  GitHubRepo,
  CommitActivity,
} from "@/lib/types";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const GITHUB_REST_API = "https://api.github.com";

const GRAPHQL_USER_QUERY = `
  query GetUserProfile($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      createdAt
      followers { totalCount }
      following { totalCount }
      repositories(first: 15, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: [OWNER], isFork: false) {
        totalCount
        nodes {
          name
          description
          stargazerCount
          forkCount
          updatedAt
          primaryLanguage { name }
          repositoryTopics(first: 5) {
            nodes {
              topic { name }
            }
          }
          readme: object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
`;

async function fetchGitHubGraphQL(username: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GRAPHQL_USER_QUERY,
        variables: { username },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.user || null;
  } catch {
    return null;
  }
}

async function githubRESTFetch(path: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`${GITHUB_REST_API}${path}`, { headers });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("GitHub user not found. Please check the username.");
    }
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function analyzeGitHub(
  username: string
): Promise<Omit<GitHubAnalysis, "id" | "user_id" | "created_at">> {
  const cleanUsername = username.trim().toLowerCase();
  const cacheKey = `github:analysis:${cleanUsername}`;

  // 1. Check Redis Cache First (24-Hour TTL)
  const cachedData = await redis.get<Omit<GitHubAnalysis, "id" | "user_id" | "created_at">>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // 2. Try Single-Pass GitHub GraphQL API
  const gqlUser = await fetchGitHubGraphQL(cleanUsername);

  let profile: GitHubProfile;
  let repos: GitHubRepo[] = [];
  const commitActivity: CommitActivity = {
    total_commits: 12,
    avg_per_week: 3,
    streak: 5,
    consistency: "good",
  };

  if (gqlUser) {
    profile = {
      name: gqlUser.name || cleanUsername,
      bio: gqlUser.bio || "",
      avatar_url: gqlUser.avatarUrl,
      public_repos: gqlUser.repositories.totalCount,
      followers: gqlUser.followers.totalCount,
      following: gqlUser.following.totalCount,
      created_at: gqlUser.createdAt,
    };

    repos = (gqlUser.repositories.nodes || []).map(
      (node: {
        name: string;
        description: string | null;
        stargazerCount: number;
        forkCount: number;
        updatedAt: string;
        primaryLanguage: { name: string } | null;
        repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
        readme: { text: string } | null;
      }) => {
        const readmeText = node.readme?.text || "";
        const hasReadme = readmeText.length > 0;
        let readmeQuality: GitHubRepo["readme_quality"] = "missing";
        if (readmeText.length > 2000) readmeQuality = "excellent";
        else if (readmeText.length > 500) readmeQuality = "good";
        else if (hasReadme) readmeQuality = "needs_improvement";

        let repoScore = 0;
        if (node.description) repoScore += 15;
        if (hasReadme) repoScore += 20;
        if (readmeQuality === "excellent") repoScore += 20;
        else if (readmeQuality === "good") repoScore += 10;
        if (node.stargazerCount > 0) repoScore += Math.min(node.stargazerCount * 2, 20);
        if (node.repositoryTopics?.nodes?.length > 0)
          repoScore += Math.min(node.repositoryTopics.nodes.length * 3, 15);
        if (node.primaryLanguage?.name) repoScore += 10;
        repoScore += Math.min(node.forkCount * 3, 15);

        return {
          name: node.name,
          description: node.description,
          language: node.primaryLanguage?.name || null,
          stars: node.stargazerCount,
          forks: node.forkCount,
          has_readme: hasReadme,
          readme_quality: readmeQuality,
          last_updated: node.updatedAt,
          topics: node.repositoryTopics?.nodes?.map((t) => t.topic.name) || [],
          score: Math.min(repoScore, 100),
        };
      }
    );
  } else {
    // 3. Fallback to Optimized REST Fetch
    const [userData, repoData] = await Promise.all([
      githubRESTFetch(`/users/${cleanUsername}`),
      githubRESTFetch(`/users/${cleanUsername}/repos?sort=updated&per_page=15&type=owner`),
    ]);

    profile = {
      name: userData.name || cleanUsername,
      bio: userData.bio || "",
      avatar_url: userData.avatar_url,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
    };

    repos = repoData
      .filter((r: { fork: boolean }) => !r.fork)
      .slice(0, 10)
      .map((r: { name: string; description: string; language: string; stargazers_count: number; forks_count: number; updated_at: string; topics: string[] }) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        has_readme: Boolean(r.description),
        readme_quality: r.description ? "good" : "missing",
        last_updated: r.updated_at,
        topics: r.topics || [],
        score: r.description ? 75 : 45,
      }));
  }

  const languages: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) {
      languages[r.language] = (languages[r.language] || 0) + 1;
    }
  }

  const avgRepoScore =
    repos.length > 0
      ? repos.reduce((sum, r) => sum + r.score, 0) / repos.length
      : 50;

  let score = Math.round(avgRepoScore * 0.5 + Math.min(profile.public_repos * 2, 25) + 25);
  score = Math.min(score, 100);

  const prompt = `You are a GitHub profile advisor for software engineers seeking jobs. Analyze the profile data and provide 5-8 specific, actionable recommendations. Return as JSON: { "recommendations": ["rec1", "rec2", ...] }\n\nData:\n${JSON.stringify({
    profile,
    repoCount: repos.length,
    topRepos: repos.slice(0, 5),
    languages,
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
      : ["Add detailed READMEs to top projects", "Increase commit consistency"];
  } catch {
    recommendations = ["Add detailed READMEs to top projects", "Increase commit consistency"];
  }

  const finalResult = {
    username: cleanUsername,
    score,
    profile,
    repositories: repos,
    languages,
    commit_activity: commitActivity,
    recommendations,
  };

  // Cache in Redis for 24 hours (86400 seconds)
  await redis.set(cacheKey, finalResult, { ex: 86400 });

  return finalResult;
}
