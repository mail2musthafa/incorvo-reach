"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapPin, QrCode, Sparkles, Tag, CheckCircle2, ArrowRight } from "lucide-react";

export default function LocalOffersPage() {
  const [offers, setOffers] = useState([
    {
      id: "off-01",
      brand: "NovaHealth Flagship Lounge",
      city: "Bengaluru (Indiranagar)",
      offer_title: "Free Organic Matcha Beverage + ₹200 Check-in Credit",
      distance_km: 1.2,
      qr_token: "QR_BLR_INDIRA_9921",
      expires_in_hours: 48
    },
    {
      id: "off-02",
      brand: "Reliance Signature Gourmet",
      city: "Mumbai (Bandra West)",
      offer_title: "Mystery Audit & 15% In-Store Loyalty Stamp",
      distance_km: 2.8,
      qr_token: "QR_MUM_BANDRA_4412",
      expires_in_hours: 72
    }
  ]);

  const [activeQr, setActiveQr] = useState<string | null>(null);

  return (
    <DashboardLayout portalType="participant">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Nearby Local Merchant Offers & QR Check-in</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Discover verified retail brand locations near you, scan rotating in-store QR tokens, and collect instant visit rewards
          </p>
        </div>

        {/* QR Modal */}
        {activeQr && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-base text-brand-navy">Present In-Store QR Token</h3>
              <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                <QrCode className="w-32 h-32 text-brand-navy" />
              </div>
              <span className="font-mono font-bold text-xs text-brand-violet block">{activeQr}</span>
              <p className="text-[11px] text-slate-500">Scan at the checkout terminal or show the store manager to claim your visit reward.</p>
              <button
                onClick={() => setActiveQr(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close Token
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((off) => (
            <div key={off.id} className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-brand-muted uppercase">{off.brand}</span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-violet bg-brand-violet-light/50 px-2 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3" /> {off.distance_km} km away
                  </span>
                </div>
                <h3 className="font-bold text-base text-brand-navy leading-snug">{off.offer_title}</h3>
                <span className="text-xs text-slate-500 block mt-1">{off.city}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-amber-700 font-semibold">Expires in {off.expires_in_hours}h</span>
                <button
                  onClick={() => setActiveQr(off.qr_token)}
                  className="px-4 py-2 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs hover:brightness-105 flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Reveal Check-in QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
