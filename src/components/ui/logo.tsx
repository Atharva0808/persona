import React from "react";

/**
 * Pure Notion-style doodle character head logo for Persona.
 * Standalone line-art side profile (facing right / looking ahead) with no background cube/box.
 * Uses `currentColor` for crisp contrast in any context (dark/light themes).
 */
export function Logo({
  className = "",
  size = 32,
  color = "currentColor",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Persona logo"
      style={{ color }}
    >
      {/* Hair top / swoop silhouette */}
      <path
        d="M 22 48 C 20 30, 32 18, 52 18 C 68 18, 76 28, 72 40 C 66 41, 62 43, 61 46 C 54 46, 50 38, 41 38 C 32 38, 27 46, 22 48 Z"
        fill="currentColor"
      />

      {/* Playful hair curl at the crown */}
      <path
        d="M 34 18 C 29 10, 18 12, 22 23"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Face profile line (forehead -> cute nose -> lips -> chin -> jaw) */}
      <path
        d="M 61 42 C 64 45, 75 48, 75 52 C 73 54, 63 56, 63 60 C 63 67, 58 73, 51 75 C 41 77, 30 73, 26 63"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Eye looking forward/right */}
      <ellipse cx="52" cy="47" rx="5.5" ry="7" fill="currentColor" />

      {/* Eyebrow */}
      <path
        d="M 46 36 Q 54 33 59 38"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cute side smile */}
      <path
        d="M 56 60 Q 64 62 67 56"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Soft warm brand blush cheek */}
      <ellipse cx="44" cy="58" rx="6.5" ry="4" fill="#E84B2B" opacity="0.8" />

      {/* Ear */}
      <path
        d="M 27 50 C 20 50, 20 62, 28 62"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 25 55 C 23 55, 23 58, 26 58"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
