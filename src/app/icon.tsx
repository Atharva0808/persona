import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The Lens / Focus Ring */}
        <circle cx="12.5" cy="16" r="8" stroke="white" strokeWidth="3" />
        <circle cx="19.5" cy="16" r="8" stroke="white" strokeWidth="3" />
        <circle cx="16" cy="16" r="1.5" fill="white" />
      </svg>
    ),
    { ...size }
  );
}
