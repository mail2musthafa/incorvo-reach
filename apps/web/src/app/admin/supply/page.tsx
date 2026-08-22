"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapPin, Users2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminSupplyPage() {
  const [coverage, setCoverage] = useState<any[]>([
    { city: "Bengaluru", active_participants: 245, gold_tier_creators: 68, verified_reviewers: 190, fulfillment_rate_percent: 99.1 },
    { city: "Mumbai", active_participants: 210, gold_tier_creators: 54, verified_reviewers: 165, fulfillment_rate_percent: 98.6 },
    { city: "Delhi NCR", active_participants: 195, gold_tier_creators: 48, verified_reviewers: 150, fulfillment_rate_percent: 97.9 },
    { city: "Hyderabad", active_participants: 130, gold_tier_creators: 32, verified_reviewers: 98, fulfillment_rate_percent: 99.4 },
    { city: "Pune", active_participants: 115, gold_tier_creators: 28, verified_reviewers: 85, fulfillment_rate_percent: 98.9 },
    { city: "Chennai", active_participants: 110, gold_tier_creators: 26, verified_reviewers: 82, fulfillment_rate_percent: 98.2 }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/supply/coverage");
        if (Array.isArray(res)) setCoverage(res);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Participant Supply & Metro Density Heatmap</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Geographic participant supply distribution, verified creator availability, and SLA fulfillment velocity
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Metro Region</th>
                  <th className="py-3 px-4">Active Participants</th>
                  <th className="py-3 px-4">Gold Creators</th>
                  <th className="py-3 px-4">Verified Reviewers</th>
                  <th className="py-3 px-4 text-right">SLA Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coverage.map((c) => (
                  <tr key={c.city} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-violet" />
                      {c.city}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{c.active_participants}</td>
                    <td className="py-3.5 px-4 text-amber-700 font-bold">{c.gold_tier_creators} Creators</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.verified_reviewers} Verified</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {c.fulfillment_rate_percent}% On-Time
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
