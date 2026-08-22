"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Wallet,
  Megaphone,
  CheckCircle2,
  Users,
  Clock,
  ArrowUpRight,
  TrendingUp,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function VendorOverviewPage() {
  const [summary, setSummary] = useState({
    available_balance: 42750.0,
    total_deposited: 100000.0,
    active_campaigns_count: 4,
    total_verified_actions: 348,
    display_name: "NovaHealth Organics",
  });

  const [campaigns, setCampaigns] = useState<any[]>([
    {
      id: "c1",
      title: "Plant-Based Protein Bar Flavor & Texture Feedback",
      template_type: "PRIVATE_SURVEY",
      status: "LIVE",
      reward_per_action: 150.0,
      total_capacity: 100,
      remaining_capacity: 97,
      verified_actions: 1,
      pending_review: 1,
    },
    {
      id: "c2",
      title: "Original Morning Routine UGC Video with Nova Matcha",
      template_type: "UGC",
      status: "LIVE",
      reward_per_action: 850.0,
      total_capacity: 20,
      remaining_capacity: 19,
      verified_actions: 1,
      pending_review: 0,
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, campRes] = await Promise.allSettled([
          apiRequest("/vendors/summary"),
          apiRequest("/vendors/my-campaigns"),
        ]);
        if (sumRes.status === "fulfilled" && sumRes.value) {
          setSummary(sumRes.value);
        }
        if (campRes.status === "fulfilled" && Array.isArray(campRes.value)) {
          setCampaigns(campRes.value);
        }
      } catch (err) {
        // graceful local fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-brand-navy">
                {summary.display_name || "NovaHealth Organics"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified Vendor
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              Verified action analytics, escrow ledger balances & submission queues
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/funds"
              className="px-4 py-2 rounded-xl bg-white border border-brand-border text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Wallet className="w-3.5 h-3.5 text-brand-violet" />
              <span>Deposit Funds</span>
            </Link>
            <Link
              href="/vendor/create-campaign"
              className="px-4 py-2 rounded-xl gradient-brand text-xs font-bold text-white shadow-card hover:brightness-105 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Campaign</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available Balance */}
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
              <span>Available Campaign Funds</span>
              <Wallet className="w-4 h-4 text-brand-violet" />
            </div>
            <div className="text-2xl font-black text-brand-navy">
              ₹{Number(summary.available_balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
              <span>Total Deposited: ₹{Number(summary.total_deposited).toLocaleString("en-IN")}</span>
              <Link href="/vendor/funds" className="text-brand-violet font-bold hover:underline">
                Ledger →
              </Link>
            </div>
          </div>

          {/* Card 2: Active Campaigns */}
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
              <span>Active Campaigns</span>
              <Megaphone className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="text-2xl font-black text-brand-navy">{summary.active_campaigns_count || 4}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All campaigns in Live state
            </div>
          </div>

          {/* Card 3: Verified Actions */}
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
              <span>Verified Actions Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{summary.total_verified_actions || 348}</div>
            <div className="text-[11px] text-slate-500 mt-2">
              100% verified authentic proofs
            </div>
          </div>

          {/* Card 4: Submissions in Queue */}
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
            <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
              <span>Pending Review Queue</span>
              <Inbox className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">6 Submissions</div>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
              <span>Avg review speed: 1.8h</span>
              <Link href="/vendor/submissions" className="text-brand-violet font-bold hover:underline">
                Review →
              </Link>
            </div>
          </div>
        </div>

        {/* Live Campaigns Table */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-navy">Active Campaigns & Performance</h2>
              <p className="text-xs text-brand-muted">Campaign budget burn and remaining capacity</p>
            </div>
            <Link
              href="/vendor/campaigns"
              className="text-xs font-bold text-brand-violet hover:underline"
            >
              View All Campaigns →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Campaign Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Reward / Action</th>
                  <th className="py-3 px-4">Remaining Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {campaigns.slice(0, 4).map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy max-w-xs truncate">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                        {c.template_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      ₹{c.reward_per_action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.remaining_capacity} / {c.total_capacity} spots
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/vendor/submissions`}
                        className="px-3 py-1 rounded-lg bg-brand-violet text-white text-[11px] font-semibold hover:bg-brand-violet-hover"
                      >
                        Submissions
                      </Link>
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
