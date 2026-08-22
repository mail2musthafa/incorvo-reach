import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Lock, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Incorvo <span className="text-brand-violet">Reach</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              <strong>Verified Actions. Measurable Growth.</strong> The high-trust two-sided marketplace where brands reward genuine customer outcomes—not fake engagement.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-violet" /> Double-Entry Ledger
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Anti-Fraud
              </span>
            </div>
          </div>

          {/* Col 2: For Businesses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">For Businesses</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/for-businesses" className="hover:text-brand-violet transition-colors">Why Incorvo Reach</Link></li>
              <li><Link href="/campaign-types" className="hover:text-brand-violet transition-colors">Campaign Catalog</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-violet transition-colors">Pricing & ROI</Link></li>
              <li><Link href="/vendor-application" className="hover:text-brand-violet transition-colors">Apply as Vendor</Link></li>
              <li><Link href="/vendor/overview" className="hover:text-brand-violet transition-colors">Vendor Portal Demo</Link></li>
            </ul>
          </div>

          {/* Col 3: For Participants */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">For Participants</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/earn-rewards" className="hover:text-brand-violet transition-colors">How to Earn</Link></li>
              <li><Link href="/participant/discover" className="hover:text-brand-violet transition-colors">Discover Missions</Link></li>
              <li><Link href="/register" className="hover:text-brand-violet transition-colors">Participant Signup</Link></li>
              <li><Link href="/participant/wallet" className="hover:text-brand-violet transition-colors">Wallet & Payouts</Link></li>
              <li><Link href="/trust-and-safety" className="hover:text-brand-violet transition-colors">Participant Code of Conduct</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Trust & Governance</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/trust-and-safety" className="hover:text-brand-violet transition-colors">Trust & Safety Policy</Link></li>
              <li><Link href="/trust-and-safety#anti-fraud" className="hover:text-brand-violet transition-colors">No-Fake-Engagement Pledge</Link></li>
              <li><Link href="/terms" className="hover:text-brand-violet transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-violet transition-colors">Privacy & Data Consent</Link></li>
              <li><Link href="/admin/overview" className="hover:text-brand-violet transition-colors">Platform Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ABC Company Private Limited. All rights reserved.</p>
          <p className="text-slate-400">Verified Actions. Measurable Growth.</p>
        </div>
      </div>
    </footer>
  );
}
