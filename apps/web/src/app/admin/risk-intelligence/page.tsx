"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Eye, ShieldCheck } from "lucide-react";

export default function AdminRiskIntelligencePage() {
  const [alerts, setAlerts] = useState([
    {
      id: "risk-01",
      user_email: "tester.fast@example.com",
      campaign: "Plant-Based Protein Bar Survey",
      rule_triggered: "COMPLETION_SPEED_ANOMALY",
      risk_score: 0.82,
      details: "Completed 12-question qualitative survey in 42 seconds (Expected: 480s).",
      status: "UNDER_INVESTIGATION",
      flagged_at: "2026-08-22 09:15 AM"
    },
    {
      id: "risk-02",
      user_email: "photo.reuse@example.com",
      campaign: "Flagship Experience Store QR Check-in",
      rule_triggered: "PERCEPTUAL_HASH_DUPLICATE",
      risk_score: 0.94,
      details: "Image perceptual hash matches submission #sub-8812 with 99.2% Hamming similarity.",
      status: "FLAGGED_FOR_MANUAL_REVIEW",
      flagged_at: "2026-08-22 10:30 AM"
    }
  ]);

  const handleAction = (id: string, action: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Trust, Safety & Fraud Intelligence Center</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Multi-signal heuristics: Device velocity, duplicate image hashing, rapid completion flags & investigator workbench
          </p>
        </div>

        {/* Risk Alerts List */}
        <div className="space-y-4">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-brand-muted uppercase block">
                      {a.rule_triggered} • Risk Score: {(a.risk_score * 100).toFixed(0)}%
                    </span>
                    <h3 className="font-bold text-base text-brand-navy">{a.user_email}</h3>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {a.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <div><strong>Target Campaign:</strong> {a.campaign}</div>
                <div><strong>Investigation Signal:</strong> {a.details}</div>
                <div className="text-slate-400 text-[10px]">Detected: {a.flagged_at}</div>
              </div>

              {a.status !== "RESOLVED_DISMISSED" && a.status !== "ACTION_CONFIRMED" && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleAction(a.id, "RESOLVED_DISMISSED")}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Dismiss (False Positive)
                  </button>
                  <button
                    onClick={() => handleAction(a.id, "ACTION_CONFIRMED")}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-xs"
                  >
                    Hold Submission & Request Review
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
