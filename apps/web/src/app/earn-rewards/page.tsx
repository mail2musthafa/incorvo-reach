"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Smartphone,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function EarnRewardsPage() {
  const steps = [
    {
      title: "1. Build Your Participant Profile",
      desc: "Complete your profile with your location, age group, and areas of genuine interest. We only recommend missions that match you.",
      icon: Smartphone,
    },
    {
      title: "2. Pick Missions You Care About",
      desc: "Explore honest surveys, unboxing tests, vertical video UGC briefs, and local store visits with transparent reward amounts.",
      icon: Sparkles,
    },
    {
      title: "3. Complete & Upload Proof",
      desc: "Submit your honest feedback or photo/video artifacts via our intuitive mobile-optimized mission workflow.",
      icon: CheckCircle2,
    },
    {
      title: "4. Receive Instant Bank / UPI Payouts",
      desc: "Once verified, rewards are credited to your withdrawable ledger balance. Request payouts directly to your UPI handle or bank account.",
      icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <section className="pt-16 pb-20 bg-white border-b border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Coins className="w-4 h-4" />
            <span>Earn for Genuine Insights & Content</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy">
            Get Rewarded for Real Customer Actions.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            No bot clicks or fake social media tasks. Share honest consumer feedback, create authentic UGC videos, and test exciting new products from verified brands.
          </p>

          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white gradient-brand shadow-card hover:shadow-card-hover"
            >
              <span>Sign Up as Participant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-violet-light text-brand-violet flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-brand-navy mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
