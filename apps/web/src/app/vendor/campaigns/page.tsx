"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlusCircle, Search, Filter, Megaphone, Eye, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function VendorCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([
    {
      id: "c1",
      title: "Plant-Based Protein Bar Flavor & Texture Feedback",
      template_type: "PRIVATE_SURVEY",
      status: "LIVE",
      reward_per_action: 150.0,
      total_capacity: 100,
      remaining_capacity: 97,
      total_budget: 17250.0,
      budget_spent: 450.0,
      verified_actions: 1,
      pending_review: 1,
      created_at: "2026-08-22T10:00:00Z",
    },
    {
      id: "c2",
      title: "Original Morning Routine UGC Video with Nova Matcha",
      template_type: "UGC",
      status: "LIVE",
      reward_per_action: 850.0,
      total_capacity: 20,
      remaining_capacity: 19,
      total_budget: 19550.0,
      budget_spent: 977.5,
      verified_actions: 1,
      pending_review: 0,
      created_at: "2026-08-21T14:30:00Z",
    },
    {
      id: "c3",
      title: "Clean Beauty & Cold-Pressed Oil Consumer Study",
      template_type: "VIDEO_QUIZ",
      status: "LIVE",
      reward_per_action: 75.0,
      total_capacity: 200,
      remaining_capacity: 198,
      total_budget: 17250.0,
      budget_spent: 172.5,
      verified_actions: 1,
      pending_review: 0,
      created_at: "2026-08-20T09:15:00Z",
    },
    {
      id: "c4",
      title: "Flagship Experience Store QR Check-in & Visit",
      template_type: "STORE_VISIT",
      status: "LIVE",
      reward_per_action: 200.0,
      total_capacity: 50,
      remaining_capacity: 49,
      total_budget: 11500.0,
      budget_spent: 230.0,
      verified_actions: 1,
      pending_review: 0,
      created_at: "2026-08-19T11:00:00Z",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/vendors/my-campaigns");
        if (Array.isArray(res) && res.length > 0) {
          setCampaigns(res);
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || c.template_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">Campaign Management</h1>
            <p className="text-xs text-brand-muted mt-0.5">
              Monitor active missions, participant velocity, and budget utilization
            </p>
          </div>

          <Link
            href="/vendor/create-campaign"
            className="px-4 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-card flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Campaign</span>
          </Link>
        </div>

        {/* Filters bar */}
        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs"
            >
              <option value="ALL">All Formats</option>
              <option value="PRIVATE_SURVEY">Private Survey</option>
              <option value="UGC">Original UGC Video</option>
              <option value="VIDEO_QUIZ">Hosted Video & Quiz</option>
              <option value="STORE_VISIT">Store Check-in</option>
            </select>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {c.template_type}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-brand-navy mb-2 leading-snug">{c.title}</h3>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-brand-muted block text-[11px]">Reward / Action:</span>
                    <span className="font-bold text-emerald-700 text-sm">₹{c.reward_per_action}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[11px]">Capacity:</span>
                    <span className="font-bold text-brand-navy">
                      {c.remaining_capacity} / {c.total_capacity} spots
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[11px]">Escrow Budget:</span>
                    <span className="font-semibold text-slate-800">₹{Number(c.total_budget || 17250).toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[11px]">Verified:</span>
                    <span className="font-semibold text-emerald-700">{c.verified_actions || 1} completions</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Created {new Date(c.created_at || Date.now()).toLocaleDateString("en-IN")}
                </span>
                <Link
                  href="/vendor/submissions"
                  className="px-3.5 py-1.5 rounded-lg bg-brand-violet text-white text-xs font-semibold hover:bg-brand-violet-hover"
                >
                  Review Submissions
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
