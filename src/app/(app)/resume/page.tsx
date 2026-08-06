"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing, ScoreBar } from "@/components/ui/score";
import type { ResumeAnalysis } from "@/lib/types";

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <PageHeader
        title="ATS Resume Parsing & Bullet Rewriter"
        description="Upload your PDF resume for action verb detection, ATS keyword matching, and quantified rewrites."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={resetAnalysis}
              className="rounded-xl border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-amber-300"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Analysis
            </Button>
          ) : null
        }
      />

      {!analysis ? (
        <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 shadow-2xl p-6 sm:p-10">
          <CardContent className="p-0 space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                dragActive
                  ? "border-amber-400 bg-amber-400/[0.05]"
                  : file
                  ? "border-amber-500/40 bg-amber-500/[0.02]"
                  : "border-white/10 hover:border-amber-500/30 bg-black/30"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-100 font-mono">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {(file.size / 1024 / 1024).toFixed(2)} MB PDF Document
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Remove file
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-400">
                    <Upload className="h-8 w-8 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-200">
                      Drag & drop your resume PDF here
                    </p>
                    <p className="text-xs text-slate-400 font-normal">
                      Or click to browse from your computer (max 5 MB)
                    </p>
                  </div>
                  <label className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-slate-200 cursor-pointer transition-colors border border-white/10">
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

            <div className="flex justify-end pt-2">
              <ShimmerButton
                shimmerColor="#f59e0b"
                shimmerDuration="2.5s"
                borderRadius="16px"
                disabled={!file || loading}
                onClick={handleAnalyze}
                className="h-12 px-8 text-sm font-semibold text-amber-100 disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-amber-950/40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-amber-300" />
                    Parsing PDF Engine...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Run ATS Analysis
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </span>
                )}
              </ShimmerButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Overview Score Card */}
          <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ATS Keyword Optimization Report</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                  Overall ATS Compatibility Score
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {analysis.overall_feedback}
                </p>
              </div>

              <div className="flex items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/[0.06] shrink-0">
                <ScoreRing score={analysis.ats_score} label="ATS Score" size={120} />
              </div>
            </div>
          </Card>

          {/* Section Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.sections.map((section) => (
              <Card key={section.name} className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-100">{section.name}</h3>
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                    {section.score} / 100
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">{section.feedback}</p>
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
              </Card>
            ))}
          </div>

          {/* Weak Bullet Rewrites */}
          {analysis.weak_bullets.length > 0 && (
            <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide uppercase text-xs text-amber-400">
                  Weak Bullet Point Quantified Rewrites
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {analysis.weak_bullets.length} Weak Bullets Detected
                </span>
              </div>

              <div className="space-y-4">
                {analysis.weak_bullets.map((bullet, idx) => (
                  <div key={idx} className="space-y-3 rounded-2xl border border-white/[0.06] bg-black/40 p-5">
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs">
                      <div className="text-rose-400 font-semibold mb-1 flex items-center gap-2 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" /> Weak Bullet:
                      </div>
                      <p className="text-slate-400 line-through pl-5 font-normal">{bullet.original}</p>
                    </div>

                    <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3.5 text-xs">
                      <div className="text-amber-300 font-semibold mb-1 flex items-center gap-2 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> AI Action Rewrite:
                      </div>
                      <p className="text-slate-100 pl-5 font-mono text-[12px] leading-relaxed">{bullet.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </motion.div>
  );
}
