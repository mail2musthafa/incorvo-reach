"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Coins,
  AlertCircle,
  ArrowRight,
  Eye,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function MyMissionsPage() {
  const [missions, setMissions] = useState<any[]>([
    {
      id: "assign-1",
      campaign_title: "Plant-Based Protein Bar Flavor & Texture Feedback",
      vendor_name: "NovaHealth Organics",
      template_type: "PRIVATE_SURVEY",
      status: "APPROVED",
      reward_amount: 150.0,
      reserved_at: "2026-08-20T10:00:00Z",
      submitted_at: "2026-08-20T11:00:00Z",
      completed_at: "2026-08-21T14:00:00Z",
    },
    {
      id: "assign-2",
      campaign_title: "Clean Beauty & Cold-Pressed Oil Consumer Study",
      vendor_name: "NovaHealth Organics",
      template_type: "VIDEO_QUIZ",
      status: "SUBMITTED",
      reward_amount: 75.0,
      reserved_at: "2026-08-22T08:00:00Z",
      submitted_at: "2026-08-22T09:15:00Z",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/missions/my-missions");
        if (Array.isArray(res) && res.length > 0) {
          setMissions(res);
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const filtered = missions.filter((m) => {
    if (filterStatus === "ALL") return true;
    return m.status === filterStatus;
  });

  return (
    <DashboardLayout portalType="participant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">My Missions & Submissions</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Track verification progress, approval states, and earned ledger rewards
          </p>
        </div>

        {/* Status filters */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
          {["ALL", "APPROVED", "SUBMITTED", "IN_PROGRESS", "DISPUTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filterStatus === st
                  ? "bg-brand-violet text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-brand-muted uppercase">
                    {m.vendor_name}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : m.status === "SUBMITTED"
                        ? "bg-blue-100 text-brand-blue"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-brand-navy">{m.campaign_title}</h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Format: {m.template_type}</span>
                  {m.submitted_at && (
                    <span>Submitted: {new Date(m.submitted_at).toLocaleDateString("en-IN")}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[11px] text-brand-muted block">Reward Credited</span>
                  <span className="text-base font-black text-emerald-700">₹{m.reward_amount}</span>
                </div>

                {m.status === "IN_PROGRESS" && (
                  <Link
                    href={`/participant/execute/${m.id}`}
                    className="px-4 py-2 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs"
                  >
                    Resume Task
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
