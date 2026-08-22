"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-7 pb-10 text-[#111827]">
      <PageHeader
        title="Settings & Preferences"
        description="Manage your account profile and environment preferences."
      />

      <Card className="rounded-3xl border border-[#E5EBE5] bg-white p-6 sm:p-8 shadow-2xs">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-base font-bold text-[#111827]">
            Account Preferences
          </h3>
          <p className="text-xs text-[#6B7280]">
            Profile management, API keys, and environment settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
