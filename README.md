# 👁️ Persona

**Know exactly where you stand before you apply.**

Persona is an AI-powered career analysis platform built for software engineers. It deeply analyzes your professional footprint—from your resume to your GitHub and LinkedIn profiles—to give you a comprehensive interview readiness score and an actionable roadmap to improve.

![Persona Preview](public/preview.png) *(Preview image placeholder)*

## ✨ Features

- **📄 Resume Analysis**: Upload your PDF resume and get an ATS score, weak bullet points highlighted, and actionable improvements.
- **🐙 GitHub Analysis**: Analyze your repositories, commit activity, README quality, and project depth with a comprehensive score.
- **💼 LinkedIn Review**: Get instant feedback on your headline, about section, skills, and overall recruiter attractiveness.
- **🎯 Skill Gap Analysis**: Compare your current skills against target roles (e.g., Frontend, Backend, Fullstack) and get a personalized learning roadmap.
- **💬 AI Interview Prep**: Generate tailored interview questions based on your specific resume, projects, and target role.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI Engine**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js installed (v18 or higher recommended). You will also need a Supabase project and a Google Gemini API key.

### 1. Clone the repository
```bash
git clone https://github.com/Atharva0808/persona.git
cd persona
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Rename `.env.example` to `.env.local` and fill in your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Don't forget to add your `.env.local` variables to the Vercel project settings before deploying!

## 📄 License
This project is licensed under the MIT License.
