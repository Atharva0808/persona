import React from "react";

/**
 * Warm Happy Smiley Emoji Logo for Persona.
 * Vibrant golden circular emoji face with glossy catchlight eyes,
 * rosy blushing cheeks, and a joyful open smile with tongue detail.
 * Standalone circular mark with no background cube/box.
 */
export function Logo({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const gradId = React.useId();

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
      <defs>
        {/* Warm golden-yellow depth gradient */}
        <radialGradient
          id={gradId}
          cx="38%"
          cy="32%"
          r="62%"
          fx="32%"
          fy="28%"
        >
          <stop offset="0%" stopColor="#FFE570" />
          <stop offset="65%" stopColor="#FFBA08" />
          <stop offset="100%" stopColor="#E89005" />
        </radialGradient>
      </defs>

      {/* Main golden emoji circular face */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill={`url(#${gradId})`}
        stroke="#D48200"
        strokeWidth="3"
      />

      {/* Left big glossy eye */}
      <ellipse cx="34" cy="42" rx="7.5" ry="9.5" fill="#1C1405" />
      {/* Primary catchlight */}
      <circle cx="31.5" cy="38.5" r="3.2" fill="#FFFFFF" />
      {/* Micro catchlight */}
      <circle cx="36.5" cy="45" r="1.6" fill="#FFFFFF" />

      {/* Right big glossy eye */}
      <ellipse cx="66" cy="42" rx="7.5" ry="9.5" fill="#1C1405" />
      {/* Primary catchlight */}
      <circle cx="63.5" cy="38.5" r="3.2" fill="#FFFFFF" />
      {/* Micro catchlight */}
      <circle cx="68.5" cy="45" r="1.6" fill="#FFFFFF" />

      {/* Cute rosy pink blushing cheeks */}
      <ellipse cx="23" cy="54" rx="8.5" ry="5" fill="#FF5E6C" opacity="0.75" />
      <ellipse cx="77" cy="54" rx="8.5" ry="5" fill="#FF5E6C" opacity="0.75" />

      {/* Joyful open mouth */}
      <path
        d="M 33 55 C 33 74, 67 74, 67 55 Z"
        fill="#7A0E18"
      />

      {/* Cute pink tongue inside mouth */}
      <path
        d="M 40 64 C 44 59, 56 59, 60 64 C 57 73, 43 73, 40 64 Z"
        fill="#FF7E8B"
      />

      {/* Mouth outline */}
      <path
        d="M 32 55 C 32 75, 68 75, 68 55"
        stroke="#590C12"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
