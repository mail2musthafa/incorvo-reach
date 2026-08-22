"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Building2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Layers,
  BarChart3,
  Users2,
  Sparkles,
} from "lucide-react";

export default function ForBusinessesPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Guaranteed Authentic Actions",
      desc: "Every submission undergoes multi-step verification before any reward is dispersed. Zero bot clicks or fabricated engagements.",
    },
    {
      icon: Lock,
      title: "Escrow-Protected Budgets",
      desc: "Your campaign funds sit safely in an immutable double-entry platform ledger. Funds are debited only for approved, verified actions.",
    },
    {
      icon: Users2,
      title: "Targeted Customer Audiences",
      desc: "Reach exact consumer personas filtered by age groups, geographies, professions, and verified behavioral interests.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Action Analytics",
      desc: "Track cost per verified action (CPVA), completion velocity, lead quality scores, and qualitative sentiment dashboards in real time.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-20 bg-white border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-violet-light border border-brand-violet/20 text-brand-violet text-xs font-bold">
            <Building2 className="w-4 h-4" />
            <span>Incorvo Reach for Enterprise & Growth Brands</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
            Stop Paying for Impressions. <br />
            <span className="gradient-text">Pay for Verified Customer Actions.</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Traditional digital advertising charges for ad views, inflated CTRs, and accidental taps. Incorvo Reach aligns vendor incentives around concrete outcomes: qualified research, authentic UGC, on-site visits, and genuine leads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/vendor-application"
              className="px-8 py-3.5 rounded-xl font-semibold text-white gradient-brand shadow-card hover:shadow-card-hover text-base transition-all flex items-center gap-2"
            >
              <span>Apply for Vendor Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/campaign-types"
              className="px-8 py-3.5 rounded-xl font-semibold text-brand-navy bg-slate-50 border border-brand-border hover:bg-slate-100 text-base transition-all"
            >
              Explore 12 Campaign Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-brand-border shadow-xs hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-violet-light flex items-center justify-center text-brand-violet mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white border-t border-brand-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet mb-2">Performance Comparison</h2>
            <h3 className="text-3xl font-extrabold text-brand-navy">Traditional Ads vs Incorvo Reach</h3>
          </div>

          <div className="overflow-x-auto border border-brand-border rounded-2xl shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-brand-border text-xs uppercase font-bold text-slate-600">
                <tr>
                  <th className="py-4 px-6">Criteria</th>
                  <th className="py-4 px-6 text-slate-500">Traditional Ad Platforms</th>
                  <th className="py-4 px-6 text-brand-violet font-extrabold bg-brand-violet-light/30">Incorvo Reach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-6 font-semibold text-brand-navy">Billing Model</td>
                  <td className="py-4 px-6 text-slate-500">Pay per CPM / CPC regardless of outcome</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-brand-violet-light/10">Pay strictly per verified action</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-brand-navy">Bot & Click Fraud</td>
                  <td className="py-4 px-6 text-slate-500">15-30% industry average click waste</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-brand-violet-light/10">0% fraud risk (multi-layered proof verification)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-brand-navy">Content Ownership</td>
                  <td className="py-4 px-6 text-slate-500">None (ephemeral sponsored tag)</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-brand-violet-light/10">Commercial licensing rights on submitted UGC</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-brand-navy">Customer Research</td>
                  <td className="py-4 px-6 text-slate-500">Coarse demographic estimates</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-brand-violet-light/10">Granular, direct survey answers & media artifacts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
