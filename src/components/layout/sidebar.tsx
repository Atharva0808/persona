"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Target,
  MessageSquare,
  LogOut,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getInitials } from "@/lib/utils";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Audit",
    href: "/resume",
    icon: FileText,
  },
  {
    label: "GitHub Analysis",
    href: "/github",
    icon: Github,
  },
  {
    label: "LinkedIn Review",
    href: "/linkedin",
    icon: Linkedin,
  },
  {
    label: "Skill Gap Matrix",
    href: "/skills",
    icon: Target,
  },
  {
    label: "Mock Interview",
    href: "/interview",
    icon: MessageSquare,
  },
];

interface SidebarProps {
  user: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  collapsed?: boolean;
  onCollapse?: () => void;
  onSignOut?: () => void;
}

export function Sidebar({
  user,
  collapsed = false,
  onSignOut,
}: SidebarProps) {
  const pathname = usePathname();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "flex flex-col h-full bg-white border-r border-[#E5EBE5] transition-all duration-300 z-20 select-none",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-[#E5EBE5]/60">
          <Logo size={32} />
          {!collapsed && (
            <span className="text-xl font-bold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
              persona
            </span>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          {/* Section: MENU */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 mb-2 font-mono">
                Menu
              </div>
            )}
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-[#EAF5EE] text-[#113D2B] font-bold"
                      : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F7F4]"
                  )}
                >
                  {/* Left indicator bar on active item (Donezo style) */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#113D2B] rounded-r-md" />
                  )}
                  <item.icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-[#113D2B]"
                        : "text-[#9CA3AF] group-hover:text-[#111827]"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Donezo Dark Forest Pine Card Banner in Sidebar */}
          {!collapsed && (
            <div className="pt-2">
              <div className="rounded-2xl bg-gradient-to-b from-[#113D2B] to-[#0A261A] text-white p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
                  </div>
                  <span className="text-[11px] font-bold text-white/90">
                    AI Readiness Track
                  </span>
                </div>
                <p className="text-[11px] text-white/70 leading-snug">
                  Benchmark your profile across 9 engineering tracks.
                </p>
                <Link
                  href="/interview"
                  className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-colors"
                >
                  <span>Practice Interview</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Footer Profile with Logout Trigger */}
        {user && (
          <div className="p-4 border-t border-[#E5EBE5] flex items-center justify-between gap-2 bg-[#FAFBF9]">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 border border-[#E5EBE5] shrink-0">
                {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                <AvatarFallback className="text-xs bg-[#EAF5EE] text-[#113D2B] font-bold font-mono">
                  {getInitials(user.full_name || user.email)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#111827] truncate">
                    {user.full_name || "Engineer"}
                  </span>
                  <span className="text-[11px] text-[#6B7280] truncate font-mono">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setLogoutDialogOpen(true)}
              title="Sign out"
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <LogOut className="w-6 h-6" />
            </div>
            <DialogHeader className="text-center space-y-1">
              <DialogTitle className="text-lg font-bold text-[#111827] text-center">
                Log out of Persona?
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6B7280] text-center leading-relaxed">
                Are you sure you want to sign out? You will need to sign in again to access your assessment footprint and mock interview sessions.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="flex-row justify-center gap-3 pt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="rounded-xl border-[#E5EBE5] text-[#111827] hover:bg-[#F4F7F4] text-xs font-bold px-5 h-10"
            >
              Cancel
            </Button>
            <button
              onClick={() => {
                setLogoutDialogOpen(false);
                onSignOut?.();
              }}
              className="px-5 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Yes, Log Out
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
