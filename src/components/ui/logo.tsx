import React from "react";

export function Logo({ className = "", size = 32 }: { className?: string, size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The Lens / Focus Ring */}
      {/* A mathematically perfect interlocking ring structure representing vision, scanning, and insight. */}
      <circle cx="12.5" cy="16" r="8" stroke="currentColor" strokeWidth="3" className="text-neutral-100" />
      <circle cx="19.5" cy="16" r="8" stroke="currentColor" strokeWidth="3" className="text-neutral-100" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" className="text-neutral-100" />
    </svg>
  );
}
