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
  HelpCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import type { LinkedInAnalysis, SectionAnalysis } from "@/lib/types";

export default function LinkedInPage() {
  const [activeTab, setActiveTab] = useState<"pdf" | "manual">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

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
        className="rounded-3xl border border-[#E5EBE5] bg-white p-6 space-y-3 shadow-2xs"
      >
        <div className="flex items-center justify-between border-b border-[#E5EBE5] pb-3">
          <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
          <span className="text-xs font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-0.5 rounded-lg">
            {section.score} / 100
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] text-xs">
            <span className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1">
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
            <div className="space-y-1.5 pt-2 border-t border-[#E5EBE5]">
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
              className="rounded-xl border-[#E5EBE5] text-[#111827] hover:bg-[#F4F7F4] font-medium"
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
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 relative space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#113D2B] font-bold uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#113D2B]" />
                  How to export your LinkedIn Profile PDF in 3 seconds
                </span>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-[#9CA3AF] hover:text-[#111827] text-xs cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#6B7280]">
                <li className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9]">
                  <span className="text-[#113D2B] font-bold mr-1">1.</span> Open your profile page on LinkedIn.
                </li>
                <li className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9]">
                  <span className="text-[#113D2B] font-bold mr-1">2.</span> Click the <strong className="text-[#111827]">&quot;More&quot;</strong> button near your header.
                </li>
                <li className="p-3.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9]">
                  <span className="text-[#113D2B] font-bold mr-1">3.</span> Select <strong className="text-[#111827]">&quot;Save to PDF&quot;</strong> &amp; upload below!
                </li>
              </ol>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-[#E5EBE5] gap-6 text-xs">
            <button
              onClick={() => setActiveTab("pdf")}
              className={`pb-3 font-bold transition-colors cursor-pointer ${
                activeTab === "pdf"
                  ? "border-b-2 border-[#113D2B] text-[#113D2B]"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Upload LinkedIn PDF (Recommended)
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`pb-3 font-bold transition-colors cursor-pointer ${
                activeTab === "manual"
                  ? "border-b-2 border-[#113D2B] text-[#113D2B]"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Manual Form Input
            </button>
          </div>

          {activeTab === "pdf" ? (
            <Card className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs">
              <CardContent className="p-0 space-y-6">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                    dragActive
                      ? "border-[#113D2B] bg-[#EAF5EE]"
                      : file
                      ? "border-[#113D2B]/40 bg-[#F4F7F4]"
                      : "border-[#E5EBE5] hover:border-[#113D2B]/40 bg-[#FAFBF9]"
                  }`}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] flex items-center justify-center text-[#113D2B]">
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
                        className="text-xs text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#F4F7F4] border border-[#E5EBE5] flex items-center justify-center text-[#6B7280]">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#111827]">
                          Upload your exported LinkedIn PDF
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          Drag & drop or select file from your device
                        </p>
                      </div>
                      <label className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold bg-[#113D2B] hover:bg-[#0D3122] text-white cursor-pointer transition-colors shadow-2xs">
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
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs">
              <CardContent className="p-0">
                <form onSubmit={handleAnalyzeManual} className="space-y-5 max-w-xl">
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
                        placeholder="e.g. Senior Software Engineer | React, Node.js"
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
                        placeholder="e.g. TypeScript, React, Next.js, Microservices"
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
                      rows={4}
                      className="bg-[#FAFBF9] border-[#E5EBE5] text-[#111827] rounded-xl focus:border-[#113D2B] text-sm resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
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
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-bold text-[#113D2B] uppercase tracking-wider">
                Recruiter Search Attractiveness
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Score: {analysis.recruiter_attractiveness} / 100
              </h2>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Your profile rank reflects inbound search matches for software engineering positions.
              </p>
            </div>

            <div className="flex items-center justify-center p-3 rounded-2xl bg-[#F4F7F4] border border-[#E5EBE5] shrink-0">
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
