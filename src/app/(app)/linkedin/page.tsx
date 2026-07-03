"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { LinkedinIcon as Linkedin } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing, ScoreBar } from "@/components/ui/score";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      <Card>
        <CardHeader className="pb-3 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <ScoreRing score={section.score} size={48} strokeWidth={4} />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">
                Current
              </span>
              <p className="text-sm text-neutral-400 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 line-clamp-3">
                {section.current}
              </p>
            </div>
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">
                Feedback
              </span>
              <p className="text-sm text-neutral-300">{section.feedback}</p>
            </div>
            {section.suggestions && section.suggestions.length > 0 && (
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-2">
                  Suggestions
                </span>
                <ul className="space-y-2">
                  {section.suggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-emerald-400/90"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="LinkedIn Review"
        description="Optimize your LinkedIn profile to attract recruiters and passing automated screening."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalysis(null)}
            >
              New Analysis
            </Button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0077b5]/10 border border-[#0077b5]/20">
                    <Linkedin className="h-5 w-5 text-[#0077b5]" />
                  </div>
                  <div>
                    <CardTitle>Profile Details</CardTitle>
                    <p className="text-sm text-neutral-500 mt-1">
                      Paste your LinkedIn sections below. We don't use automated
                      scraping to keep your account safe.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profileUrl">Profile URL *</Label>
                    <Input
                      id="profileUrl"
                      name="profileUrl"
                      placeholder="https://linkedin.com/in/johndoe"
                      value={formData.profileUrl}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="headline">
                      <AccordionTrigger>Headline & About</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="headline">Headline</Label>
                          <Input
                            id="headline"
                            name="headline"
                            placeholder="Software Engineer | React | Node.js"
                            value={formData.headline}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="about">About Section</Label>
                          <Textarea
                            id="about"
                            name="about"
                            placeholder="I am a passionate software engineer..."
                            value={formData.about}
                            onChange={handleChange}
                            className="h-32"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="experience">
                      <AccordionTrigger>Experience & Skills</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="experience">Experience Summary</Label>
                          <Textarea
                            id="experience"
                            name="experience"
                            placeholder="Briefly paste your recent experience bullets..."
                            value={formData.experience}
                            onChange={handleChange}
                            className="h-32"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="skills">Top Skills</Label>
                          <Input
                            id="skills"
                            name="skills"
                            placeholder="JavaScript, React, Python..."
                            value={formData.skills}
                            onChange={handleChange}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="featured">
                      <AccordionTrigger>Featured Section</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="featured">Featured Items</Label>
                          <Textarea
                            id="featured"
                            name="featured"
                            placeholder="Articles, posts, or links in your featured section..."
                            value={formData.featured}
                            onChange={handleChange}
                            className="h-24"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !formData.profileUrl.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2 text-neutral-950" />
                        Analyzing Profile...
                      </>
                    ) : (
                      "Analyze Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Overview Score */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <ScoreRing
                    score={analysis.score}
                    size={140}
                    label="Profile Score"
                  />
                  <div className="mt-6 w-full space-y-2">
                    <ScoreBar
                      score={analysis.recruiter_attractiveness}
                      label="Recruiter Appeal"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Top Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800"
                      >
                        <div className="mt-0.5">
                          <Lightbulb className="h-5 w-5 text-amber-400" />
                        </div>
                        <p className="text-sm text-neutral-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Breakdown */}
            <h2 className="text-lg font-semibold text-neutral-100 mt-8 mb-4">
              Section Breakdown
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {renderSectionAnalysis("Headline", analysis.headline)}
              {renderSectionAnalysis("About Section", analysis.about)}
              {renderSectionAnalysis("Experience", analysis.experience)}
              {renderSectionAnalysis("Skills & Endorsements", analysis.skills)}
              {renderSectionAnalysis("Featured Content", analysis.featured)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
