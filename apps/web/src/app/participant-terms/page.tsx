"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ParticipantTermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-brand-navy">Participant Terms & Code of Conduct</h1>
          <p className="text-xs text-brand-muted">Incorvo Reach • Participant Agreement</p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">1. Authentic Human Participation</h2>
            <p>
              Participants agree to complete missions honestly and without the use of emulators, bot scripts, or fake multiple accounts. Duplicate submissions and plagiarized images are detected via perceptual hashing and lead to account suspension.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">2. Fair Dispute & Appeal Rights</h2>
            <p>
              Participants have the guaranteed right to raise formal disputes with attached evidence if they believe a vendor incorrectly rejected their valid proof.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
