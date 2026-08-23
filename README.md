# Persona

Persona is a technical readiness diagnostic platform for software engineers. It benchmarks your candidate footprint—resume ATS parsing, public GitHub commit & repository depth, LinkedIn recruiter keyword density, and technical skill gaps across 9 engineering tracks—to identify exact failure points before you apply.

---

## System Architecture

```
                                 ┌─────────────────────────┐
                                 │   Next.js 16 App Shell  │
                                 │ (React 19 / TypeScript) │
                                 └────────────┬────────────┘
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     ▼                        ▼                        ▼
          ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
          │  Supabase Auth & DB │  │   Upstash Redis     │  │   Gemini 2.5 Flash  │
          │ (PostgreSQL + RLS)  │  │   (Response Cache)  │  │ (Strict JSON Schema)│
          └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

Persona leverages **Gemini 2.5 Flash** with strict JSON schemas (`responseSchema`) and native binary document ingestion to guarantee zero JSON parsing errors and evaluate multi-column resumes without line-scrambling.

---

## Core Diagnostic Engines

### 1. Resume ATS Audit (`/resume`)
- **Direct PDF Processing**: Streams raw PDF binary data directly to Gemini 2.5 Flash for spatial and visual layout understanding (preserving 2-column formatting and tables).
- **ATS Keyword Matching**: Identifies missing technical stack keywords required by modern applicant tracking systems.
- **XYZ-Formula Bullet Rewrites**: Flags passive or weak bullet points and generates quantifiable alternatives following the Google XYZ standard (*"Accomplished [X], as measured by [Y], by doing [Z]"*).

### 2. GitHub Repository Audit (`/github`)
- **Commit Velocity & Consistency**: Evaluates commit streaks, weekly cadence, and contribution patterns.
- **Documentation & Architecture Quality**: Parses repository READMEs for architectural clarity, setup instructions, and project depth.
- **Language Distribution**: Maps your real codebase composition against claimed experience.

### 3. LinkedIn Profile Review (`/linkedin`)
- **PDF Export Ingestion & Manual Input**: Ingests standard LinkedIn PDF profile exports or structured form data.
- **Recruiter Search Ranking**: Audits headline keyword density and search discoverability for inbound recruiter pipelines.
- **Section Diagnostics**: Delivers targeted recommendations for Headline, About summary, Experience bullet points, and Endorsement keywords.

### 4. Skill Gap Benchmark (`/skills`)
- **9 Engineering Tracks**: Frontend, Backend, Full Stack, AI/ML, Data Science, DevOps, Mobile, Cloud, and Cybersecurity.
- **Role Alignment Scoring**: Computes match percentage based on critical vs. optional requirements.
- **4-Phase Learning Roadmap**: Generates a structured sequence of milestones with recommended documentation and practical capstone projects.

### 5. Interactive Mock Interview (`/interview`)
- **Profile-Tailored Questions**: Generates 20 interview questions spanning System Design, Architecture, Project Deep Dives, and Behavioral ownership.
- **Real-Time Evaluation**: Submits candidate answers to an evaluation model that returns an objective score (0–100), key strengths, missing technical concepts, and an ideal reference response.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (Turbopack, App Router) |
| **Runtime & Language** | Node.js 20+ / TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Framer Motion |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security) |
| **Caching Layer** | Upstash Redis (with In-Memory Fallback) |
| **AI Diagnostics** | Google Gemini 2.5 Flash SDK (`@google/genai`) |

---

## Project Structure

```
persona/
├── src/
│   ├── app/
│   │   ├── (app)/               # Authenticated application shell
│   │   │   ├── dashboard/       # Central readiness dashboard
│   │   │   ├── resume/          # Resume ATS audit workspace
│   │   │   ├── github/          # GitHub profile & repository audit
│   │   │   ├── linkedin/        # LinkedIn recruiter search review
│   │   │   ├── skills/          # Skill gap matrix & roadmap
│   │   │   ├── interview/       # Interactive mock interview room
│   │   │   └── settings/        # Account & profile settings
│   │   ├── api/                 # Secure serverless API routes
│   │   │   ├── resume/analyze/
│   │   │   ├── github/analyze/
│   │   │   ├── linkedin/analyze/
│   │   │   ├── skills/analyze/
│   │   │   ├── interview/generate/
│   │   │   └── interview/evaluate/
│   │   ├── login/               # Supabase authentication
│   │   ├── signup/
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── layout/              # Sidebar, AppShell, Header
│   │   └── ui/                  # Design system primitives
│   └── lib/
│       ├── gemini.ts            # Google GenAI client configuration
│       ├── redis.ts             # Upstash Redis & fallback cache
│       ├── types.ts             # Global TypeScript definitions
│       ├── services/            # Pure LLM orchestration services
│       └── supabase/            # Client, Server, and Middleware helpers
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites
- Node.js `20.x` or higher
- npm or pnpm
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API Key (Gemini 2.5 Flash)

### 1. Clone & Install

```bash
git clone https://github.com/Atharva0808/persona.git
cd persona
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your service credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# GitHub (Optional: increases rate limits from 60 to 5,000 req/hr)
GITHUB_TOKEN=your_github_personal_access_token

# Upstash Redis (Optional: defaults to in-memory cache if omitted)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Schema

Run the following tables in your Supabase SQL Editor:

```sql
-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Resume Analyses
create table public.resume_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_url text,
  raw_text text,
  ats_score integer not null,
  overall_feedback text not null,
  sections jsonb not null default '[]'::jsonb,
  weak_bullets jsonb not null default '[]'::jsonb,
  improvements text[] default array[]::text[],
  missing_skills text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GitHub Analyses
create table public.github_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  username text not null,
  score integer not null,
  profile jsonb not null default '{}'::jsonb,
  repositories jsonb not null default '[]'::jsonb,
  languages jsonb not null default '{}'::jsonb,
  commit_activity jsonb not null default '{}'::jsonb,
  recommendations text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LinkedIn Analyses
create table public.linkedin_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  profile_url text not null,
  score integer not null,
  headline jsonb not null default '{}'::jsonb,
  about jsonb not null default '{}'::jsonb,
  experience jsonb not null default '{}'::jsonb,
  skills jsonb not null default '{}'::jsonb,
  featured jsonb not null default '{}'::jsonb,
  recruiter_attractiveness integer not null,
  recommendations text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skill Gap Analyses
create table public.skill_gap_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  target_role text not null,
  current_skills text[] default array[]::text[],
  required_skills jsonb not null default '[]'::jsonb,
  match_percentage integer not null,
  roadmap jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.resume_analyses enable row level security;
alter table public.github_analyses enable row level security;
alter table public.linkedin_analyses enable row level security;
alter table public.skill_gap_analyses enable row level security;

-- Create RLS Policies
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can manage their resume analyses" on public.resume_analyses for all using (auth.uid() = user_id);
create policy "Users can manage their github analyses" on public.github_analyses for all using (auth.uid() = user_id);
create policy "Users can manage their linkedin analyses" on public.linkedin_analyses for all using (auth.uid() = user_id);
create policy "Users can manage their skill analyses" on public.skill_gap_analyses for all using (auth.uid() = user_id);
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to access the application.

---

## Verification & Build

To test TypeScript compilation and run the linter:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
