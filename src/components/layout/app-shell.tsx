"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Mail, Command } from "lucide-react";
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

export function AppShell({ children, user }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
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
        {/* Top Navbar Header (Donezo Style) */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-[#E5EBE5] bg-white/70 backdrop-blur-md shrink-0">
          {/* Search Pill */}
          <div className="relative w-full max-w-md">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F4F7F4] border border-[#E2E8E2] text-sm text-[#6B7280] focus-within:border-[#113D2B] focus-within:bg-white transition-all shadow-inner">
              <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              <input
                type="text"
                placeholder="Search evaluation, engine or metric..."
                className="w-full bg-transparent border-none outline-none text-xs text-[#111827] placeholder:text-[#9CA3AF]"
              />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-[#E2E8E2] text-[10px] font-mono text-[#6B7280] shrink-0 shadow-2xs">
                <Command className="w-2.5 h-2.5" />F
              </div>
            </div>
          </div>

          {/* Right Header Actions & User Profile */}
          <div className="flex items-center gap-3.5">
            {/* Quick Action Icons */}
            <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8E2] hover:bg-[#EDF2ED] flex items-center justify-center text-[#4B5563] transition-colors cursor-pointer shadow-2xs">
              <Mail className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8E2] hover:bg-[#EDF2ED] flex items-center justify-center text-[#4B5563] relative transition-colors cursor-pointer shadow-2xs">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#22C55E]" />
            </button>

            {/* User Profile Pill */}
            {user && (
              <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-[#E2E8E2] shadow-2xs">
                <Avatar className="h-8 w-8 border border-[#E2E8E2]">
                  {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                  <AvatarFallback className="text-xs bg-[#EAF5EE] text-[#113D2B] font-bold font-mono">
                    {getInitials(user.full_name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#111827] leading-tight">
                    {user.full_name || "Alex Chen"}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] font-mono leading-tight">
                    {user.email || "alex@example.com"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
