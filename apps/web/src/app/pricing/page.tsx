"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <section className="pt-16 pb-20 bg-white border-b border-brand-border text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-violet-light text-brand-violet text-xs font-bold">
            <span>Flexible Outcome-Based Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy">
            Simple, Transparent Fee Model
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Deposit campaign budget, set your custom reward per verified action, and pay only 15% platform commission on approved submissions.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1: Starter / Pay-As-You-Go */}
          <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-xs hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block mb-2">Pay Per Action</span>
              <h3 className="text-2xl font-bold text-brand-navy mb-1">Standard Campaign</h3>
              <p className="text-xs text-slate-600 mb-6">Ideal for launching individual research or UGC campaigns.</p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-extrabold text-brand-navy">15%</span>
                <span className="text-xs text-slate-500 block mt-1">Platform fee on verified actions</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access to all 12 campaign templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated fraud & duplicate detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Double-entry ledger escrow protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Standard submission moderation queue</span>
                </li>
              </ul>
            </div>

            <Link
              href="/vendor-application"
              className="mt-8 w-full py-3 rounded-xl border border-brand-violet text-brand-violet font-semibold text-center text-sm hover:bg-brand-violet-light transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Plan 2: Growth (Featured) */}
          <div className="bg-brand-navy text-white p-8 rounded-2xl border-2 border-brand-violet shadow-card relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-violet text-white text-[11px] font-bold tracking-wide">
              MOST POPULAR
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">Growth Tier</span>
              <h3 className="text-2xl font-bold text-white mb-1">Scale Subscription</h3>
              <p className="text-xs text-slate-300 mb-6">For brands running continuous multi-channel missions.</p>

              <div className="mb-6 pb-6 border-b border-slate-700">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹14,999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <span className="text-xs text-emerald-400 block mt-1">+ Reduced 10% platform commission</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority human verification queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom demographic cohort targeting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Commercial UGC asset license manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated brand success manager</span>
                </li>
              </ul>
            </div>

            <Link
              href="/vendor-application"
              className="mt-8 w-full py-3 rounded-xl gradient-brand text-white font-semibold text-center text-sm shadow-card hover:brightness-105 transition-all"
            >
              Launch Growth Plan
            </Link>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-xs hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block mb-2">Custom Volume</span>
              <h3 className="text-2xl font-bold text-brand-navy mb-1">Enterprise Custom</h3>
              <p className="text-xs text-slate-600 mb-6">For large retail chains, enterprise B2B and FMCG conglomerates.</p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-extrabold text-brand-navy">Custom</span>
                <span className="text-xs text-slate-500 block mt-1">Volume SLA discounts</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom API & POS webhook integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated moderation team</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom contract & billing terms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Quarterly strategy and consumer insights</span>
                </li>
              </ul>
            </div>

            <Link
              href="/vendor-application"
              className="mt-8 w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-center text-sm hover:bg-slate-50 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
