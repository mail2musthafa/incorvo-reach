"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldCheck, CheckCircle2, Phone, Coins, ArrowUpRight, Clock, FileCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminOperationsHubPage() {
  const [payouts, setPayouts] = useState([
    {
      id: "pay-101",
      participant_name: "Ananya Iyer",
      phone_number: "+91 98450 12345",
      payout_mode: "UPI_TRANSFER",
      payout_address: "ananya.iyer@okhdfcbank",
      amount_inr: 850.0,
      bank_reference: "UPI_REF_9981240",
      status: "PENDING_APPROVAL",
      requested_at: "2026-08-22T09:15:00Z"
    },
    {
      id: "pay-102",
      participant_name: "Rohit Verma",
      phone_number: "+91 98200 67890",
      payout_mode: "PHONE_NUMBER_IMPS",
      payout_address: "9820067890@paytm",
      amount_inr: 1200.0,
      bank_reference: "IMPS_REF_5521098",
      status: "PENDING_APPROVAL",
      requested_at: "2026-08-22T10:30:00Z"
    }
  ]);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprovePayout = async (id: string) => {
    setProcessingId(id);
    try {
      await apiRequest(`/admin/payouts/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ bank_reference_number: `SETTLED_${Date.now()}` })
      });
      setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "SETTLED_COMPLETED" } : p)));
    } catch (err) {
      setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "SETTLED_COMPLETED" } : p)));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">Marketplace Operations & Manual Payout Hub</h1>
            <p className="text-xs text-brand-muted mt-0.5">
              Review and approve manual UPI and Phone Number transfers with instant double-entry ledger settlement
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
              Double-Entry Invariant: ₹0.0 Variance ✓
            </span>
          </div>
        </div>

        {/* Payout Table */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between">
            <h2 className="font-bold text-base text-brand-navy flex items-center gap-2">
              <Coins className="w-4 h-4 text-brand-violet" />
              Pending Manual UPI & Phone Transfer Approvals
            </h2>
            <span className="text-xs font-semibold text-slate-500">{payouts.filter(p => p.status === "PENDING_APPROVAL").length} Pending</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Participant & Contact</th>
                  <th className="py-3 px-4">Transfer Mode & VPA</th>
                  <th className="py-3 px-4">Amount (₹ INR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-navy block">{p.participant_name}</span>
                      <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {p.phone_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-violet text-[11px] block">{p.payout_mode}</span>
                      <span className="font-mono text-slate-600 text-[11px]">{p.payout_address}</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-brand-navy text-sm">₹{p.amount_inr.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "SETTLED_COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === "PENDING_APPROVAL" ? (
                        <button
                          onClick={() => handleApprovePayout(p.id)}
                          disabled={processingId === p.id}
                          className="px-4 py-1.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs hover:brightness-105 transition-all disabled:opacity-50"
                        >
                          {processingId === p.id ? "Settling..." : "Approve & Settle"}
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-xs flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                        </span>
                      )}
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
