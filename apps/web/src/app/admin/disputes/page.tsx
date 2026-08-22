"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertOctagon, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([
    {
      id: "disp-101",
      participant: "Sneha Menon",
      vendor: "NovaHealth Organics",
      reason: "Video format clarification",
      explanation: "I re-exported the 9:16 vertical crop at full 1080x1920 60fps and uploaded the updated master link.",
      status: "UNDER_INVESTIGATION",
      date: "2026-08-21",
    },
  ]);

  const handleResolve = (id: string, decision: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: decision } : d))
    );
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Disputes & Fraud Incident Queue</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Resolve proof disagreements impartially and enforce platform anti-fraud standards
          </p>
        </div>

        <div className="space-y-4">
          {disputes.map((d) => (
            <div
              key={d.id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-brand-muted uppercase">
                    Dispute #{d.id} • {d.date}
                  </span>
                  <h3 className="font-bold text-base text-brand-navy mt-0.5">{d.reason}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {d.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span><strong>Participant:</strong> {d.participant}</span>
                  <span><strong>Target Vendor:</strong> {d.vendor}</span>
                </div>
                <p><strong>Explanation:</strong> {d.explanation}</p>
              </div>

              {d.status === "UNDER_INVESTIGATION" && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleResolve(d.id, "RESOLVED_VENDOR_FAVOUR")}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Uphold Vendor Rejection
                  </button>
                  <button
                    onClick={() => handleResolve(d.id, "RESOLVED_PARTICIPANT_FAVOUR")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                  >
                    Resolve in Participant Favour (Release Reward)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
