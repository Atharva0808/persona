import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Persona — Interview Readiness Platform",
  description:
    "Analyze your resume, GitHub, LinkedIn, and skills to maximize your chances of landing software engineering interviews.",
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
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#171717",
              border: "1px solid #262626",
              color: "#e5e5e5",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
