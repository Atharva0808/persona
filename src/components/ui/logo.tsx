import React from "react";

/**
 * Notion-style side-profile character logo for Persona.
 * An iconic, cute hand-drawn doodle facing to the right (looking ahead),
 * featuring side-profile nose, hair tuft, expressive side-glance eye,
 * rosy blush cheek, and a friendly smirk.
 *
 * Clearly visible on dark & light backgrounds and in browser favicon tabs.
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
      {/* Warm cream rounded squircle sticker base with crisp dark border */}
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

      {/* Cute hairstyle / head silhouette facing right */}
      <path
        d="M 27 46 C 25 30, 35 21, 52 21 C 66 21, 72 29, 68 39 C 64 41, 62 43, 62 46 C 56 46, 52 40, 44 40 C 36 40, 32 46, 27 46 Z"
        fill="#121316"
      />

      {/* Playful hair curl / tuft at back */}
      <path
        d="M 36 21 C 32 14, 23 16, 26 25"
        stroke="#121316"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Face side-profile contour (forehead -> cute nose pointing right -> lips -> chin -> jaw) */}
      <path
        d="M 62 42 C 64 45, 74 47, 74 51 C 72 53, 64 54, 64 58 C 64 64, 60 69, 54 71 C 45 73, 36 70, 32 61"
        stroke="#121316"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Cute eye looking to the right (side-glance) */}
      <ellipse cx="53" cy="46" rx="5.5" ry="7" fill="#121316" />
      {/* Primary forward catchlight */}
      <circle cx="55.5" cy="43.5" r="2.2" fill="#FFFFFF" />
      {/* Micro catchlight */}
      <circle cx="52" cy="48" r="1.1" fill="#FFFFFF" />

      {/* Eyebrow tilted slightly up */}
      <path
        d="M 48 35 Q 55 33 59 37"
        stroke="#121316"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cute side smile */}
      <path
        d="M 57 58 Q 64 60 67 55"
        stroke="#121316"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Soft pink blush cheek on side */}
      <ellipse cx="46" cy="56" rx="6.5" ry="4" fill="#FF7E70" opacity="0.85" />

      {/* Cute ear on left */}
      <path
        d="M 33 49 C 27 49, 27 59, 34 59"
        stroke="#121316"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
