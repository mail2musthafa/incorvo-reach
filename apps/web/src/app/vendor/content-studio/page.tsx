"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Camera, FileCheck, Users, ShieldCheck, Download, Star } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ContentStudioPage() {
  const [creators, setCreators] = useState<any[]>([
    {
      id: "cr-01",
      handle: "@ananya_health",
      name: "Ananya Iyer",
      niches: ["Wellness", "Nutrition", "Morning Routines"],
      standard_rate_ugc_inr: 1500.0,
      completed_ugc_campaigns: 8,
      quality_rating: 4.95,
      camera_gear: "iPhone 15 Pro 4K60 + DJI Mic 2"
    },
    {
      id: "cr-02",
      handle: "@rohit_techreviews",
      name: "Rohit Verma",
      niches: ["B2B SaaS", "Tech Gadgets", "Workflow Productivity"],
      standard_rate_ugc_inr: 2000.0,
      completed_ugc_campaigns: 12,
      quality_rating: 4.90,
      camera_gear: "Sony A7 IV + Shure SM7B"
    }
  ]);

  const [contracts, setContracts] = useState<any[]>([
    {
      id: "rc-001",
      creator_name: "Ananya Iyer",
      campaign_title: "Original Morning Routine UGC Video with Nova Matcha",
      license_type: "COMMERCIAL_DIGITAL_FULL (PAID ADS ALLOWED)",
      duration: "12 Months (Exp: August 2027)",
      geographic_scope: "Worldwide Digital Channels",
      status: "ACTIVE_LICENSED"
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [crRes, ctRes] = await Promise.allSettled([
          apiRequest("/content-studio/creators"),
          apiRequest("/content-studio/contracts")
        ]);
        if (crRes.status === "fulfilled" && Array.isArray(crRes.value)) setCreators(crRes.value);
        if (ctRes.status === "fulfilled" && Array.isArray(ctRes.value)) setContracts(ctRes.value);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Content Studio & Creator CRM</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Discover verified UGC creators, review rate cards, manage revisions, and track commercial rights contracts
          </p>
        </div>

        {/* Creator Roster */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-violet" />
            Verified UGC Creators Network
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creators.map((c) => (
              <div key={c.id} className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-brand-violet font-bold text-xs">{c.handle}</span>
                    <h3 className="font-bold text-base text-brand-navy">{c.name}</h3>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {c.quality_rating}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {c.niches.map((n: string) => (
                    <span key={n} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {n}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <div><strong>Gear:</strong> {c.camera_gear}</div>
                  <div><strong>Standard Rate:</strong> ₹{c.standard_rate_ugc_inr} / video deliverable</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Rights Contracts */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Commercial Content Rights & Licensing Registry
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {contracts.map((ct) => (
              <div key={ct.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-navy block">{ct.campaign_title}</span>
                  <span className="text-slate-500 text-[11px]">Creator: {ct.creator_name} • Scope: {ct.geographic_scope}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {ct.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">{ct.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
