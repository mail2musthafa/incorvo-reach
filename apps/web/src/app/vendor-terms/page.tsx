"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function VendorTermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-brand-navy">Vendor Master Agreement</h1>
          <p className="text-xs text-brand-muted">Incorvo Reach • Business Sponsor Terms</p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">1. Entity Obligations</h2>
            <p>
              Vendors agree to provide accurate business registration and GST credentials. Campaigns must define objective evaluation standards and maintain sufficient deposited balance in the platform ledger.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">2. Prohibition on Review Coercion</h2>
            <p>
              Vendors cannot make rewards conditional on receiving positive reviews or high star ratings. Rejections must cite specific objective criteria failure codes.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
