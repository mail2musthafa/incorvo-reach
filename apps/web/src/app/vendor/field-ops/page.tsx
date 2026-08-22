"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapPin, QrCode, AlertTriangle, CheckCircle2, Store } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function FieldOperationsPage() {
  const [stores, setStores] = useState<any[]>([
    {
      id: "st-001",
      store_code: "NOVA-BLR-01",
      store_name: "Nova Flagship Experience Lounge",
      retail_chain: "COMPANY_OWNED",
      city: "Bengaluru",
      address: "100ft Road, Indiranagar",
      geofence_radius_meters: 150,
      qr_token: "QR_BLR_INDIRA_9921",
      is_active: true
    },
    {
      id: "st-002",
      store_code: "REL-RET-MUM-44",
      store_name: "Reliance Signature Gourmet Bandra",
      retail_chain: "RELIANCE_RETAIL",
      city: "Mumbai",
      address: "Hill Road, Bandra West",
      geofence_radius_meters: 100,
      qr_token: "QR_MUM_BANDRA_4412",
      is_active: true
    }
  ]);

  const [actions, setActions] = useState<any[]>([
    {
      id: "ca-101",
      store_name: "Reliance Signature Gourmet Bandra",
      issue_type: "OUT_OF_STOCK",
      description: "Ceremonial Matcha 30g tin shelf facing empty during mystery audit.",
      status: "ASSIGNED_TO_DISTRIBUTOR",
      created_at: "2026-08-22T08:30:00Z"
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [stRes, caRes] = await Promise.allSettled([
          apiRequest("/field-operations/stores"),
          apiRequest("/field-operations/corrective-actions")
        ]);
        if (stRes.status === "fulfilled" && Array.isArray(stRes.value)) setStores(stRes.value);
        if (caRes.status === "fulfilled" && Array.isArray(caRes.value)) setActions(caRes.value);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Field Operations & Retail Store Audits</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Store masters, geofenced GPS check-ins, rotating kiosk QR tokens, and shelf stock corrective actions
          </p>
        </div>

        {/* Store Master List */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-violet" />
            Retail Location & Geofence Registry
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {stores.map((s) => (
              <div key={s.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-navy">{s.store_name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                      {s.store_code}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    {s.address}, {s.city} • Geofence: {s.geofence_radius_meters}m
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-700">
                    QR: {s.qr_token}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corrective Action Log */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Retail Issue Tracking & Corrective Actions
          </h2>

          <div className="space-y-3 text-xs">
            {actions.map((act) => (
              <div key={act.id} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-navy">{act.store_name}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    {act.status}
                  </span>
                </div>
                <p className="text-slate-700">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
