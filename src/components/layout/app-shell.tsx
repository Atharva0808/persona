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
    <div className="flex h-screen bg-neutral-950 overflow-hidden">
      <Sidebar
        user={user}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
