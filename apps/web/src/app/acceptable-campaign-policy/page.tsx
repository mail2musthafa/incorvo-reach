"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

export default function AcceptableCampaignPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Acceptable Campaign Policy</h1>
              <p className="text-xs text-brand-muted">Incorvo Reach • Enforced on All Campaigns</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-brand-navy">1. The Anti-Fake-Engagement Standard</h2>
            <p>
              Incorvo Reach was created on the foundational principle that businesses must pay for authentic, verifiable customer actions—not artificial social metrics.
            </p>
            <p>Under this policy, campaigns are strictly forbidden from demanding:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Paid positive reviews or 5-star rating manipulation on Google, Amazon, App Store, or Trustpilot.</li>
              <li>Artificial social media following, bot views, or forced YouTube/Instagram subscriptions.</li>
              <li>Copied/templated comment spamming on third-party forums.</li>
              <li>Incentivized advertisement click manipulation or pay-per-click gaming.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">2. Mandatory Objective Criteria</h2>
            <p>
              Every campaign must contain objective, documented verification criteria (e.g., passing a quiz score, submitting uncoerced qualitative research, physical GPS/QR check-in, or verified order receipts).
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
