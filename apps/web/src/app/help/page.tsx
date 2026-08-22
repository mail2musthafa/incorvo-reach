"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function HelpCenterPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Incorvo Reach verify customer actions?",
      a: "Depending on the campaign template, actions are verified via signed video watch events, qualitative question thoroughness, rotating kiosk QR tokens, perceptual image match algorithms, or manual vendor review."
    },
    {
      q: "How do participant payouts work in India?",
      a: "Once your balance reaches ₹500, you can request an instant payout directly to your UPI handle or bank account (NEFT/IMPS) processed by a licensed payment aggregator."
    },
    {
      q: "Why are paid positive reviews strictly prohibited?",
      a: "Paid public reviews violate consumer protection laws and deceive the market. Incorvo Reach enables genuine private qualitative research and authentic creative UGC rather than fake 5-star ratings."
    },
    {
      q: "What happens if a vendor cancels a live campaign?",
      a: "All unspent allocated campaign funds are immediately released back to the vendor's available ledger balance."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <section className="pt-16 pb-20 bg-white border-b border-brand-border text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-violet-light text-brand-violet text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Support & Documentation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy">
            Help Centre & FAQ
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Find answers to common questions regarding verification, campaigns, rewards, and payouts.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4 w-full">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-brand-border p-6 shadow-xs transition-all cursor-pointer"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-brand-navy">{faq.q}</h3>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
                {isOpen && <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
