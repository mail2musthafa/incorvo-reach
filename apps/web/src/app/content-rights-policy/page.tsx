"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Camera, ShieldCheck } from "lucide-react";

export default function ContentRightsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-violet-light text-brand-violet">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Content Rights & UGC Licensing Policy</h1>
              <p className="text-xs text-brand-muted">Incorvo Reach • Commercial Licensing Agreement</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">1. Commercial Usage License</h2>
            <p>
              When a participant uploads and submits original user-generated content (UGC photos, vertical video files, audio testimonials) under an approved campaign brief, the participant grants the sponsoring vendor an irrevocable, worldwide, royalty-free commercial license to utilize, crop, and display the asset across digital marketing channels according to the brief terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">2. Participant Authorship & Warranties</h2>
            <p>
              Participants represent that all submitted media files are their original creations, contain unscripted opinions, and do not infringe any third-party copyrights or trademarks.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
