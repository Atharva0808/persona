"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8 pb-4 border-b border-white/[0.06]">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-slate-400 font-normal mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
