"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import type { LinkedInAnalysis, SectionAnalysis } from "@/lib/types";

export default function LinkedInPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);

  const [formData, setFormData] = useState({
    profileUrl: "",
    headline: "",
    about: "",
    experience: "",
    skills: "",
    featured: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profileUrl.trim()) {
      toast.error("Profile URL is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/linkedin/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
      toast.success("LinkedIn profile analyzed successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to analyze LinkedIn profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderSectionAnalysis = (title: string, section: SectionAnalysis) => {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5">
          <h3 className="text-sm font-semibold text-neutral-200">{title}</h3>
          <span className="text-xs font-mono text-neutral-400">{section.score} / 100</span>
        </div>
        <div className="space-y-2">
          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 text-xs">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Current Section Content</span>
            <p className="text-neutral-300 line-clamp-3">{section.current || "Not provided"}</p>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">{section.feedback}</p>
          {section.suggestions.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-neutral-800/60">
              {section.suggestions.map((sug, i) => (
                <div key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 text-neutral-100">
      <PageHeader
        title="LinkedIn Profile Review"
        description="Optimize headline, experience summaries, and skill keywords for recruiter search rank."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalysis(null)}
              className="rounded-xl border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Review
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <Card className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
          <CardContent className="p-0">
            <form onSubmit={handleAnalyze} className="space-y-5 max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                  LinkedIn Profile URL *
                </Label>
                <Input
                  name="profileUrl"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.profileUrl}
                  onChange={handleChange}
                  className="h-10 bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 font-mono text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                    Current Headline
                  </Label>
                  <Input
                    name="headline"
                    placeholder="e.g. Senior Software Engineer | React, Node.js"
                    value={formData.headline}
                    onChange={handleChange}
                    className="h-10 bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                    Skill Keywords
                  </Label>
                  <Input
                    name="skills"
                    placeholder="e.g. TypeScript, React, Next.js, Microservices"
                    value={formData.skills}
                    onChange={handleChange}
                    className="h-10 bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-neutral-400 font-medium">
                  About Section Summary
                </Label>
                <Textarea
                  name="about"
                  placeholder="Paste your LinkedIn About section summary text..."
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="bg-neutral-950/60 border-neutral-800 text-neutral-100 rounded-lg focus:border-amber-400 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <ShimmerButton
                  shimmerColor="#f59e0b"
                  shimmerDuration="2.5s"
                  borderRadius="12px"
                  disabled={loading}
                  type="submit"
                  className="h-11 px-6 text-sm font-semibold text-amber-100 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-amber-300" />
                      Evaluating Search Rank...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze Profile
                      <ArrowRight className="h-4 w-4 text-amber-400" />
                    </span>
                  )}
                </ShimmerButton>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Recruiter Search Attractiveness
              </div>
              <h2 className="text-xl font-bold text-neutral-100">
                Recruiter Score: {analysis.recruiter_attractiveness} / 100
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Your profile rank reflects inbound search matches for software engineering positions.
              </p>
            </div>

            <div className="flex items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 shrink-0">
              <ScoreRing score={analysis.recruiter_attractiveness} label="Recruiter Rank" size={100} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderSectionAnalysis("Headline Analysis", analysis.headline)}
            {renderSectionAnalysis("About Section Analysis", analysis.about)}
            {renderSectionAnalysis("Experience Section", analysis.experience)}
            {renderSectionAnalysis("Skill Endorsements", analysis.skills)}
          </div>
        </div>
      )}
    </div>
  );
}
