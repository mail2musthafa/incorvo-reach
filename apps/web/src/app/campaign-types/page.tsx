"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Video,
  FileSearch,
  CheckSquare,
  Gift,
  Camera,
  Users,
  CalendarCheck,
  MapPin,
  Ticket,
  Share2,
  ShoppingBag,
  Bug,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function CampaignTypesPage() {
  const templates = [
    {
      id: "video-quiz",
      title: "A. Hosted Video & Educational Quiz",
      icon: Video,
      desc: "Educate participants with in-app video streams and verify attention with timed randomized quizzes.",
      verification: "Signed watch session events + passing score.",
      deliverable: "100% verified video watch + quiz score certificate",
      badge: "Automated",
    },
    {
      id: "private-survey",
      title: "B. Private Qualitative Research Survey",
      icon: FileSearch,
      desc: "Gather deep consumer sentiment across single/multi choice, matrix ratings, and detailed text observations.",
      verification: "Per-question validation + text anomaly analysis.",
      deliverable: "Aggregated qualitative reports + raw CSV export",
      badge: "Deep Insights",
    },
    {
      id: "product-test",
      title: "C. Product & Website Usability Testing",
      icon: CheckSquare,
      desc: "Have targeted participants navigate your web application, checkout funnel or physical packaging and submit detailed observations.",
      verification: "Screen captures + structured difficulty evaluation.",
      deliverable: "UX friction points + annotated screenshots",
      badge: "UX Testing",
    },
    {
      id: "sampling",
      title: "D. Direct Product Sampling & Trial",
      icon: Gift,
      desc: "Ship sample trial units to qualified demographic cohorts and collect rigorous uncoerced post-consumption feedback.",
      verification: "Courier tracking dispatch confirmation + private post-trial feedback.",
      deliverable: "Authentic consumer trial metrics",
      badge: "Physical Trial",
    },
    {
      id: "ugc",
      title: "E. Original User-Generated Content (UGC)",
      icon: Camera,
      desc: "Commission authentic 9:16 vertical videos, unboxings, tutorials, and lifestyle photos with full commercial usage rights.",
      verification: "Perceptual quality check + creative brief compliance.",
      deliverable: "1080x1920 HD Master files + Signed commercial license",
      badge: "Commercial Rights",
    },
    {
      id: "lead",
      title: "F. Qualified Lead Inquiries",
      icon: Users,
      desc: "Receive genuine, consent-based consultation requests from targeted buyers who explicitly opt in for brand contact.",
      verification: "OTP validation + purchase timeline & budget qualification.",
      deliverable: "Verified lead records with explicit contact consent",
      badge: "High Intent",
    },
    {
      id: "booking",
      title: "G. Demo & Appointment Bookings",
      icon: CalendarCheck,
      desc: "Reward prospects for scheduling and attending a high-touch sales presentation, test drive, or clinical consultation.",
      verification: "Calendar webhook + vendor attendance confirmation.",
      deliverable: "Attended demo records",
      badge: "B2B / High-Ticket",
    },
    {
      id: "store-visit",
      title: "H. Store Visit & Rotating QR Check-in",
      icon: MapPin,
      desc: "Drive physical footfall to retail stores, salons, gyms, or restaurants with dynamic fraud-proof kiosk QR check-ins.",
      verification: "Dynamic rotating QR token + optional store proof.",
      deliverable: "Verified physical customer store visits",
      badge: "Footfall",
    },
    {
      id: "coupon",
      title: "I. Tracked Coupon Redemptions",
      icon: Ticket,
      desc: "Issue cryptographically unique promotional coupons and track online or in-store cashier redemptions in real time.",
      verification: "Point-of-sale API redemption event webhook.",
      deliverable: "Redeemed order basket value analytics",
      badge: "Direct Sales",
    },
    {
      id: "referral",
      title: "J. Fraud-Resistant Referral Campaigns",
      icon: Share2,
      desc: "Empower genuine brand advocates to refer peers with anti-collusion and device fingerprinting protections.",
      verification: "Referred user completion event + self-referral filter.",
      deliverable: "Verified organic customer acquisitions",
      badge: "Advocacy",
    },
    {
      id: "purchase",
      title: "K. Verified Purchase & Receipt Milestone",
      icon: ShoppingBag,
      desc: "Reward repeat buyers for authenticated orders across e-commerce storefronts or authorized offline dealers.",
      verification: "OCR receipt scanning + unique order ID ledger lookup.",
      deliverable: "Attributed customer GMV",
      badge: "E-Commerce",
    },
    {
      id: "beta-test",
      title: "L. Beta Testing & Technical Bug Hunting",
      icon: Bug,
      desc: "Deploy pre-release software builds to power users to uncover edge-case bugs, crashes, and device compatibility defects.",
      verification: "Crash log parsing + reproduction step verification.",
      deliverable: "Structured bug reports with device telemetry",
      badge: "Quality Assurance",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <section className="pt-16 pb-20 bg-white border-b border-brand-border text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-violet-light text-brand-violet text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Campaign Requirement Catalogue</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy">
            12 Standardized Campaign Templates
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every template is engineered with explicit verification criteria, anti-fraud algorithms, and transparent participant workflows.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-violet-light text-brand-violet flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {tpl.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-brand-navy mb-2">{tpl.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{tpl.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px]">
                  <div>
                    <span className="text-brand-muted block">Verification:</span>
                    <span className="font-semibold text-slate-800">{tpl.verification}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted block">Deliverable:</span>
                    <span className="font-semibold text-brand-violet">{tpl.deliverable}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/vendor-application"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white gradient-brand shadow-card hover:shadow-card-hover"
          >
            <span>Launch a Campaign with These Templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
