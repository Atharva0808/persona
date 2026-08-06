"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#fbbf24",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(18, 18, 22, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-amber-500/30 px-6 py-3 text-amber-100 [background:var(--bg)] [border-radius:var(--radius)] font-medium text-sm transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/60 active:scale-[0.98] shadow-lg shadow-amber-950/20",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* Spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread,90deg)/2)),transparent_0,var(--shimmer-color)_calc(var(--spread,90deg)/2),transparent_var(--spread,90deg))]" />
          </div>
        </div>

        {/* Content container */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </div>

        {/* Highlight inner glow */}
        <div
          className={cn(
            "absolute inset-0 size-full rounded-[var(--radius)] transition-all duration-300 opacity-60 group-hover:opacity-100",
            "shadow-[inset_0_-6px_12px_#fbbf2415]",
            "transform-gpu group-hover:shadow-[inset_0_-6px_16px_#fbbf2430]"
          )}
        />

        {/* Backdrop cut */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
