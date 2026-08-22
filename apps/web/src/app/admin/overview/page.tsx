"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ShieldCheck,
  Building2,
  Users2,
  Wallet,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Lock,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({
    registered_participants: 5,
    verified_vendors: 2,
    live_campaigns: 4,
    verified_actions_completed: 348,
    platform_commission_earned_inr: 8625.0,
    pending_payouts_count: 1,
    active_disputes_count: 1,
    trust_and_safety_score: 99.8,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/admin/metrics");
        if (res) {
          setMetrics(res);
        }
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
          <h1 className="text-2xl font-black text-brand-navy">Platform Governance & Admin Dashboard</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Quenix Analytics compliance monitoring, vendor verification queue, and immutable ledger oversight
          </p>
        </div>

        {/* Top metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Registered Participants
            </span>
            <div className="text-2xl font-black text-brand-navy">{metrics.registered_participants || 5}</div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              100% phone/OTP verified
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Verified Vendors
            </span>
            <div className="text-2xl font-black text-brand-violet">{metrics.verified_vendors || 2}</div>
            <span className="text-[11px] text-slate-500 block mt-1">1 pending compliance review</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Platform Revenue (15% Commission)
            </span>
            <div className="text-2xl font-black text-emerald-600">
              ₹{Number(metrics.platform_commission_earned_inr || 8625).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Double-entry ledger settled</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Trust & Safety Score
            </span>
            <div className="text-2xl font-black text-brand-navy">{metrics.trust_and_safety_score || 99.8}%</div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              Zero paid reviews detected
            </span>
          </div>
        </div>

        {/* Quick moderation queues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-navy">Vendor Verifications</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                1 Pending
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Zenith Cloud Technologies LLP submitted GST and business incorporation documents.
            </p>
            <Link
              href="/admin/vendors"
              className="inline-block text-xs font-bold text-brand-violet hover:underline pt-2"
            >
              Open Vendor Queue →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-navy">Payout Moderation</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue">
                1 Queued
              </span>
            </div>
            <p className="text-xs text-slate-600">
              ₹500.00 withdrawal request for verified participant Kavita Patel via UPI.
            </p>
            <Link
              href="/admin/payouts"
              className="inline-block text-xs font-bold text-brand-violet hover:underline pt-2"
            >
              Open Payout Queue →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-navy">Dispute & Fraud Center</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                1 Active
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Video orientation dispute raised on Nova Matcha UGC campaign.
            </p>
            <Link
              href="/admin/disputes"
              className="inline-block text-xs font-bold text-brand-violet hover:underline pt-2"
            >
              Investigate Dispute →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
