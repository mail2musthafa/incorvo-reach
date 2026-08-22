"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ErahAssistant } from "@/components/common/ErahAssistant";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSearch,
  Video,
  Users,
  MapPin,
  Ticket,
  UserPlus,
  ShieldAlert,
  BarChart3,
  Coins,
  CheckCircle,
  Clock,
  Layers,
  Award,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"vendors" | "participants">("vendors");

  const outcomes = [
    {
      title: "Customer Research",
      desc: "Deep qualitative insights and structured private surveys without public rating manipulation.",
      icon: FileSearch,
      metric: "100% Unbiased Feedback",
      suitable: "D2C, CPG, SaaS",
      badge: "High Depth",
    },
    {
      title: "Original UGC Video",
      desc: "Authentic, unscripted product demonstrations and high-definition vertical video content.",
      icon: Video,
      metric: "Verified Rights & HD Media",
      suitable: "Beauty, Wellness, Fashion",
      badge: "Content Rights",
    },
    {
      title: "Qualified Leads",
      desc: "Consent-based profile matching and genuine prospect inquiries with zero spam form fills.",
      icon: Users,
      metric: "94% Contact Authenticity",
      suitable: "EdTech, Real Estate, FinTech",
      badge: "High Intent",
    },
    {
      title: "Store & Event Check-ins",
      desc: "Rotating QR code kiosks and geofenced physical footfall validation at your locations.",
      icon: MapPin,
      metric: "Verified On-Site Presence",
      suitable: "Retail Chains, Dining, Gyms",
      badge: "Physical Footfall",
    },
    {
      title: "Referral Milestones",
      desc: "Fraud-resistant viral advocacy with multi-tier self-referral prevention algorithms.",
      icon: UserPlus,
      metric: "Zero Bot Referrals",
      suitable: "Subscription Apps, Marketplaces",
      badge: "Attributed ROI",
    },
    {
      title: "Product Sampling",
      desc: "Ship trial packs to targeted demographics and collect verified post-consumption evaluations.",
      icon: Sparkles,
      metric: "Full Dispatch Verification",
      suitable: "Food & Beverage, Skincare",
      badge: "Targeted Trial",
    },
  ];

  const verificationMethods = [
    { name: "Dynamic QR Kiosk Validation", desc: "Time-synchronized rotating check-in tokens prevent spoofing." },
    { name: "Perceptual Image & Hash Match", desc: "Detects duplicate and manipulated screenshot uploads." },
    { name: "Double-Entry Ledger Escrow", desc: "Vendor funds locked in escrow; paid out strictly upon proof approval." },
    { name: "Private Feedback Safeguard", desc: "No public rating manipulation or coerced 5-star reviews allowed." },
    { name: "Device Velocity Scoring", desc: "Identifies multi-accounting, emulator farms, and bot attacks." },
    { name: "Human Moderator Escalation", desc: "Trained verifiers review high-value UGC and complex disputes." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-violet/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-violet-light border border-brand-violet/20 text-brand-violet text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Actions. Measurable Growth.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-navy leading-[1.15]">
              Turn Customer Attention into{" "}
              <span className="gradient-text">Verified Business Outcomes.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Launch campaigns for customer research, product testing, original content, qualified leads, store visits, referrals and sales. Reward participants only after meaningful actions are verified.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/vendor-application"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white gradient-brand shadow-card hover:shadow-card-hover hover:brightness-105 transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <span>Apply for a Pilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/early-access"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-brand-navy bg-white border border-brand-border hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-subtle"
              >
                <span>Join Early Access</span>
                <Coins className="w-4 h-4 text-brand-violet" />
              </Link>
            </div>

            {/* Trust Line */}
            <div className="pt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <ShieldAlert className="w-4 h-4 text-brand-violet" />
              <span>No fake followers. No paid ratings. Only meaningful, verifiable actions.</span>
            </div>
          </div>

          {/* Interactive Product Preview Composition */}
          <div className="mt-14 lg:mt-18 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-violet-light flex items-center justify-center text-brand-violet font-bold">
                    NH
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-navy flex items-center gap-2">
                      NovaHealth Organics
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified Business
                      </span>
                    </h3>
                    <p className="text-xs text-brand-muted">Campaign Performance Overview • Real-time Metrics</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-brand-blue mr-1.5 animate-pulse"></span>
                    Live Marketplace
                  </span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-brand-muted font-medium block">Active Campaigns</span>
                  <span className="text-xl font-bold text-brand-navy mt-1 block">4</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-brand-muted font-medium block">Verified Actions</span>
                  <span className="text-xl font-bold text-emerald-600 mt-1 block">348</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-brand-muted font-medium block">Budget Deployed</span>
                  <span className="text-xl font-bold text-brand-navy mt-1 block">₹57,250</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-brand-muted font-medium block">Qualified Leads</span>
                  <span className="text-xl font-bold text-brand-violet mt-1 block">112</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-brand-muted font-medium block">Conversion Rate</span>
                  <span className="text-xl font-bold text-brand-navy mt-1 block">88.4%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-brand-muted font-medium block">Pending Review</span>
                  <span className="text-xl font-bold text-amber-600 mt-1 block">6</span>
                </div>
              </div>

              {/* Sample Mission Card Inside Preview */}
              <div className="mt-6 p-4 rounded-xl border border-brand-violet/20 bg-brand-violet-light/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-xs text-brand-violet">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy">
                      Plant-Based Protein Bar Flavor & Texture Study
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      12-point structured qualitative feedback • 97 spots remaining
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-brand-muted block">Participant Reward</span>
                    <span className="text-sm font-bold text-emerald-600">₹150.00 / action</span>
                  </div>
                  <Link
                    href="/participant/discover"
                    className="px-3.5 py-1.5 rounded-lg bg-brand-violet text-white text-xs font-semibold hover:bg-brand-violet-hover transition-colors"
                  >
                    View Task
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-20 bg-white border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet mb-2">Measurable Outcomes</h2>
            <h3 className="text-3xl font-extrabold text-brand-navy tracking-tight">
              Pay for Tangible Results, Not Empty Clicks
            </h3>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Every campaign template is engineered around a verifiable milestone with concrete business value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-brand-bg rounded-2xl p-6 border border-brand-border hover:border-brand-violet/40 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white border border-brand-border/80 flex items-center justify-center text-brand-violet shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-violet-light text-brand-violet border border-brand-violet/20">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-brand-navy">{item.title}</h4>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">Verification standard:</span>
                      <span className="font-semibold text-emerald-700">{item.metric}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">Top Industries:</span>
                      <span className="font-medium text-slate-700">{item.suitable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Tabbed Section */}
      <section id="how-it-works" className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet mb-2">Transparent Workflow</h2>
            <h3 className="text-3xl font-extrabold text-brand-navy tracking-tight">How Incorvo Reach Works</h3>
            
            {/* Tabs switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/70 mt-6">
              <button
                onClick={() => setActiveTab("vendors")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "vendors"
                    ? "bg-white text-brand-navy shadow-xs"
                    : "text-slate-600 hover:text-brand-navy"
                }`}
              >
                For Businesses
              </button>
              <button
                onClick={() => setActiveTab("participants")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "participants"
                    ? "bg-white text-brand-navy shadow-xs"
                    : "text-slate-600 hover:text-brand-navy"
                }`}
              >
                For Participants
              </button>
            </div>
          </div>

          {activeTab === "vendors" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { step: "01", title: "Verify Business", desc: "Submit GST/business credentials for marketplace trust." },
                { step: "02", title: "Define Outcome", desc: "Select from 12 structured templates (UGC, research, visits)." },
                { step: "03", title: "Choose Audience", desc: "Filter by age, geography, occupation and consumer interests." },
                { step: "04", title: "Fund Escrow", desc: "Deposit campaign budget locked in double-entry ledger." },
                { step: "05", title: "Verify Proof", desc: "Review genuine participant submissions with automated checks." },
                { step: "06", title: "Scale ROI", desc: "Download high-definition assets, leads and private data." },
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
                  <span className="text-2xl font-black text-brand-violet/30 block mb-2">{s.step}</span>
                  <h4 className="font-bold text-sm text-brand-navy mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { step: "01", title: "Create Profile", desc: "Set up your verified participant profile & payout details." },
                { step: "02", title: "Discover Missions", desc: "Explore tasks matching your interests and city." },
                { step: "03", title: "Accept & Reserve", desc: "Lock your spot with a dedicated completion window." },
                { step: "04", title: "Complete Task", desc: "Follow the transparent step-by-step checklist." },
                { step: "05", title: "Upload Proof", desc: "Submit unedited photos, video or structured responses." },
                { step: "06", title: "Instant Payout", desc: "Receive direct reward credits via UPI or bank account." },
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
                  <span className="text-2xl font-black text-brand-blue/40 block mb-2">{s.step}</span>
                  <h4 className="font-bold text-sm text-brand-navy mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-brand-violet text-xs font-semibold border border-slate-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Tolerance Policy</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Our Non-Negotiable Trust & Integrity Standard
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Incorvo Reach is fundamentally built to eliminate artificial online engagement. We proactively block and ban manipulation across all touchpoints:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  "No paid positive reviews or star manipulation",
                  "No artificial followers, views or likes",
                  "No forced social media subscriptions",
                  "No copied or AI bot comments",
                  "No ad-click farming or multi-account abuse",
                  "No conditional rewards based on 5-star ratings",
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/trust-and-safety"
                  className="px-5 py-2.5 rounded-xl bg-white text-brand-navy font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  Read Trust & Safety Charter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Engine Details */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet mb-2">Automated & Manual Checks</h2>
            <h3 className="text-3xl font-extrabold text-brand-navy tracking-tight">The Multi-Layer Verification Engine</h3>
            <p className="text-slate-600 mt-2 text-sm">
              How we guarantee that every rupee spent delivers genuine, fraud-free customer participation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verificationMethods.map((m, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs hover:shadow-card transition-all">
                <div className="w-8 h-8 rounded-lg bg-brand-violet-light text-brand-violet flex items-center justify-center font-bold text-xs mb-3">
                  0{i + 1}
                </div>
                <h4 className="font-bold text-base text-brand-navy mb-1.5">{m.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-white border-t border-brand-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Ready to Drive Genuine Customer Outcomes?
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto text-base leading-relaxed">
            Join hundreds of forward-thinking brands turning consumer attention into measurable research, content, leads, and store visits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/vendor-application"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white gradient-brand shadow-card hover:shadow-card-hover text-base transition-all"
            >
              Launch Your First Campaign
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-brand-navy bg-white border border-brand-border hover:bg-slate-50 text-base transition-all"
            >
              Sign Up as Participant
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Embedded Animated Erah AI Assistant */}
      <ErahAssistant role="visitor" />
    </div>
  );
}
