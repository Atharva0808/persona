"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  X,
  RefreshCw,
  TrendingUp,
  Search,
  Award,
} from "lucide-react";
import { LinkedinIcon as Linkedin } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import type { LinkedInAnalysis, SectionAnalysis } from "@/lib/types";

const LINKEDIN_SEO_ITEMS = [
  {
    title: "Headline Formula & Target Keywords",
    desc: "Optimizes for [Target Role] + [Primary Tech Stack] + [Impact Metric] indexing on recruiter search.",
    icon: Search,
  },
  {
    title: "3-Second Hook About Section",
    desc: "Evaluates the top 3 visible lines before the 'see more' fold for high-intent technical positioning.",
    icon: FileText,
  },
  {
    title: "Boolean Search Keyword Density",
    desc: "Matches technical skills against recruiter Boolean search filters (e.g. Next.js, Kubernetes, Distributed).",
    icon: TrendingUp,
  },
  {
    title: "Competency & Endorsement Hierarchy",
    desc: "Structures top technical competencies to align with senior engineering job requirements.",
    icon: Award,
  },
];

export default function LinkedInPage() {
  const [activeTab, setActiveTab] = useState<"pdf" | "manual">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    profileUrl: "",
    headline: "",
    about: "",
    experience: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a LinkedIn profile PDF export");
    }
  };

  const handleAnalyzePDF = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/linkedin/analyze", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data);
      toast.success("LinkedIn profile analyzed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze LinkedIn PDF"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profileUrl) {
      toast.error("Please provide your LinkedIn profile URL");
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
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data);
      toast.success("LinkedIn profile analyzed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSectionAnalysis = (title: string, section?: SectionAnalysis) => {
    if (!section) return null;

    return (
      <div
        key={title}
        className="rounded-3xl border border-[#E5EBE5] bg-white p-6 space-y-3 shadow-2xs hover:border-[#113D2B]/30 transition-colors"
      >
        <div className="flex items-center justify-between border-b border-[#E5EBE5] pb-3">
          <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
          <span className="text-xs font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-0.5 rounded-lg">
            {section.score} / 100
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] text-xs">
            <span className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1 font-mono">
              Current Content
            </span>
            <p className="text-[#111827] line-clamp-3">
              {section.current || "Not provided"}
            </p>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            {section.feedback}
          </p>
          {section.suggestions.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#F0F4F0]">
              {section.suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="text-xs text-[#374151] flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#113D2B] shrink-0 mt-0.5" />
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
    <div className="space-y-7 pb-10 text-[#111827]">
      <PageHeader
        title="LinkedIn Profile Review"
        description="Audit headline keyword density, summary impact, and recruiter search discoverability."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnalysis(null);
                setFile(null);
              }}
              className="rounded-xl border-[#113D2B] text-[#113D2B] hover:bg-[#EAF5EE] font-bold text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Review
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ═══ Left Column (Span 7): Input Form ═══ */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F4F0] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    Inbound Profile Audit
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Evaluates keyword discovery rank on LinkedIn Recruiter
                  </p>
                </div>

                {/* Tab Selector */}
                <div className="flex gap-1.5 p-1 bg-[#F4F7F4] border border-[#E5EBE5] rounded-xl w-fit">
                  <button
                    onClick={() => setActiveTab("pdf")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "pdf"
                        ? "bg-[#113D2B] text-white shadow-2xs"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    PDF Export
                  </button>
                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "manual"
                        ? "bg-[#113D2B] text-white shadow-2xs"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    Manual Entry
                  </button>
                </div>
              </div>

              {activeTab === "pdf" ? (
                <div className="space-y-5">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all ${
                      dragActive
                        ? "border-[#113D2B] bg-[#EAF5EE]"
                        : file
                        ? "border-[#113D2B]/50 bg-[#F4F7F4]"
                        : "border-[#D8E2D8] hover:border-[#113D2B]/50 bg-[#FAFBF9]"
                    }`}
                  >
                    {file ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#113D2B] flex items-center justify-center text-white shadow-xs">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827] font-mono">
                            {file.name}
                          </p>
                          <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                            {(file.size / 1024 / 1024).toFixed(2)} MB LinkedIn Export
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFile(null)}
                          className="text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] border border-[#D8E2D8] flex items-center justify-center text-[#113D2B]">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-[#111827]">
                            Upload your exported LinkedIn PDF
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            On LinkedIn desktop: Profile → More → Save to PDF
                          </p>
                        </div>
                        <label className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold bg-[#113D2B] hover:bg-[#0D3122] text-white cursor-pointer transition-colors shadow-xs">
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

                  <div className="flex items-center justify-between pt-2 border-t border-[#F0F4F0]">
                    <span className="text-xs text-[#6B7280]">
                      {file ? "Ready to analyze LinkedIn export" : "No export PDF selected"}
                    </span>
                    <button
                      disabled={!file || loading}
                      onClick={handleAnalyzePDF}
                      className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="h-4 w-4 text-white" />
                          Analyzing LinkedIn PDF...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Run LinkedIn Audit
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAnalyzeManual} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#111827]">
                      LinkedIn Profile URL *
                    </Label>
                    <Input
                      name="profileUrl"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.profileUrl}
                      onChange={handleChange}
                      className="h-10 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] font-mono text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#111827]">
                        Current Headline
                      </Label>
                      <Input
                        name="headline"
                        placeholder="e.g. Senior Backend Engineer | Go, K8s, AWS"
                        value={formData.headline}
                        onChange={handleChange}
                        className="h-10 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#111827]">
                        Skill Keywords
                      </Label>
                      <Input
                        name="skills"
                        placeholder="e.g. Go, Kubernetes, PostgreSQL, Kafka"
                        value={formData.skills}
                        onChange={handleChange}
                        className="h-10 bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#111827]">
                      About Section Summary
                    </Label>
                    <Textarea
                      name="about"
                      placeholder="Paste your LinkedIn About section summary text..."
                      value={formData.about}
                      onChange={handleChange}
                      rows={3}
                      className="bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#F0F4F0] flex justify-end">
                    <button
                      disabled={loading}
                      type="submit"
                      className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="h-4 w-4 text-white" />
                          Evaluating Search Rank...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Analyze Profile
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ═══ Right Column (Span 5): Recruiter SEO Engine ═══ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111827]">
                  Recruiter Inbound Algorithm
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2 py-0.5 rounded-md">
                  SEO Signals
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {LINKEDIN_SEO_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] flex items-start gap-3 transition-colors hover:bg-[#F4F7F4]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] text-[#113D2B] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#111827]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] p-4 text-xs text-[#6B7280] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#113D2B] shrink-0 mt-0.5" />
              <span>
                Tip: Tech recruiters filter by specific stacks (e.g. Next.js, Postgres) in headlines before clicking profile previews.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Forest Pine Hero Card */}
          <div className="rounded-3xl bg-[#113D2B] text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <Linkedin size={18} className="text-[#EAF5EE]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                  Recruiter Inbound Index
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-display)]">
                {analysis.recruiter_attractiveness}% Discoverability
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Your profile rank reflects keyword density and headline search discoverability for technical engineering roles.
              </p>
            </div>

            <div className="flex items-center justify-center p-4 rounded-2xl bg-white/10 border border-white/15 shrink-0">
              <ScoreRing score={analysis.recruiter_attractiveness} label="Recruiter Rank" size={105} />
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
