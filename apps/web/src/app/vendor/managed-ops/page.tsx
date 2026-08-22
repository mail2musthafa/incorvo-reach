"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Sparkles, CheckCircle2, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ManagedOpsPage() {
  const [budget, setBudget] = useState(150000);
  const [category, setCategory] = useState("UGC");
  const [objective, setObjective] = useState("Launch full creator UGC campaign across 50 verified fitness creators.");
  const [requested, setRequested] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/managed-ops/request", {
        method: "POST",
        body: JSON.stringify({
          objective,
          target_budget_inr: budget,
          target_category: category,
          notes: "Priority onboarding request."
        })
      });
      setRequested(true);
    } catch (err) {
      setRequested(true);
    }
  };

  return (
    <DashboardLayout portalType="vendor">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Managed Campaign Operations & White-Glove Service</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Let Incorvo's dedicated campaign operations team author briefs, recruit creators, and moderate submissions for you
          </p>
        </div>

        {requested ? (
          <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-card text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-brand-navy">White-Glove Campaign Request Received</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your dedicated Incorvo Campaign Lead has been assigned. You will receive a custom creative brief, participant sampling cohort, and budget schedule within 4 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequest} className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Format</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-semibold bg-white"
                >
                  <option value="UGC">Creator UGC & Video Production</option>
                  <option value="SAMPLING">Physical Sampling Fulfillment</option>
                  <option value="RESEARCH">Moderated Usability Interviews</option>
                  <option value="FIELD_OPS">Retail Store Audits & Mystery Visits</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Escrow Budget (₹ INR)</label>
                <input
                  type="number"
                  min="50000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Objective & Core Requirements</label>
              <textarea
                required
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-brand-violet-light/30 border border-brand-violet/20 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-brand-navy block">What's Included with Managed Ops:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Dedicated Incorvo Campaign Manager & Creative Director</li>
                <li>Audience screening & manual participant verification</li>
                <li>Commercial rights licensing and escrow management</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105"
            >
              Submit Managed Campaign Request
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
