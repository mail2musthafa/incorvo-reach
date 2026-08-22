"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Building2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([
    {
      id: "v-01",
      legal_name: "NovaHealth Organics Private Limited",
      display_name: "NovaHealth Organics",
      industry: "Health & Wellness / D2C",
      gst_number: "29AABCN1234F1Z5",
      status: "VERIFIED",
      registered_address: "Indiranagar 100ft Road, Bengaluru, Karnataka",
      created_at: "2026-08-20T10:00:00Z",
    },
    {
      id: "v-02",
      legal_name: "Zenith Cloud Technologies LLP",
      display_name: "Zenith SaaS",
      industry: "B2B Software / Enterprise",
      gst_number: "27AABFZ9876C1ZV",
      status: "UNDER_REVIEW",
      registered_address: "Bandra Kurla Complex, Mumbai, Maharashtra",
      created_at: "2026-08-22T08:30:00Z",
    },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/admin/vendor-verifications");
        if (Array.isArray(res) && res.length > 0) {
          setVendors(res);
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const handleVerify = (id: string, newStatus: "VERIFIED" | "REJECTED") => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Vendor Organization Verification</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Audit legal registration, GST credentials, and representative identities before granting campaign escrow access
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Entity Legal Name</th>
                  <th className="py-3 px-4">Brand Display</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy max-w-xs truncate">
                      {v.legal_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{v.display_name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{v.industry}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {v.gst_number || "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {v.status === "UNDER_REVIEW" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(v.id, "VERIFIED")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerify(v.id, "REJECTED")}
                            className="px-2.5 py-1 rounded-lg border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold">Approved ✓</span>
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
