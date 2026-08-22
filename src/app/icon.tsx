import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation for favicon / app icon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base squircle badge */}
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="26"
            fill="#FFFDF7"
            stroke="#121316"
            strokeWidth="7"
          />

          {/* Hair silhouette */}
          <path
            d="M 27 46 C 25 30, 35 21, 52 21 C 66 21, 72 29, 68 39 C 64 41, 62 43, 62 46 C 56 46, 52 40, 44 40 C 36 40, 32 46, 27 46 Z"
            fill="#121316"
          />

          {/* Hair curl */}
          <path
            d="M 36 21 C 32 14, 23 16, 26 25"
            stroke="#121316"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Side face profile line */}
          <path
            d="M 62 42 C 64 45, 74 47, 74 51 C 72 53, 64 54, 64 58 C 64 64, 60 69, 54 71 C 45 73, 36 70, 32 61"
            stroke="#121316"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Side-glance eye */}
          <ellipse cx="53" cy="46" rx="6" ry="8" fill="#121316" />
          <circle cx="55.5" cy="43.5" r="2.5" fill="#FFFFFF" />

          {/* Eyebrow */}
          <path
            d="M 48 35 Q 55 33 59 37"
            stroke="#121316"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Side smile */}
          <path
            d="M 57 58 Q 64 60 67 55"
            stroke="#121316"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Pink blush cheek */}
          <ellipse cx="46" cy="56" rx="7" ry="4.5" fill="#FF7E70" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
