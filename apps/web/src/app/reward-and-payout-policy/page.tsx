"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Wallet, ShieldCheck } from "lucide-react";

export default function RewardAndPayoutPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-violet-light text-brand-violet">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Reward & Payout Policy</h1>
              <p className="text-xs text-brand-muted">Incorvo Reach • Double-Entry Financial Governance</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">1. Allocated Campaign Funds & Ledger Integrity</h2>
            <p>
              When a vendor launches a campaign, funds are debited from the vendor available balance and allocated into a dedicated Campaign Reward Reserve within the platform ledger. These funds are held until participant submissions are approved or campaign reservations expire.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">2. Minimum Payout Threshold & KYC</h2>
            <p>
              Participant rewards accumulate in their Withdrawable Ledger Balance. Payouts can be requested at or above the minimum threshold of ₹500.00 directly to a verified UPI VPA or NEFT/IMPS bank account. Payouts are routed through licensed payment aggregators compliant with RBI Master Directions.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
