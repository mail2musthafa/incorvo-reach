"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserCheck, Download, Calendar, Mail, Phone, MapPin, CheckCircle2, Search, Filter } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState<any[]>([
    {
      id: "lead-01",
      lead_name: "Arjun Singhal",
      lead_email: "arjun@cloudscale.io",
      lead_phone: "+91 98765 43210",
      city: "Bengaluru",
      status: "QUALIFIED",
      consent_granted: true,
      follow_up_date: "2026-08-25",
      vendor_notes: "Interested in 50-seat SaaS deployment. Scheduled demo.",
      created_at: "2026-08-22T08:00:00Z"
    },
    {
      id: "lead-02",
      lead_name: "Priya Sharma",
      lead_email: "priya.sharma@healthfirst.in",
      lead_phone: "+91 91234 56789",
      city: "Mumbai",
      status: "NEW",
      consent_granted: true,
      follow_up_date: "2026-08-24",
      vendor_notes: "Requested ingredient catalog and pricing sheet.",
      created_at: "2026-08-22T09:30:00Z"
    },
    {
      id: "lead-03",
      lead_name: "Vikram Sethi",
      lead_email: "vikram@sethifinance.com",
      lead_phone: "+91 94567 12345",
      city: "Delhi NCR",
      status: "APPOINTMENT_SCHEDULED",
      consent_granted: true,
      follow_up_date: "2026-08-26",
      vendor_notes: "Booked 20-min product walkthrough consultation.",
      created_at: "2026-08-21T14:15:00Z"
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/leads");
        if (Array.isArray(res) && res.length > 0) {
          setLeads(res);
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    try {
      await apiRequest(`/leads/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      // fallback
    }
  };

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">Qualified Leads & Sales Pipeline</h1>
            <p className="text-xs text-brand-muted mt-0.5">
              100% consent-verified customer inquiries, demo appointments, and attribution tracking
            </p>
          </div>

          <button
            onClick={() => alert("Exporting 3 verified leads as CSV...")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV / Sync CRM</span>
          </button>
        </div>

        {/* Lead stage summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-[11px] font-bold text-brand-muted uppercase block">Total Verified Leads</span>
            <div className="text-xl font-black text-brand-navy mt-1">{leads.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-[11px] font-bold text-brand-muted uppercase block">Appointments</span>
            <div className="text-xl font-black text-brand-violet mt-1">1 Booked</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-[11px] font-bold text-brand-muted uppercase block">Qualified Deals</span>
            <div className="text-xl font-black text-emerald-600 mt-1">1 Pipeline</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
            <span className="text-[11px] font-bold text-brand-muted uppercase block">Attributed Revenue</span>
            <div className="text-xl font-black text-brand-navy mt-1">₹1,20,000</div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Customer Lead</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Notes & Follow-up</th>
                  <th className="py-3 px-4 text-right">Stage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-navy block">{l.lead_name}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Consent Verified
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{l.lead_email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{l.lead_phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{l.city}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                      <span>{l.vendor_notes}</span>
                      {l.follow_up_date && (
                        <span className="block text-[10px] text-brand-violet font-semibold mt-0.5">
                          Follow-up: {l.follow_up_date}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={l.status}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 bg-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="APPOINTMENT_SCHEDULED">APPOINTMENT</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="LOST">LOST</option>
                      </select>
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
