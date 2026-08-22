"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560001",
    ageRange: "25-34",
    occupation: "Software Professional",
    interests: ["Tech", "Fitness"],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const interestOptions = [
    "Tech & Gadgets",
    "Fitness & Nutrition",
    "Beauty & Skincare",
    "D2C Brands",
    "Gaming & Apps",
    "Travel & Hospitality",
    "Organic & Clean Living",
    "Finance & Investments",
  ];

  const toggleInterest = (item: string) => {
    if (formData.interests.includes(item)) {
      setFormData({ ...formData, interests: formData.interests.filter((i) => i !== item) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, item] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiRequest("/auth/register/participant", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          phone: formData.phone || null,
          city: formData.city,
          state: formData.state,
          pin_code: formData.pinCode,
          age_range: formData.ageRange,
          occupation: formData.occupation,
          interests: formData.interests,
        }),
      });

      login({
        id: res.user_id,
        email: res.email,
        fullName: res.full_name,
        role: "PARTICIPANT",
        token: res.access_token,
      });

      router.push("/participant/discover");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check the details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-brand-navy">
              Incorvo <span className="text-brand-violet">Reach</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Create Participant Profile</h1>
          <p className="text-xs text-brand-muted mt-1">
            Join verified missions, provide authentic research feedback & earn directly into your UPI/Bank.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ananya Iyer"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ananya.iyer@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (for OTP & UPI)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age Range</label>
                <select
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none text-xs bg-white"
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45+">45+</option>
                </select>
              </div>
            </div>

            {/* Interest categories */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Your Genuine Interest Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => {
                  const selected = formData.interests.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleInterest(opt)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selected
                          ? "bg-brand-violet text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-brand-violet" />
                <span>
                  I agree to the <Link href="/terms" className="text-brand-violet font-semibold underline">Participant Terms</Link>, <Link href="/trust-and-safety" className="text-brand-violet font-semibold underline">Trust & Safety Policy</Link>, and consent to verification of submitted proofs.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl font-semibold text-white gradient-brand shadow-card hover:brightness-105 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span>{loading ? "Creating Profile..." : "Complete Registration & Explore Missions"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold text-brand-violet hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
