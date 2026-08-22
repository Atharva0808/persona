import React from "react";

/**
 * Cute Notion-style emoji mascot logo for Persona.
 * High-contrast, expressive doodle face with glossy catchlight eyes,
 * rosy blush cheeks, and a warm friendly smile.
 * Crisp and clearly visible at any size on both light and dark backgrounds.
 */
export function Logo({
  className = "",
  size = 32,
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
    >
      {/* Soft rounded squircle sticker base with crisp dark border */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="26"
        fill="#FFFDF7"
        stroke="#121316"
        strokeWidth="6"
      />

      {/* Tiny playful eyebrows */}
      <path
        d="M28 30 C32 26, 38 26, 42 30"
        stroke="#121316"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M58 30 C62 26, 68 26, 72 30"
        stroke="#121316"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left big glossy eye */}
      <ellipse cx="35" cy="46" rx="8" ry="9.5" fill="#121316" />
      {/* Primary catchlight */}
      <circle cx="32" cy="42.5" r="3.2" fill="#FFFFFF" />
      {/* Secondary micro sparkle */}
      <circle cx="37.5" cy="49" r="1.6" fill="#FFFFFF" />

      {/* Right big glossy eye */}
      <ellipse cx="65" cy="46" rx="8" ry="9.5" fill="#121316" />
      {/* Primary catchlight */}
      <circle cx="62" cy="42.5" r="3.2" fill="#FFFFFF" />
      {/* Secondary micro sparkle */}
      <circle cx="67.5" cy="49" r="1.6" fill="#FFFFFF" />

      {/* Cute rosy pink blushing cheeks */}
      <ellipse cx="23" cy="58" rx="7.5" ry="4.5" fill="#FF7E70" opacity="0.9" />
      <ellipse cx="77" cy="58" rx="7.5" ry="4.5" fill="#FF7E70" opacity="0.9" />

      {/* Cute happy open smile */}
      <path
        d="M38 57 C38 72, 62 72, 62 57"
        fill="#FF6B6B"
        stroke="#121316"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Little tongue highlight */}
      <path
        d="M44 64 C47 61, 53 61, 56 64"
        stroke="#FFB3B3"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
