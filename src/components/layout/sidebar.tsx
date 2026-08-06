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
  ChevronLeft,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Analysis",
    href: "/resume",
    icon: FileText,
  },
  {
    label: "GitHub Audit",
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
    label: "AI Interview Prep",
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
  onCollapse,
  onSignOut,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-full border-r border-white/[0.06] bg-[#08090d] transition-all duration-300 z-20",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
          <Logo size={26} />
          {!collapsed && (
            <span className="text-base font-bold text-slate-100 tracking-tight font-mono">
              persona
            </span>
          )}
          <button
            onClick={onCollapse}
            className={cn(
              "ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer",
              collapsed && "ml-0"
            )}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.07] text-amber-300 font-semibold border-l-2 border-amber-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-amber-400" : "text-slate-400")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#0c0d12] border-white/10 text-slate-200 text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </nav>

        <div className="px-4">
          <Separator className="bg-white/[0.06]" />
        </div>

        {/* User Signout Action */}
        <div className="px-3 py-3 space-y-1">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onSignOut}
                  className="flex items-center justify-center w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#0c0d12] border-white/10 text-slate-200 text-xs">
                Sign out
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onSignOut}
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          )}
        </div>

        <div className="px-4">
          <Separator className="bg-white/[0.06]" />
        </div>

        {/* User avatar */}
        {user && (
          <div className={cn("px-4 py-4", collapsed && "flex justify-center px-2")}>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-amber-500/30">
                {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                <AvatarFallback className="text-xs bg-amber-500/10 text-amber-300 font-bold font-mono">
                  {getInitials(user.full_name || user.email)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {user.full_name || "Engineer"}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate font-mono">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
