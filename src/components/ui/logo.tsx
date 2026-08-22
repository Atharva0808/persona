import React from "react";

/**
 * Emoji-style logo for Persona.
 * A simple, warm face — round head with two dot eyes and a subtle smile.
 * Inspired by Notion's emoji-as-logo approach.
 * Works at any size from 16px favicon to large display.
 */
export function Logo({ className = "", size = 32, color = "currentColor" }: { className?: string; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Persona logo"
    >
      {/* Face — rounded square, like an app icon / emoji container */}
      <rect x="6" y="6" width="108" height="108" rx="30" fill={color} />

      {/* Left eye */}
      <ellipse cx="43" cy="52" rx="9" ry="10" fill="white" />

      {/* Right eye */}
      <ellipse cx="77" cy="52" rx="9" ry="10" fill="white" />

      {/* Smile — a subtle, friendly curve */}
      <path
        d="M44 78 Q60 92 76 78"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
