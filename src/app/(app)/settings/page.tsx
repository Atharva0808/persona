"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <PageHeader
        title="Settings & Preferences"
        description="Manage your account profile and environment preferences."
      />

      <Card className="rounded-3xl border border-white/[0.08] bg-[#0d0e15]/80 p-6 sm:p-8 shadow-2xl">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-base font-semibold text-slate-100">Account Preferences</h3>
          <p className="text-xs text-slate-400 font-mono">
            Profile management and API configuration panel.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
