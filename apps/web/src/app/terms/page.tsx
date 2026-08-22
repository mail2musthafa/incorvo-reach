"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-brand-navy">Terms of Service</h1>
          <p className="text-xs text-brand-muted">Last updated: August 2026 • Incorvo Reach</p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">1. Platform Nature & Two-Sided Marketplace</h2>
            <p>
              Incorvo Reach is operated by Incorvo Reach. The platform connects verified business vendors requiring measurable customer outcomes (research, qualitative survey feedback, original UGC, store visits, referrals) with willing participants.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">2. Prohibited Artificial Engagement</h2>
            <p>
              The platform strictly disallows and legally prohibits campaigns soliciting paid 5-star reviews on public review registries, forced social media following, bot engagement, or click manipulation. Violations lead to immediate escrow forfeiture and account termination.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">3. Double-Entry Escrow & Rewards</h2>
            <p>
              Vendor campaign budgets are maintained in an immutable double-entry platform ledger. Participant rewards are credited upon verified completion and are withdrawable via licensed payment aggregators according to applicable minimum thresholds.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
