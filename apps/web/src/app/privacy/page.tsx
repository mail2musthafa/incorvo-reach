"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-brand-navy">Privacy Policy & Data Consent</h1>
          <p className="text-xs text-brand-muted">Last updated: August 2026 • Incorvo Reach</p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">1. Information We Collect</h2>
            <p>
              We collect participant demographic preferences, location coordinates for consented store check-in missions, and task verification artifacts. Personal identifying information is never sold to third parties without explicit affirmative consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">2. User-Generated Content Licensing</h2>
            <p>
              When participants submit UGC media under a brand brief, commercial usage rights are licensed according to the explicit terms specified in the campaign wizard. Participants retain moral authorship rights.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">3. Security & Financial Ledger Protection</h2>
            <p>
              All passwords are cryptographic Argon2id hashes. Payout bank identifiers and UPI IDs are tokenized and encrypted at rest.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
