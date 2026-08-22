"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calculator, Sparkles, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingCalculatorPage() {
  const [campaignType, setCampaignType] = useState("UGC");
  const [targetOutcomes, setTargetOutcomes] = useState(50);
  const [vendorUnitPrice, setVendorUnitPrice] = useState(1500);
  const [participantReward, setParticipantReward] = useState(1000);

  const presets: Record<string, { price: number; reward: number }> = {
    AWARENESS: { price: 100, reward: 65 },
    SURVEY: { price: 250, reward: 160 },
    UGC: { price: 1500, reward: 1000 },
    FIELD_OPS: { price: 350, reward: 220 },
    LEADS: { price: 600, reward: 380 }
  };

  const handleSelectType = (type: string) => {
    setCampaignType(type);
    setVendorUnitPrice(presets[type].price);
    setParticipantReward(presets[type].reward);
  };

  const grossBudget = targetOutcomes * vendorUnitPrice;
  const totalRewards = targetOutcomes * participantReward;
  const paymentGateway = grossBudget * 0.02;
  const verificationCost = targetOutcomes * (campaignType === "AWARENESS" ? 1 : campaignType === "SURVEY" ? 15 : campaignType === "UGC" ? 65 : 20);
  const fraudReserve = grossBudget * 0.03;
  const netContribution = grossBudget - totalRewards - paymentGateway - verificationCost - fraudReserve;
  const marginPercent = grossBudget > 0 ? (netContribution / grossBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet-light text-brand-violet font-bold text-xs">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Financial Model</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-navy">Campaign Unit-Economics Calculator</h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Transparent pricing breakdown showing participant rewards, gateway charges, moderation reserves, and net contribution.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Campaign Pillar</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "AWARENESS", label: "Video Quiz" },
                  { id: "SURVEY", label: "Private UX Study" },
                  { id: "UGC", label: "Creator UGC Video" },
                  { id: "FIELD_OPS", label: "Store Audit" },
                  { id: "LEADS", label: "Qualified Lead" }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectType(p.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      campaignType === p.id
                        ? "gradient-brand text-white border-transparent shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Verified Outcomes</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  step="10"
                  value={targetOutcomes}
                  onChange={(e) => setTargetOutcomes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price to Vendor (₹ / Action)</label>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={vendorUnitPrice}
                  onChange={(e) => setVendorUnitPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Participant Reward (₹ / Completed Action)</label>
              <input
                type="number"
                min="20"
                step="5"
                value={participantReward}
                onChange={(e) => setParticipantReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy"
              />
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-violet" />
                Financial Invariant Breakdown
              </h2>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5 font-bold text-brand-navy text-sm">
                  <span>Gross Campaign Escrow:</span>
                  <span>₹{grossBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-600">
                  <span>Total Participant Rewards:</span>
                  <span className="font-semibold text-brand-navy">-₹{totalRewards.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-500">
                  <span>Payment Gateway (2%):</span>
                  <span>-₹{paymentGateway.toFixed(0)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-500">
                  <span>Verification SLA Operations:</span>
                  <span>-₹{verificationCost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-500">
                  <span>Fraud & Dispute Reserve (3%):</span>
                  <span>-₹{fraudReserve.toFixed(0)}</span>
                </div>
                <div className="flex justify-between py-2 font-black text-emerald-700 text-base">
                  <span>Net Incorvo Contribution:</span>
                  <span>₹{netContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800">
                  Net Contribution Margin: {marginPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            <Link
              href="/vendor-application"
              className="w-full py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Launch Design Partner Pilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
