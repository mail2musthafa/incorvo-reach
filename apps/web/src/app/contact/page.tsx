"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <section className="pt-16 pb-20 bg-white border-b border-brand-border text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy">Contact Incorvo Reach</h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Speak with our enterprise partnerships team or compliance officers.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-brand-navy">Company Information</h2>
            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-violet mt-0.5" />
                <div>
                  <strong className="text-brand-navy block">Registered Entity:</strong>
                  <span>Incorvo Reach</span>
                  <br />
                  <span>Bengaluru & Mumbai, India</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-violet" />
                <div>
                  <strong className="text-brand-navy block">Support & Compliance:</strong>
                  <span>reach@incorvo.in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-xs">
            {submitted ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base text-brand-navy">Message Received</h3>
                <p className="text-xs text-slate-600">Our representative will get back to you within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input required type="text" placeholder="Aarav Sharma" className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <input required type="email" placeholder="aarav@company.com" className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea required rows={3} placeholder="How can our partnership team assist you?" className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
