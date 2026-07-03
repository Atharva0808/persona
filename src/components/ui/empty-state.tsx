"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 mb-4 text-neutral-500">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-neutral-200 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
