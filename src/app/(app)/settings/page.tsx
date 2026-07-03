"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <div className="grid gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-400">Settings functionality coming soon.</p>
            <Button variant="outline" disabled>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
