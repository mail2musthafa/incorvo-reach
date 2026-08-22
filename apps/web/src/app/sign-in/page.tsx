"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Smartphone, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/api";

export default function SignInPage() {
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login({
        id: data.user_id,
        email: data.email,
        fullName: data.full_name,
        role: data.role,
        vendorId: data.vendor_id,
        token: data.access_token,
      });

      if (data.role === "PARTICIPANT") {
        router.push("/participant/discover");
      } else if (data.role.startsWith("VENDOR")) {
        router.push("/vendor/overview");
      } else {
        router.push("/admin/overview");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      });
      // In demo OTP, authenticate as sample participant
      login({
        id: "demo-part-phone",
        email: `${phone.replace(/\D/g, "")}@phone.reach.incorvo.in`,
        fullName: "Verified Phone Participant",
        role: "PARTICIPANT",
        token: "demo_phone_token_2026",
      });
      router.push("/participant/discover");
    } catch (err: any) {
      setError(err.message || "Invalid OTP code entered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-brand-navy">
            Incorvo <span className="text-brand-violet">Reach</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-brand-navy">Sign in to your account</h2>
        <p className="mt-1.5 text-xs text-brand-muted">
          Access your verified campaigns, submissions, or participant missions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-brand-border sm:px-10">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              onClick={() => {
                setAuthMode("password");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === "password" ? "bg-white text-brand-navy shadow-xs" : "text-slate-500 hover:text-brand-navy"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
            <button
              onClick={() => {
                setAuthMode("otp");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === "otp" ? "bg-white text-brand-navy shadow-xs" : "text-slate-500 hover:text-brand-navy"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authMode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="founder@novahealth.in or ananya.iyer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-brand-violet font-semibold cursor-pointer">Forgot?</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white gradient-brand shadow-card hover:brightness-105 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <span>{loading ? "Signing in..." : "Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-700 block">💡 Quick Demo Passwords:</span>
                <span>Vendor: <code className="text-brand-violet">founder@novahealth.in</code> / <code className="text-slate-800">IncorvoPass2026!</code></span>
                <br />
                <span>Participant: <code className="text-brand-violet">ananya.iyer@gmail.com</code> / <code className="text-slate-800">IncorvoPass2026!</code></span>
              </div>
            </form>
          ) : (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-white gradient-brand shadow-card hover:brightness-105 transition-all text-sm"
                  >
                    {loading ? "Sending..." : "Send Verification OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      placeholder="492015"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm text-center tracking-widest text-lg font-bold"
                    />
                    <span className="text-[11px] text-slate-500 block mt-1 text-center">
                      Development OTP Code: <strong className="text-brand-violet">492015</strong>
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-white gradient-brand shadow-card hover:brightness-105 transition-all text-sm"
                  >
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-brand-violet hover:underline">
              Sign up as Participant
            </Link>{" "}
            or{" "}
            <Link href="/vendor-application" className="font-bold text-brand-blue hover:underline">
              Apply as Vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
