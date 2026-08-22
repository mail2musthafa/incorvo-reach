"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, Lock, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function VendorFundsPage() {
  const [depositAmount, setDepositAmount] = useState(25000);
  const [depositing, setDepositing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [ledgerPostings, setLedgerPostings] = useState([
    {
      id: "j-001",
      entry_type: "VENDOR_DEPOSIT",
      desc: "Deposit of ₹100,000.00 via NetBanking ref DEP_ICICI_20260822_001",
      amount: 100000.0,
      direction: "DEBIT",
      date: "2026-08-22 10:00 AM",
      status: "COMPLETED",
    },
    {
      id: "j-002",
      entry_type: "CAMPAIGN_BUDGET_HOLD",
      desc: "Escrow budget hold for Plant-Based Protein Bar Study",
      amount: 17250.0,
      direction: "CREDIT",
      date: "2026-08-22 10:15 AM",
      status: "ESCROW_LOCKED",
    },
    {
      id: "j-003",
      entry_type: "CAMPAIGN_BUDGET_HOLD",
      desc: "Escrow budget hold for Morning Routine UGC Video with Nova Matcha",
      amount: 19550.0,
      direction: "CREDIT",
      date: "2026-08-22 10:15 AM",
      status: "ESCROW_LOCKED",
    },
    {
      id: "j-004",
      entry_type: "MISSION_SETTLEMENT",
      desc: "Settlement for submission Ananya Iyer: reward ₹150.00, platform fee ₹22.50",
      amount: 172.5,
      direction: "SETTLED",
      date: "2026-08-22 11:30 AM",
      status: "SETTLED",
    },
  ]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositing(true);
    setSuccessMsg("");

    try {
      const res = await apiRequest("/vendors/funds/deposit", {
        method: "POST",
        body: JSON.stringify({ amount: Number(depositAmount), payment_method: "NETBANKING" }),
      });

      setSuccessMsg(`Successfully deposited ₹${Number(depositAmount).toLocaleString("en-IN")} into ledger balance.`);
      setLedgerPostings((prev) => [
        {
          id: res.journal_id || `j-${Date.now()}`,
          entry_type: "VENDOR_DEPOSIT",
          desc: `Deposit of ₹${Number(depositAmount).toLocaleString("en-IN")}`,
          amount: Number(depositAmount),
          direction: "DEBIT",
          date: "Just now",
          status: "COMPLETED",
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert(err.message || "Deposit failed");
    } finally {
      setDepositing(false);
    }
  };

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Campaign Funds & Immutable Ledger</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Double-entry accounting source of truth for vendor deposits, escrow holds, and verified payouts
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Available to Allocate
            </span>
            <div className="text-3xl font-black text-brand-navy">₹42,750.00</div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-2">
              ✓ Ready for new campaign escrow holds
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              In-Flight Escrow Locked
            </span>
            <div className="text-3xl font-black text-brand-violet">₹57,250.00</div>
            <span className="text-[11px] text-slate-500 font-medium block mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Locked for 4 live campaigns
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Total Deposits All-Time
            </span>
            <div className="text-3xl font-black text-brand-navy">₹100,000.00</div>
            <span className="text-[11px] text-slate-500 font-medium block mt-2">
              Verified via licensed banking rail
            </span>
          </div>
        </div>

        {/* Deposit Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs">
          <h2 className="text-base font-bold text-brand-navy mb-1">Add Campaign Funds (Sandbox Deposit)</h2>
          <p className="text-xs text-brand-muted mb-4">
            Deposit funds to expand your verified campaign capacity.
          </p>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleDeposit} className="flex flex-col sm:flex-row items-center gap-4 max-w-xl">
            <div className="flex-1 w-full">
              <input
                type="number"
                step="5000"
                min="5000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-bold text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={depositing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{depositing ? "Recording..." : "Simulate Deposit"}</span>
            </button>
          </form>
        </div>

        {/* Ledger Journals Table */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-brand-navy">Ledger Journal Postings</h3>
            <span className="text-[11px] text-slate-500 font-mono">Ledger ID: ORG-NOVA-8821</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Journal Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {ledgerPostings.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px]">
                        {entry.entry_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-sm truncate">{entry.desc}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-navy">
                      ₹{entry.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{entry.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {entry.status}
                      </span>
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
