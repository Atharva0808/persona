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
    label: "Resume",
    href: "/resume",
    icon: FileText,
  },
  {
    label: "GitHub",
    href: "/github",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "/linkedin",
    icon: Linkedin,
  },
  {
    label: "Skill Gap",
    href: "/skills",
    icon: Target,
  },
  {
    label: "Interview Prep",
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
          "flex flex-col h-full border-r border-neutral-800 bg-neutral-950 transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-neutral-800">
          <Logo size={28} />
          {!collapsed && (
            <span className="text-sm font-semibold text-neutral-100 tracking-tight">
              persona
            </span>
          )}
          <button
            onClick={onCollapse}
            className={cn(
              "ml-auto p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer",
              collapsed && "ml-0"
            )}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </nav>

        <Separator />

        {/* User section */}
        <div className="px-2 py-3 space-y-0.5">
          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onSignOut}
                    className="flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm text-neutral-500 hover:text-red-400 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign out</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <button
                onClick={onSignOut}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-neutral-500 hover:text-red-400 hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </>
          )}
        </div>

        <Separator />

        {/* User avatar */}
        {user && (
          <div className={cn("px-3 py-3", collapsed && "flex justify-center")}>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                <AvatarFallback className="text-xs">
                  {getInitials(user.full_name || user.email)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-neutral-200 truncate">
                    {user.full_name || "User"}
                  </span>
                  <span className="text-xs text-neutral-500 truncate">
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
