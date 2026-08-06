"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { LinkedinIcon as Linkedin } from "@/components/icons";
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
      <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          <span className="text-xs font-mono font-bold text-sky-400 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
            {section.score} / 100
          </span>
        </div>
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl border border-white/[0.06] bg-black/40 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Current Section Content</span>
            <p className="text-slate-300 line-clamp-3 font-normal">{section.current || "Not provided"}</p>
          </div>
          <p className="text-xs text-slate-400 font-normal leading-relaxed">{section.feedback}</p>
          {section.suggestions.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              {section.suggestions.map((sug, i) => (
                <div key={i} className="text-[11px] text-slate-300 font-normal flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <PageHeader
        title="LinkedIn Recruiter Inbound Magnet"
        description="Optimize your headline, experience summaries, and skill tags for recruiter search visibility."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalysis(null)}
              className="rounded-xl border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Review
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 shadow-2xl p-6 sm:p-10">
          <CardContent className="p-0">
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  LinkedIn Profile URL *
                </Label>
                <Input
                  name="profileUrl"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.profileUrl}
                  onChange={handleChange}
                  className="h-11 bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 font-mono text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Current Headline
                  </Label>
                  <Input
                    name="headline"
                    placeholder="e.g. Senior Software Engineer @ TechCorp | React, Node.js"
                    value={formData.headline}
                    onChange={handleChange}
                    className="h-11 bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Skill Keywords
                  </Label>
                  <Input
                    name="skills"
                    placeholder="e.g. TypeScript, React, Next.js, Microservices"
                    value={formData.skills}
                    onChange={handleChange}
                    className="h-11 bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  About Section Summary
                </Label>
                <Textarea
                  name="about"
                  placeholder="Paste your LinkedIn About section text here..."
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="bg-black/40 border-white/10 text-slate-100 rounded-xl focus:border-amber-400 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <ShimmerButton
                  shimmerColor="#38bdf8"
                  shimmerDuration="2.5s"
                  borderRadius="16px"
                  disabled={loading}
                  type="submit"
                  className="h-12 px-8 text-sm font-semibold text-slate-100 disabled:opacity-50 shadow-xl shadow-sky-950/40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-sky-300" />
                      Evaluating Search Rank...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze LinkedIn Profile
                      <ArrowRight className="h-4 w-4 text-sky-400" />
                    </span>
                  )}
                </ShimmerButton>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2 font-mono text-xs text-sky-400 font-semibold">
                  <Linkedin className="w-4 h-4" />
                  <span>Recruiter Search Visibility Report</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                  Recruiter Attractiveness Score
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  Your profile ranks in the top percentile for technical recruiter inbound searches.
                </p>
              </div>

              <div className="flex items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/[0.06] shrink-0">
                <ScoreRing score={analysis.recruiter_attractiveness} label="Recruiter Rank" size={120} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSectionAnalysis("Headline Analysis", analysis.headline)}
            {renderSectionAnalysis("About Section Analysis", analysis.about)}
            {renderSectionAnalysis("Experience Section", analysis.experience)}
            {renderSectionAnalysis("Skill Endorsements", analysis.skills)}
          </div>
        </div>
      )}
    </motion.div>
  );
}
