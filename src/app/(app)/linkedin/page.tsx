"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Upload,
  FileText,
  HelpCircle,
  X,
  FileCode,
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
  const [activeTab, setActiveTab] = useState<"pdf" | "manual">("pdf");
  const [showGuide, setShowGuide] = useState(true);

  // PDF Upload State
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    profileUrl: "",
    headline: "",
    about: "",
    experience: "",
    skills: "",
    featured: "",
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyzePDF = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/linkedin/analyze", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Analysis failed");
      }

      setAnalysis(resData);
      toast.success("LinkedIn PDF analyzed successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze LinkedIn PDF";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeManual = async (e: React.FormEvent) => {
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
              onClick={() => {
                setAnalysis(null);
                setFile(null);
              }}
              className="rounded-xl border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Review
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <div className="space-y-6">
          {/* Step-by-Step Guide Callout */}
          {showGuide && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  How to export your LinkedIn Profile PDF in 3 seconds
                </span>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-neutral-500 hover:text-white text-xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-300 font-mono">
                <li className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60">
                  <span className="text-amber-400 font-bold mr-1">1.</span> Open your profile page on LinkedIn.
                </li>
                <li className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60">
                  <span className="text-amber-400 font-bold mr-1">2.</span> Click the <strong className="text-white">"More"</strong> button near your header.
                </li>
                <li className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60">
                  <span className="text-amber-400 font-bold mr-1">3.</span> Select <strong className="text-white">"Save to PDF"</strong> & upload it below!
                </li>
              </ol>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-neutral-800 gap-6 text-xs font-mono">
            <button
              onClick={() => setActiveTab("pdf")}
              className={`pb-2.5 transition-colors cursor-pointer ${
                activeTab === "pdf"
                  ? "border-b-2 border-amber-400 text-amber-300 font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Upload LinkedIn PDF (Recommended)
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`pb-2.5 transition-colors cursor-pointer ${
                activeTab === "manual"
                  ? "border-b-2 border-amber-400 text-amber-300 font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Manual Form Input
            </button>
          </div>

          {activeTab === "pdf" ? (
            <Card className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
              <CardContent className="p-0 space-y-6">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? "border-amber-400 bg-amber-400/[0.04]"
                      : file
                      ? "border-neutral-700 bg-neutral-900/60"
                      : "border-neutral-800 hover:border-neutral-700 bg-neutral-950/40"
                  }`}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-8 w-8 text-neutral-300" />
                      <div>
                        <p className="text-sm font-semibold text-neutral-200 font-mono">
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-500 font-mono">
                          {(file.size / 1024 / 1024).toFixed(2)} MB LinkedIn Export
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="text-xs text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="h-8 w-8 text-neutral-400" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-neutral-200">
                          Upload your exported LinkedIn PDF
                        </p>
                        <p className="text-xs text-neutral-500 font-normal">
                          Drag & drop or select file from your device
                        </p>
                      </div>
                      <label className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer transition-colors border border-neutral-700">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f?.type === "application/pdf") setFile(f);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <ShimmerButton
                    shimmerColor="#f59e0b"
                    shimmerDuration="2.5s"
                    borderRadius="12px"
                    disabled={!file || loading}
                    onClick={handleAnalyzePDF}
                    className="h-11 px-6 text-sm font-semibold text-amber-100 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4 text-amber-300" />
                        Analyzing LinkedIn PDF...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Run LinkedIn Audit
                        <ArrowRight className="h-4 w-4 text-amber-400" />
                      </span>
                    )}
                  </ShimmerButton>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
              <CardContent className="p-0">
                <form onSubmit={handleAnalyzeManual} className="space-y-5 max-w-xl">
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
          )}
        </div>
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
