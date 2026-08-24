"use client";

import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  X,
  RefreshCw,
  ShieldCheck,
  Zap,
  Layers,
  FileCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
import type { ResumeAnalysis } from "@/lib/types";

const ATS_RUBRIC_ITEMS = [
  {
    title: "Keyword & Hard Skill Density",
    desc: "Extracts role-specific technical skills, libraries, and frameworks against modern job descriptions.",
    icon: Layers,
  },
  {
    title: "Google XYZ Bullet Structure",
    desc: "Flags passive phrases and rewrites bullets into 'Accomplished [X], as measured by [Y], by doing [Z]'.",
    icon: Zap,
  },
  {
    title: "Parsing & Hygiene Standards",
    desc: "Ensures single-column layout, standard section titles, and zero unreadable text in tables or shapes.",
    icon: ShieldCheck,
  },
  {
    title: "Seniority & Scope Signals",
    desc: "Evaluates leadership scope, architecture ownership, and quantifiable production impact.",
    icon: FileCheck,
  },
];

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
      toast.success("Resume analyzed successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze resume";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
  };

  return (
    <div className="space-y-7 pb-10 text-[#111827]">
      <PageHeader
        title="Resume ATS Audit"
        description="Upload your PDF resume for action verb detection, ATS keyword matching, and bullet-point rewrites."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={resetAnalysis}
              className="rounded-xl border-[#113D2B] text-[#113D2B] hover:bg-[#EAF5EE] font-bold text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Audit
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ═══ Left Column (Span 7): Upload Workspace ═══ */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0F4F0] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    Upload Resume Document
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Direct PDF parsing with OCR and keyword taxonomy mapping
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-1 rounded-lg">
                  PDF Format
                </span>
              </div>

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
                        {(file.size / 1024 / 1024).toFixed(2)} MB PDF Document
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
                        Drag & drop your resume PDF here
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Standard single or dual-column engineering resume (up to 5 MB)
                      </p>
                    </div>
                    <label className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold bg-[#113D2B] hover:bg-[#0D3122] text-white cursor-pointer transition-colors shadow-xs">
                      Browse Files
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0F4F0]">
                <span className="text-xs text-[#6B7280]">
                  {file ? "File selected and ready for parsing" : "No file selected"}
                </span>
                <button
                  disabled={!file || loading}
                  onClick={handleAnalyze}
                  className="h-11 px-7 rounded-xl bg-[#113D2B] hover:bg-[#0D3122] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4 text-white" />
                      Parsing PDF Structure...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Run ATS Audit
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ═══ Right Column (Span 5): ATS Evaluation Rubric ═══ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111827]">
                  ATS Evaluation Rubric
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2 py-0.5 rounded-md">
                  4 Vectors
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {ATS_RUBRIC_ITEMS.map((item, idx) => (
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

            {/* Quick Tip Box */}
            <div className="rounded-2xl bg-[#FAFBF9] border border-[#E5EBE5] p-4 text-xs text-[#6B7280] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#113D2B] shrink-0 mt-0.5" />
              <span>
                Tip: Standard ATS systems like Greenhouse, Lever, and Workday favor clean heading tags (e.g. Experience, Education, Technical Skills) with quantifiable metric bullets.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Forest Pine Hero Summary Card */}
          <div className="rounded-3xl bg-[#113D2B] text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#EAF5EE]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                  ATS Diagnostic Report
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-display)]">
                {analysis.ats_score}% Match
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {analysis.overall_feedback}
              </p>
            </div>

            <div className="flex items-center justify-center p-4 rounded-2xl bg-white/10 border border-white/15 shrink-0">
              <ScoreRing score={analysis.ats_score} label="ATS Rating" size={105} />
            </div>
          </div>

          {/* Section Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.sections.map((section) => (
              <div
                key={section.name}
                className="rounded-3xl border border-[#E5EBE5] bg-white p-6 space-y-3 shadow-2xs hover:border-[#113D2B]/30 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-[#E5EBE5] pb-3">
                  <h3 className="text-sm font-bold text-[#111827]">
                    {section.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#113D2B] bg-[#EAF5EE] px-2.5 py-0.5 rounded-lg">
                    {section.score} / 100
                  </span>
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
            ))}
          </div>

          {/* Weak Bullet Rewrites */}
          {analysis.weak_bullets.length > 0 && (
            <div className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E5EBE5] pb-3">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono">
                  Quantified Bullet Point Rewrites ({analysis.weak_bullets.length})
                </h3>
                <span className="text-[11px] font-mono text-[#6B7280]">
                  Google XYZ Framework
                </span>
              </div>

              <div className="space-y-3">
                {analysis.weak_bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="space-y-2.5 rounded-2xl border border-[#E5EBE5] bg-[#FAFBF9] p-4 text-xs"
                  >
                    <div className="text-rose-600 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                      <span className="line-through text-[#6B7280]">
                        {bullet.original}
                      </span>
                    </div>

                    <div className="text-[#111827] flex items-start gap-2 pt-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#113D2B] shrink-0 mt-0.5" />
                      <span>{bullet.suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
