import React from "react";

export function Logo({ className = "", size = 32 }: { className?: string, size?: number }) {
  return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Geometric Low-Poly Fox mascot - Graphite & Silver */}
        <polygon points="15,10 5,60 35,45" fill="#52525b" />
        <polygon points="105,10 115,60 85,45" fill="#3f3f46" />
        <polygon points="15,10 35,45 60,25" fill="#a1a1aa" />
        <polygon points="105,10 85,45 60,25" fill="#71717a" />
        <polygon points="5,60 35,45 60,110" fill="#f4f4f5" />
        <polygon points="115,60 85,45 60,110" fill="#e4e4e7" />
        <polygon points="35,45 60,25 60,110" fill="#52525b" />
        <polygon points="85,45 60,25 60,110" fill="#3f3f46" />
        <polygon points="50,84 70,84 60,110" fill="#09090b" />
      </svg>
  );
}
