"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Award, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function VendorBenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<any[]>([
    {
      industry: "D2C Health & Wellness",
      avg_cpva_inr: 185.0,
      avg_approval_rate_percent: 94.2,
      avg_completion_minutes: 9.5,
      avg_ugc_retention_sec: 24.5,
      top_quartile_cvr_percent: 11.4
    },
    {
      industry: "B2B SaaS & Enterprise",
      avg_cpva_inr: 420.0,
      avg_approval_rate_percent: 91.8,
      avg_completion_minutes: 18.2,
      avg_lead_to_demo_cvr_percent: 16.5,
      top_quartile_cvr_percent: 24.0
    },
    {
      industry: "Clean Beauty & Personal Care",
      avg_cpva_inr: 160.0,
      avg_approval_rate_percent: 96.1,
      avg_completion_minutes: 8.0,
      avg_ugc_retention_sec: 28.0,
      top_quartile_cvr_percent: 14.2
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/benchmarks/categories");
        if (Array.isArray(res)) setBenchmarks(res);
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
          <h1 className="text-2xl font-black text-brand-navy">Industry Category Benchmarks & Intelligence</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Compare your CPVA, completion velocity, and qualitative sentiment against anonymized category averages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benchmarks.map((b) => (
            <div key={b.industry} className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-4">
              <span className="px-2.5 py-1 rounded-full bg-brand-violet-light text-brand-violet text-[10px] font-bold uppercase">
                {b.industry}
              </span>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Average CPVA:</span>
                  <span className="text-brand-navy font-bold">₹{b.avg_cpva_inr}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Approval Rate:</span>
                  <span className="text-emerald-700 font-bold">{b.avg_approval_rate_percent}%</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Avg Completion Time:</span>
                  <span className="text-slate-700 font-bold">{b.avg_completion_minutes} mins</span>
                </div>
                <div className="flex justify-between text-xs font-semibold border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Top Quartile CVR:</span>
                  <span className="text-brand-violet font-black">{b.top_quartile_cvr_percent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
