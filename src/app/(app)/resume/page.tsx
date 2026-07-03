"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ScoreRing, ScoreBar } from "@/components/ui/score";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Resume Analysis"
        description="Upload your resume to get an ATS score and improvement suggestions."
        actions={
          analysis ? (
            <Button variant="outline" size="sm" onClick={resetAnalysis}>
              New Analysis
            </Button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Upload Zone */}
            <Card>
              <CardContent className="p-8">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    dragActive
                      ? "border-white bg-neutral-800/50"
                      : file
                      ? "border-emerald-800 bg-emerald-950/20"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="resume-upload"
                  />

                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <FileText className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-200">
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700">
                        <Upload className="h-6 w-6 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-300">
                          Drop your resume here or click to browse
                        </p>
                        <p className="text-xs text-neutral-600 mt-1">
                          PDF files only, up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {file && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={handleAnalyze}
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="text-neutral-950" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze Resume
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
            {/* Score Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <ScoreRing
                    score={analysis.ats_score}
                    size={140}
                    label="ATS Score"
                  />
                  <p className="text-sm text-neutral-500 mt-4 text-center">
                    {analysis.ats_score >= 80
                      ? "Excellent! Your resume is well-optimized."
                      : analysis.ats_score >= 60
                      ? "Good foundation, but there's room to improve."
                      : "Needs significant improvement for ATS systems."}
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    {analysis.overall_feedback}
                  </p>
                  <div className="space-y-3">
                    {analysis.sections?.map((section) => (
                      <ScoreBar
                        key={section.name}
                        score={section.score}
                        label={section.name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weak Bullets */}
            {analysis.weak_bullets && analysis.weak_bullets.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <CardTitle>Weak Bullet Points</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.weak_bullets.map((bullet, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-neutral-800 p-4 space-y-2"
                      >
                        <div className="flex items-start gap-2">
                          <Badge variant="warning" className="mt-0.5 shrink-0">
                            {bullet.section}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500 line-through">
                          {bullet.original}
                        </p>
                        <p className="text-xs text-amber-400">{bullet.issue}</p>
                        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-neutral-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <p className="text-sm text-emerald-400">
                            {bullet.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Improvements & Missing Skills */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.improvements && analysis.improvements.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-400" />
                      <CardTitle>Suggested Improvements</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-neutral-400"
                        >
                          <ArrowRight className="h-3.5 w-3.5 text-neutral-600 mt-0.5 shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Missing Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_skills.map((skill, i) => (
                        <Badge key={i} variant="destructive">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500 mt-4">
                      Consider adding these skills to your resume if you have
                      experience with them.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Section Details */}
            {analysis.sections && analysis.sections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Section-by-Section Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.sections.map((section, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-neutral-200">
                            {section.name}
                          </span>
                          <Badge
                            variant={
                              section.score >= 80
                                ? "success"
                                : section.score >= 60
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {section.score}/100
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500 mb-2">
                          {section.feedback}
                        </p>
                        {section.suggestions && section.suggestions.length > 0 && (
                          <ul className="space-y-1 ml-4">
                            {section.suggestions.map((suggestion, j) => (
                              <li
                                key={j}
                                className="text-xs text-neutral-500 list-disc"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}
                        {i < analysis.sections.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
