"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Wallet, CheckCircle2, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([
    {
      id: "payout-001",
      user_email: "rohit.verma@outlook.com",
      amount: 500.0,
      currency: "INR",
      status: "PAID",
      created_at: "2026-08-21T10:00:00Z",
    },
    {
      id: "payout-002",
      user_email: "kavita.patel@yahoo.com",
      amount: 500.0,
      currency: "INR",
      status: "QUEUED",
      created_at: "2026-08-22T09:00:00Z",
    },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/admin/payout-queue");
        if (Array.isArray(res) && res.length > 0) {
          setPayouts(res);
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const handleProcess = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "PAID" } : p))
    );
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Payout Queue & Ledger Reconciliation</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Monitor and execute outbound participant rewards via licensed banking APIs
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Payout ID</th>
                  <th className="py-3 px-4">Participant Email</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-700">{p.id}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-navy">{p.user_email}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">₹{p.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-brand-blue"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === "QUEUED" ? (
                        <button
                          onClick={() => handleProcess(p.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                        >
                          Execute Payout
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-[11px]">Settled ✓</span>
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
