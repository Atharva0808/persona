import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Persona",
  description:
    "Evaluate your engineering footprint across Resume, GitHub, LinkedIn, and Skill Gap analysis to calculate your true interview readiness.",
  keywords: [
    "resume analyzer",
    "ATS score",
    "GitHub analysis",
    "LinkedIn optimization",
    "interview preparation",
    "software engineering",
    "skill gap analysis",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${instrument.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-[#07080B] text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-200" suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0c0d12",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
