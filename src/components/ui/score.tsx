"use client";

import { cn, scoreColor, scoreProgressColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  className,
  label,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-neutral-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-out",
            score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-red-500"
          )}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-2xl font-bold tabular-nums", scoreColor(score))}>
          {score}
        </span>
        {label && (
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

interface ScoreBarProps {
  score: number;
  label: string;
  className?: string;
}

export function ScoreBar({ score, label, className }: ScoreBarProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-400">{label}</span>
        <span className={cn("text-sm font-medium tabular-nums", scoreColor(score))}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            scoreProgressColor(score)
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
