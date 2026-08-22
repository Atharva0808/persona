"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Target,
  MessageSquare,
  LogOut,
  Settings,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  return (
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
            <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 mb-2">
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
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-[#EAF5EE] text-[#113D2B] font-semibold"
                    : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F7F4]"
                )}
              >
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

        {/* Section: GENERAL */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 mb-2">
              General
            </div>
          )}
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
              pathname === "/settings"
                ? "bg-[#EAF5EE] text-[#113D2B] font-semibold"
                : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F7F4]"
            )}
          >
            <Settings
              className={cn(
                "w-4 h-4 shrink-0 transition-colors",
                pathname === "/settings"
                  ? "text-[#113D2B]"
                  : "text-[#9CA3AF] group-hover:text-[#111827]"
              )}
            />
            {!collapsed && <span>Settings</span>}
          </Link>

          {/* Logout Button */}
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 group cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 text-[#9CA3AF] group-hover:text-rose-600 transition-colors" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* User Footer Profile */}
      {user && (
        <div className="p-4 border-t border-[#E5EBE5] flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-[#E5EBE5]">
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
      )}
    </aside>
  );
}
