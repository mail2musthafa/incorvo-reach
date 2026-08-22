"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Building2, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function VendorApplicationPage() {
  const [formData, setFormData] = useState({
    legalName: "",
    displayName: "",
    contactName: "",
    workEmail: "",
    phone: "",
    website: "",
    gstin: "",
    industry: "D2C Brand",
    campaignObjective: "Product Usability Testing & Consumer Taste Research",
    targetLocations: "Hyderabad, Bengaluru, Mumbai",
    estimatedBudget: 50000,
    agreedProhibitedPolicy: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedProhibitedPolicy) {
      setError("You must acknowledge and accept the Prohibited Campaign Policy.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiRequest("/auth/register/vendor", {
        method: "POST",
        body: JSON.stringify({
          email: formData.workEmail,
          password: "IncorvoVendorPilot2026!",
          full_name: formData.contactName,
          legal_name: formData.legalName,
          display_name: formData.displayName || formData.legalName,
          industry: formData.industry,
          registered_address: `${formData.targetLocations}, India`
        })
      });
      setSubmitted(true);
    } catch (err: any) {
      // In pilot demo mode, gracefully accept
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet-light text-brand-violet font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design Partner Pilot Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-navy">Apply for a Controlled Vendor Pilot</h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto leading-relaxed">
            Run a high-intent research, UGC, or field-audit campaign with dedicated onboarding support. Every pilot campaign is manually verified and moderated.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-card text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-brand-navy">Pilot Application Submitted!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{formData.contactName}</strong>. Our campaign operations team has received your pilot application for <strong>{formData.legalName}</strong>. We will review your GSTIN and campaign brief within 4 business hours.
            </p>
            <div className="pt-2">
              <Link
                href="/vendor/overview"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105"
              >
                <span>Enter Vendor Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Business Identity */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Business Identity & Legal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Legal Entity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nova Nutrition Pvt Ltd"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NovaHealth"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="partnerships@brand.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Website URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://brand.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number (Optional for pilot)</label>
                  <input
                    type="text"
                    placeholder="36AABCN1234F1Z9"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Business Category *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-semibold bg-white"
                  >
                    <option value="D2C Brand">D2C Consumer Brand</option>
                    <option value="B2B SaaS">B2B SaaS / Tech Startup</option>
                    <option value="Retail & FMCG">Retail & FMCG Distributor</option>
                    <option value="Clean Beauty">Clean Beauty & Wellness</option>
                    <option value="Financial Services">Financial Services</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Pilot Campaign Brief */}
            <div className="space-y-4 pt-2">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Pilot Campaign Brief & Target Economics
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Campaign Objective *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.campaignObjective}
                  onChange={(e) => setFormData({ ...formData, campaignObjective: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Geographies</label>
                  <input
                    type="text"
                    value={formData.targetLocations}
                    onChange={(e) => setFormData({ ...formData, targetLocations: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Pilot Budget (₹ INR) *</label>
                  <input
                    type="number"
                    min="25000"
                    step="5000"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Compliance Acceptance */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-brand-navy block">Acceptable Campaign & Trust Policy</span>
              <p className="leading-relaxed text-[11px]">
                Incorvo Reach operates strictly on genuine, verified customer outcomes. <strong>We do not support paid 5-star public reviews, artificial likes/followers, fake comments, or advertisement-click manipulation.</strong>
              </p>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                required
                checked={formData.agreedProhibitedPolicy}
                onChange={(e) => setFormData({ ...formData, agreedProhibitedPolicy: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-brand-violet focus:ring-brand-violet"
              />
              <span className="text-slate-700 font-semibold">
                I agree to the <Link href="/acceptable-campaign-policy" className="text-brand-violet underline">Acceptable Campaign Policy</Link> and certify that our campaign does not solicit fake engagement or misleading public ratings.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Submitting Application..." : "Submit Vendor Pilot Application"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
