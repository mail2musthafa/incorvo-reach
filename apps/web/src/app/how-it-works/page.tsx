"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Building2, UserCheck, ShieldCheck, ArrowRight, CheckCircle2, Lock, Coins } from "lucide-react";

export default function HowItWorksPage() {
  const [tab, setTab] = useState<"vendors" | "participants">("vendors");

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <section className="pt-16 pb-20 bg-white border-b border-brand-border text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-violet-light text-brand-violet text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-End Action Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy">
            How Incorvo Reach Works
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            From verified business onboarding and campaign funding to participant execution, multi-layer verification, and instant UPI payouts.
          </p>

          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setTab("vendors")}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === "vendors" ? "bg-white text-brand-navy shadow-xs" : "text-slate-600"
                }`}
              >
                For Businesses / Brands
              </button>
              <button
                onClick={() => setTab("participants")}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === "participants" ? "bg-white text-brand-navy shadow-xs" : "text-slate-600"
                }`}
              >
                For Participants / Earners
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {tab === "vendors" ? (
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Business Identity Verification",
                desc: "Vendors submit company incorporation and GST credentials to guarantee genuine business sponsorship.",
              },
              {
                step: "02",
                title: "Template & Outcome Selection",
                desc: "Choose from 12 structured campaign templates (UGC video, private research survey, demo booking, store QR check-in).",
              },
              {
                step: "03",
                title: "Reward Reserve Funding",
                desc: "Deposit campaign funds held in an immutable double-entry platform ledger. Funds are debited strictly on proof approval.",
              },
              {
                step: "04",
                title: "Automated & Human Moderation",
                desc: "Review submitted photos, videos, and survey feedback with perceptual hash checking, device velocity scores, and custom feedback.",
              },
              {
                step: "05",
                title: "Outcome Delivery & Reporting",
                desc: "Download high-definition UGC assets with commercial usage rights, qualified leads, and aggregated qualitative consumer sentiment.",
              },
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs flex items-start gap-4">
                <span className="w-10 h-10 rounded-xl bg-brand-violet-light text-brand-violet font-black text-sm flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-bold text-base text-brand-navy mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Profile Onboarding & Verification",
                desc: "Sign up, verify phone/email, and configure your demographic and interest preferences.",
              },
              {
                step: "02",
                title: "Discover & Reserve Missions",
                desc: "Browse tasks matching your interests. Lock in a spot with a guaranteed 24-hour completion window.",
              },
              {
                step: "03",
                title: "Complete Tasks & Upload Proof",
                desc: "Follow the step-by-step checklist, answer survey questions, or upload HD video/photo proof.",
              },
              {
                step: "04",
                title: "Approval & Immediate Reward Settlement",
                desc: "Once verified, rewards are credited directly to your withdrawable ledger balance.",
              },
              {
                step: "05",
                title: "Withdraw to UPI or Bank Account",
                desc: "Request instant payouts directly to your UPI handle or bank account upon meeting the ₹500 threshold.",
              },
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs flex items-start gap-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-black text-sm flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-bold text-base text-brand-navy mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
