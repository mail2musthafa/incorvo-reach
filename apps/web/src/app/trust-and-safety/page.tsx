"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, ShieldAlert, CheckCircle2, Lock, XCircle, AlertTriangle } from "lucide-react";

export default function TrustAndSafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <section className="pt-16 pb-20 bg-brand-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-brand-violet text-xs font-bold border border-slate-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Integrity Charter & Anti-Fraud Pledge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Trust & Safety Framework
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Incorvo Reach operates under strict legal, ethical, and verification standards to protect businesses from bot fraud and participants from unfair rejections.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Prohibited Activities Card */}
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Strictly Prohibited Campaign Types</h2>
              <p className="text-xs text-brand-muted">Campaigns violating these rules are permanently rejected and reported.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
              <span><strong>Paid Public Reviews:</strong> Rewarding participants for leaving 5-star reviews on Google Maps, Amazon, or App Store is strictly forbidden.</span>
            </div>
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
              <span><strong>Artificial Social Growth:</strong> Paid likes, follows, fake subscriber milestones, or retweet farms are automatically blocked.</span>
            </div>
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
              <span><strong>Ad-Click Fraud:</strong> Incentivized pay-per-click traffic or click-through manipulation on external ad networks is disallowed.</span>
            </div>
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
              <span><strong>Conditional Positive Bias:</strong> Making payouts conditional on submitting flattering feedback rather than honest evaluations.</span>
            </div>
          </div>
        </div>

        {/* Anti-Fraud Tech Stack */}
        <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-violet-light text-brand-violet">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Active Anti-Fraud Defenses</h2>
              <p className="text-xs text-brand-muted">Multi-layered security protecting marketplace integrity.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-brand-navy mb-1">Perceptual Image Hashing</h4>
              <p>Detects duplicate screenshot uploads, stock images, and doctored receipts across user submissions.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-brand-navy mb-1">Device Velocity Heuristics</h4>
              <p>Flags multi-accounting from single device hardware fingerprints and IP proxy pools.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-brand-navy mb-1">Double-Entry Financial Ledger</h4>
              <p>Immutable audit trail where every rupee in escrow is accounted for with cryptographic consistency.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
