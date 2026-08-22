"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link2, TrendingUp, DollarSign, ExternalLink, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function PartnerAttributionPage() {
  const [partners, setPartners] = useState<any[]>([
    {
      id: "part-01",
      partner_name: "Kavita Patel Media",
      partner_type: "AFFILIATE_CREATOR",
      commission_structure: "12% Percent of Verified Sale (CPS)",
      cookie_window_days: 30,
      total_clicks: 3450,
      conversions: 182,
      total_earned_inr: 45500.0,
      status: "ACTIVE_VERIFIED"
    }
  ]);

  const [links, setLinks] = useState<any[]>([
    {
      id: "link-101",
      slug: "kavita-matcha-special",
      destination_url: "https://novahealth.in/products/ceremonial-matcha",
      tracking_url: "https://reach.incorvo.in/r/kavita-matcha-special",
      clicks: 1280,
      conversions: 94,
      conversion_rate_percent: 7.34
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [ptRes, lnRes] = await Promise.allSettled([
          apiRequest("/partner-attribution/partners"),
          apiRequest("/partner-attribution/links")
        ]);
        if (ptRes.status === "fulfilled" && Array.isArray(ptRes.value)) setPartners(ptRes.value);
        if (lnRes.status === "fulfilled" && Array.isArray(lnRes.value)) setLinks(lnRes.value);
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
          <h1 className="text-2xl font-black text-brand-navy">Partner Contracts & Conversion Attribution</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage affiliate contracts, recurring commission structures, deep link tracking, and conversion attribution
          </p>
        </div>

        {/* Partners and Tracking Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-violet" />
              Active Affiliate Partner Contracts
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              {partners.map((p) => (
                <div key={p.id} className="py-3.5 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-navy text-sm">{p.partner_name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px] block">{p.commission_structure} • {p.cookie_window_days}-day cookie</span>
                  <div className="flex justify-between pt-1 font-semibold text-slate-700">
                    <span>{p.total_clicks} Clicks • {p.conversions} Conversions</span>
                    <span className="text-emerald-700 font-black">₹{p.total_earned_inr.toLocaleString()} Earned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Link2 className="w-4 h-4 text-brand-blue" />
              Campaign Deep Links & Attribution Stats
            </h2>

            <div className="space-y-3 text-xs">
              {links.map((l) => (
                <div key={l.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-brand-navy text-xs">{l.slug}</span>
                    <span className="text-[11px] font-black text-emerald-700">{l.conversion_rate_percent}% CVR</span>
                  </div>
                  <span className="font-mono text-[11px] text-brand-violet truncate block">{l.tracking_url}</span>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>{l.clicks} Clicks</span>
                    <span>{l.conversions} Attributed Conversions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
