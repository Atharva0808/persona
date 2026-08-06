"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  X,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing } from "@/components/ui/score";
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
    <div className="space-y-8 text-neutral-100">
      <PageHeader
        title="Resume ATS Audit"
        description="Upload your PDF resume for action verb detection, ATS keyword matching, and bullet-point rewrites."
        actions={
          analysis ? (
            <Button
              variant="outline"
              size="sm"
              onClick={resetAnalysis}
              className="rounded-xl border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              New Audit
            </Button>
          ) : null
        }
      />

      {!analysis ? (
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
                      {(file.size / 1024 / 1024).toFixed(2)} MB PDF Document
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
                      Drag & drop your resume PDF
                    </p>
                    <p className="text-xs text-neutral-500 font-normal">
                      Or select a file from your device (PDF up to 5 MB)
                    </p>
                  </div>
                  <label className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer transition-colors border border-neutral-700">
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

            <div className="flex justify-end">
              <ShimmerButton
                shimmerColor="#f59e0b"
                shimmerDuration="2.5s"
                borderRadius="12px"
                disabled={!file || loading}
                onClick={handleAnalyze}
                className="h-11 px-6 text-sm font-semibold text-amber-100 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-amber-300" />
                    Parsing PDF...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Run ATS Audit
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </span>
                )}
              </ShimmerButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview Score Box */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                ATS Compatibility Report
              </div>
              <h2 className="text-xl font-bold text-neutral-100">
                Score: {analysis.ats_score} / 100
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {analysis.overall_feedback}
              </p>
            </div>

            <div className="flex items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 shrink-0">
              <ScoreRing score={analysis.ats_score} label="ATS Rating" size={100} />
            </div>
          </div>

          {/* Section Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.sections.map((section) => (
              <div key={section.name} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5">
                  <h3 className="text-sm font-semibold text-neutral-200">{section.name}</h3>
                  <span className="text-xs font-mono text-neutral-400">{section.score} / 100</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{section.feedback}</p>
                {section.suggestions.length > 0 && (
                  <div className="space-y-1 pt-2">
                    {section.suggestions.map((sug, i) => (
                      <div key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
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
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Bullet Point Rewrites ({analysis.weak_bullets.length})
                </h3>
              </div>

              <div className="space-y-3">
                {analysis.weak_bullets.map((bullet, idx) => (
                  <div key={idx} className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-xs">
                    <div className="text-rose-400 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="line-through text-neutral-500">{bullet.original}</span>
                    </div>

                    <div className="text-neutral-200 flex items-start gap-2 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-mono">{bullet.suggestion}</span>
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
