"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldCheck, Award, Sparkles, Camera, CheckCircle2, TrendingUp, Lock } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ParticipantReputationPage() {
  const [rep, setRep] = useState<any>({
    reliability_score: 98.4,
    tier: "GOLD",
    total_completed_missions: 14,
    total_approved_missions: 14,
    approval_rate_percent: 100.0,
    high_value_eligible: true,
    category_expertise: { "Health & Wellness": 8, "B2B SaaS": 4, "E-commerce": 2 },
    badges: [
      { id: "b1", name: "Verified Creator", desc: "Phone & Identity Authenticated" },
      { id: "b2", name: "High Depth Researcher", desc: "Top 5% qualitative thoroughness" },
      { id: "b3", name: "UGC Master", desc: "High definition vertical video producer" }
    ]
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/reputation/me");
        if (res && res.reliability_score) setRep(res);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout portalType="participant">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Creator Reputation & Quality Badges</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Your verification track record, completion reliability score, and unlocked enterprise mission tiers
          </p>
        </div>

        {/* Tier Score Banner */}
        <div className="bg-gradient-to-r from-brand-violet to-brand-blue rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-black text-[11px] uppercase tracking-wider">
              {rep.tier} TIER CREATOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">Reliability Score: {rep.reliability_score}%</h2>
            <p className="text-xs text-white/80 max-w-md">
              Based on genuine qualitative thoroughness, unscripted video clarity, and zero policy infractions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shrink-0">
            <span className="text-[11px] text-white/70 block">High-Value Missions</span>
            <span className="text-xl font-black text-emerald-300">✓ UNLOCKED</span>
            <span className="text-[10px] text-white/70 block mt-0.5">Up to ₹5,000 / mission</span>
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-brand-navy">Earned Skill & Verification Badges</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rep.badges.map((b: any) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-brand-violet-light text-brand-violet flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-brand-navy">{b.name}</h4>
                <p className="text-xs text-slate-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Expertise */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
          <h3 className="text-base font-bold text-brand-navy">Category Expertise Breakdown</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {Object.entries(rep.category_expertise).map(([cat, count]: [string, any]) => (
              <div key={cat} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-brand-navy">{cat}</span>
                <span className="px-2 py-0.5 rounded bg-brand-violet/10 text-brand-violet font-bold text-[11px]">
                  {count} Verified Missions
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
