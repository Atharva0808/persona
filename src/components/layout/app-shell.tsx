"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Engineering Dashboard",
    subtitle: "Interview readiness & assessment suite",
  },
  "/resume": {
    title: "Resume ATS Audit",
    subtitle: "PDF parsing, ATS scoring & bullet rewrites",
  },
  "/github": {
    title: "GitHub Repository Audit",
    subtitle: "Commit activity, README depth & code health",
  },
  "/linkedin": {
    title: "LinkedIn Profile Review",
    subtitle: "Headline optimization & recruiter magnet score",
  },
  "/skills": {
    title: "Skill Gap Analysis",
    subtitle: "Engineering track benchmarks & roadmap",
  },
  "/interview": {
    title: "AI Technical Mock Prep",
    subtitle: "Tailored mock interview questions & evaluation",
  },
  "/settings": {
    title: "Account Settings",
    subtitle: "Manage your profile and credentials",
  },
};

export function AppShell({ children, user }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const currentInfo = pageTitles[pathname] || {
    title: "Persona Workspace",
    subtitle: "Candidate readiness evaluation",
  };

  return (
    <div className="flex h-screen bg-[#F4F7F4] text-[#111827] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        user={user}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        onSignOut={handleSignOut}
      />

      {/* Main Content & Top Header Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Clean Header Bar */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-[#E5EBE5] bg-white/80 backdrop-blur-md shrink-0">
          {/* Breadcrumb / Context Label */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#113D2B] font-[family-name:var(--font-display)]">
              Persona
            </span>
            <span className="text-[#9CA3AF]">/</span>
            <span className="font-semibold text-[#111827]">{currentInfo.title}</span>
          </div>

          {/* Right User Profile Pill */}
          {user && (
            <div className="flex items-center gap-3 pl-2 pr-4 py-1 rounded-full bg-white border border-[#E5EBE5] shadow-2xs">
              <Avatar className="h-7 w-7 border border-[#E5EBE5]">
                {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                <AvatarFallback className="text-[11px] bg-[#EAF5EE] text-[#113D2B] font-bold font-mono">
                  {getInitials(user.full_name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#111827] leading-tight">
                  {user.full_name || user.email.split("@")[0]}
                </span>
                <span className="text-[10px] text-[#9CA3AF] font-mono leading-tight">
                  {user.email}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
