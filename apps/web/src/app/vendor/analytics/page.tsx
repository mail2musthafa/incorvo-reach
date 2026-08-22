"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, CheckCircle2, DollarSign } from "lucide-react";

export default function VendorAnalyticsPage() {
  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Action Analytics & Funnel ROI</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Real-time outcome metrics, completion velocity, and customer cohort insights
          </p>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Cost Per Verified Action (CPVA)
            </span>
            <div className="text-2xl font-black text-brand-navy">₹164.50</div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              ↓ 42% lower than traditional CPC
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Submission Approval Rate
            </span>
            <div className="text-2xl font-black text-emerald-600">96.8%</div>
            <span className="text-[11px] text-slate-500 block mt-1">High quality participant submissions</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Average Completion Time
            </span>
            <div className="text-2xl font-black text-brand-violet">8.4 mins</div>
            <span className="text-[11px] text-slate-500 block mt-1">High depth attention span</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Qualified Leads Generated
            </span>
            <div className="text-2xl font-black text-brand-navy">112 Leads</div>
            <span className="text-[11px] text-slate-500 block mt-1">100% consent validated</span>
          </div>
        </div>

        {/* Funnel Preview */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-6">
          <h2 className="text-base font-bold text-brand-navy">Verified Action Conversion Funnel</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-brand-navy mb-1">
                <span>1. Mission Discover Impressions</span>
                <span>1,240</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-navy rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-brand-navy mb-1">
                <span>2. Mission Accepted & Spots Reserved</span>
                <span>410 (33.0%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-violet rounded-full w-[33%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-brand-navy mb-1">
                <span>3. Proof & Answers Submitted</span>
                <span>362 (88.2% of accepted)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full w-[29%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-brand-navy mb-1">
                <span>4. Verified & Settled in Ledger</span>
                <span>348 (96.1% approval)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[28%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
