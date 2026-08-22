"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Package, Truck, CheckCircle2, Box, ArrowRight, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function SamplingOperationsPage() {
  const [inventory, setInventory] = useState<any[]>([
    {
      id: "samp-101",
      name: "Nova Organic Almond Fudge Protein Bar (50g)",
      sku: "NOVA-BAR-ALM-50G",
      weight_grams: 50.0,
      unit_cost_inr: 45.0,
      stock_quantity: 450,
      allocated_quantity: 97
    },
    {
      id: "samp-102",
      name: "Nova Ceremonial Japanese Matcha Tin (30g)",
      sku: "NOVA-MATCHA-CER-30G",
      weight_grams: 30.0,
      unit_cost_inr: 280.0,
      stock_quantity: 180,
      allocated_quantity: 25
    }
  ]);

  const [batches, setBatches] = useState<any[]>([
    {
      id: "batch-01",
      batch_reference: "DISP_2026_AUG_NOVA_01",
      courier_partner: "DELHIVERY_EXPRESS",
      total_units: 50,
      status: "IN_TRANSIT",
      created_at: "2026-08-21T09:00:00Z"
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [invRes, batRes] = await Promise.allSettled([
          apiRequest("/sampling/inventory"),
          apiRequest("/sampling/batches")
        ]);
        if (invRes.status === "fulfilled" && Array.isArray(invRes.value)) setInventory(invRes.value);
        if (batRes.status === "fulfilled" && Array.isArray(batRes.value)) setBatches(batRes.value);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">Physical Sampling & Fulfillment Operations</h1>
            <p className="text-xs text-brand-muted mt-0.5">
              Direct-to-consumer sample warehouse inventory, address validation, courier dispatch, and delivery confirmations
            </p>
          </div>

          <button
            onClick={() => alert("Creating new dispatch fulfillment batch...")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-xs hover:brightness-105"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Create Dispatch Batch</span>
          </button>
        </div>

        {/* Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Box className="w-4 h-4 text-brand-violet" />
              Warehouse Sample SKU Inventory
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              {inventory.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-brand-navy block">{item.name}</span>
                    <span className="font-mono text-slate-500 text-[11px]">SKU: {item.sku} • Unit Cost: ₹{item.unit_cost_inr}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-brand-navy text-sm block">{item.stock_quantity} in stock</span>
                    <span className="text-[10px] text-amber-700 font-semibold">{item.allocated_quantity} reserved in flights</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              Active Dispatch Batches & Courier Tracking
            </h2>

            <div className="space-y-3">
              {batches.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-brand-navy block">{b.batch_reference}</span>
                    <span className="text-slate-500 text-[11px]">{b.courier_partner} • {b.total_units} Direct Deliveries</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
