"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Wallet, ArrowDownRight, CheckCircle2, ArrowUpRight, Lock, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ParticipantWalletPage() {
  const [wallet, setWallet] = useState({
    current_balance: 1000.0,
    all_time_earnings: 1000.0,
    total_withdrawn: 0.0,
    currency: "INR",
  });

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(500);
  const [upiId, setUpiId] = useState("ananya.iyer@okhdfcbank");
  const [requesting, setRequesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [transactions, setTransactions] = useState([
    {
      id: "tx-1",
      entry_type: "MISSION_SETTLEMENT",
      description: "Mission Reward: Plant-Based Protein Bar Flavor & Texture Feedback",
      amount: 150.0,
      direction: "DEBIT",
      posted_at: "2026-08-21 02:00 PM",
    },
    {
      id: "tx-2",
      entry_type: "MISSION_SETTLEMENT",
      description: "Mission Reward: Original Morning Routine UGC Video with Nova Matcha",
      amount: 850.0,
      direction: "DEBIT",
      posted_at: "2026-08-20 04:30 PM",
    },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [sumRes, txRes] = await Promise.allSettled([
          apiRequest("/wallet/summary"),
          apiRequest("/wallet/transactions"),
        ]);
        if (sumRes.status === "fulfilled" && sumRes.value) {
          setWallet(sumRes.value);
        }
        if (txRes.status === "fulfilled" && Array.isArray(txRes.value) && txRes.value.length > 0) {
          setTransactions(txRes.value);
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await apiRequest("/wallet/payout", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(payoutAmount),
          account_type: "UPI",
          account_holder_name: "Ananya Iyer",
          account_identifier: upiId,
        }),
      });

      setSuccessMsg(res.message || `Payout request of ₹${payoutAmount} queued successfully!`);
      setWallet((prev) => ({
        ...prev,
        current_balance: Math.max(0, prev.current_balance - Number(payoutAmount)),
        total_withdrawn: prev.total_withdrawn + Number(payoutAmount),
      }));
      setPayoutModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit payout request.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <DashboardLayout portalType="participant">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Earnings & Payout Wallet</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Withdrawable verified mission balances & immutable transaction records
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Withdrawable Balance
            </span>
            <div className="text-3xl font-black text-emerald-600">
              ₹{Number(wallet.current_balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <button
              onClick={() => setPayoutModalOpen(true)}
              className="mt-4 w-full py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs hover:brightness-105 transition-all"
            >
              Request UPI / Bank Payout
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              All-Time Earnings
            </span>
            <div className="text-3xl font-black text-brand-navy">
              ₹{Number(wallet.all_time_earnings).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 block mt-2">
              From verified research & UGC submissions
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Total Withdrawn
            </span>
            <div className="text-3xl font-black text-slate-700">
              ₹{Number(wallet.total_withdrawn).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 block mt-2">
              Settled directly via UPI/IMPS
            </span>
          </div>
        </div>

        {/* Transactions list */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-brand-navy">Ledger Postings & Reward History</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Transaction Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy max-w-sm truncate">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      +₹{Number(tx.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{tx.posted_at}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        CREDITED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Request Modal */}
        {payoutModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-brand-navy">Request Withdrawable Payout</h3>
                <button
                  onClick={() => setPayoutModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payout Amount (₹) - Min ₹500
                  </label>
                  <input
                    type="number"
                    min="500"
                    max={wallet.current_balance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-navy focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Available: ₹{wallet.current_balance.toFixed(2)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UPI Handle / Virtual Payment Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="yourname@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requesting || wallet.current_balance < 500}
                    className="flex-1 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 disabled:opacity-50"
                  >
                    {requesting ? "Processing..." : `Withdraw ₹${payoutAmount}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
