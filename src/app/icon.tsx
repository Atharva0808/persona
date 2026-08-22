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
          {/* Hair top / swoop */}
          <path
            d="M 22 48 C 20 30, 32 18, 52 18 C 68 18, 76 28, 72 40 C 66 41, 62 43, 61 46 C 54 46, 50 38, 41 38 C 32 38, 27 46, 22 48 Z"
            fill="#121316"
          />

          {/* Hair curl */}
          <path
            d="M 34 18 C 29 10, 18 12, 22 23"
            stroke="#121316"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Face profile line */}
          <path
            d="M 61 42 C 64 45, 75 48, 75 52 C 73 54, 63 56, 63 60 C 63 67, 58 73, 51 75 C 41 77, 30 73, 26 63"
            stroke="#121316"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Eye */}
          <ellipse cx="52" cy="47" rx="6.5" ry="8.5" fill="#121316" />

          {/* Eyebrow */}
          <path
            d="M 46 36 Q 54 33 59 38"
            stroke="#121316"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Smile */}
          <path
            d="M 56 60 Q 64 62 67 56"
            stroke="#121316"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Coral blush cheek */}
          <ellipse cx="44" cy="58" rx="7.5" ry="5" fill="#E84B2B" />

          {/* Ear */}
          <path
            d="M 27 50 C 20 50, 20 62, 28 62"
            stroke="#121316"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
