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
          {/* Soft rounded squircle badge */}
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

          {/* Eyebrows */}
          <path
            d="M28 30 C32 26, 38 26, 42 30"
            stroke="#121316"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M58 30 C62 26, 68 26, 72 30"
            stroke="#121316"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left glossy eye */}
          <ellipse cx="35" cy="46" rx="9" ry="11" fill="#121316" />
          <circle cx="32" cy="42" r="3.5" fill="#FFFFFF" />
          <circle cx="38" cy="49" r="1.8" fill="#FFFFFF" />

          {/* Right glossy eye */}
          <ellipse cx="65" cy="46" rx="9" ry="11" fill="#121316" />
          <circle cx="62" cy="42" r="3.5" fill="#FFFFFF" />
          <circle cx="68" cy="49" r="1.8" fill="#FFFFFF" />

          {/* Pink blush cheeks */}
          <ellipse cx="22" cy="58" rx="8.5" ry="5" fill="#FF7E70" />
          <ellipse cx="78" cy="58" rx="8.5" ry="5" fill="#FF7E70" />

          {/* Happy smile */}
          <path
            d="M37 56 C37 73, 63 73, 63 56"
            fill="#FF6B6B"
            stroke="#121316"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
