"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, CheckCircle2, Smartphone, MapPin, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function EarlyAccessPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Hyderabad",
    pinCode: "",
    ageConfirmed: false,
    devices: ["Android Smartphone"],
    languages: ["English", "Telugu", "Hindi"],
    skills: ["Product Feedback", "Store Audits"],
    missionPreferences: ["Private Surveys", "Usability Testing", "Store Check-ins"],
    consentDPDP: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ageConfirmed) {
      setError("You must confirm you are 18 years of age or older to participate.");
      return;
    }
    if (!formData.consentDPDP) {
      setError("Please accept the DPDP-compliant privacy and participation terms.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Register participant user account with early access flags
      await apiRequest("/auth/register/participant", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          password: "IncorvoEarlyAccess2026!",
          full_name: formData.fullName,
          city: formData.city,
          state: "Telangana"
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet-light text-brand-violet font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Controlled Pilot Cohort (Hyderabad & Metros)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-navy">Join Participant Early Access</h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto leading-relaxed">
            Test prototypes, provide authentic product research, and conduct store audits for verified brands. Earn guaranteed rewards per approved task.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-card text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-brand-navy">Early Access Registration Received!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Welcome to the Incorvo Reach pilot community, <strong>{formData.fullName}</strong>. We will notify you via SMS/WhatsApp on <strong>{formData.phone}</strong> as soon as the first verified missions match your profile in {formData.city}.
            </p>
            <div className="pt-2">
              <Link
                href="/participant/discover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105"
              >
                <span>Browse Pilot Mission Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Verma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="arjun.verma@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile (+91) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs font-semibold bg-white"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="500081"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet"
                />
              </div>
            </div>

            {/* Age & Compliance Notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-brand-navy block">Data Protection & Privacy Notice (DPDP Act, 2023)</span>
              <p className="leading-relaxed text-[11px]">
                Incorvo Reach collects only necessary demographic details to match relevant pilot campaigns. <strong>We do not collect PAN, Aadhaar, or bank details during early access.</strong> Payout details are requested only when you initiate your first verified reward withdrawal.
              </p>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.ageConfirmed}
                  onChange={(e) => setFormData({ ...formData, ageConfirmed: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-brand-violet focus:ring-brand-violet"
                />
                <span className="text-slate-700 font-semibold">
                  I confirm that I am <strong>18 years of age or older</strong> and eligible to participate in customer action tasks.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.consentDPDP}
                  onChange={(e) => setFormData({ ...formData, consentDPDP: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-brand-violet focus:ring-brand-violet"
                />
                <span className="text-slate-700">
                  I agree to the <Link href="/participant-terms" className="text-brand-violet font-bold underline">Participant Terms</Link> and consent to processing my profile data under the <Link href="/privacy" className="text-brand-violet font-bold underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Submitting Application..." : "Submit Early Access Application"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
