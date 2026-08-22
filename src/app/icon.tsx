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
          {/* Main golden emoji circular face */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="#FFBA08"
            stroke="#D48200"
            strokeWidth="4"
          />

          {/* Left glossy eye */}
          <ellipse cx="34" cy="42" rx="8" ry="10" fill="#1C1405" />
          <circle cx="31.5" cy="38.5" r="3.5" fill="#FFFFFF" />

          {/* Right glossy eye */}
          <ellipse cx="66" cy="42" rx="8" ry="10" fill="#1C1405" />
          <circle cx="63.5" cy="38.5" r="3.5" fill="#FFFFFF" />

          {/* Pink blush cheeks */}
          <ellipse cx="22" cy="54" rx="9" ry="5.5" fill="#FF5E6C" />
          <ellipse cx="78" cy="54" rx="9" ry="5.5" fill="#FF5E6C" />

          {/* Open mouth */}
          <path
            d="M 33 55 C 33 74, 67 74, 67 55 Z"
            fill="#7A0E18"
          />
          <path
            d="M 40 64 C 44 59, 56 59, 60 64 C 57 73, 43 73, 40 64 Z"
            fill="#FF7E8B"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
