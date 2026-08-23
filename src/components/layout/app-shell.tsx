"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { createClient } from "@/lib/supabase/client";

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
    <div className="min-h-screen bg-[#EAEFEA] p-2 sm:p-4 text-[#111827] font-sans antialiased">
      {/* Donezo Floating Rounded App Container */}
      <div className="flex h-[calc(100vh-16px)] sm:h-[calc(100vh-32px)] bg-[#F4F6F4] rounded-[28px] sm:rounded-[36px] border border-[#E5EBE5] overflow-hidden shadow-xs">
        {/* Sidebar Navigation */}
        <Sidebar
          user={user}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          onSignOut={handleSignOut}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F4F6F4]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
