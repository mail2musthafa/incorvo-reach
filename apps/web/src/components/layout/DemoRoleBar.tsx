"use client";

import React from "react";
import { useAuth, RoleType } from "@/lib/auth-context";
import { ShieldCheck, UserCheck, Building2, Eye, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DemoRoleBar() {
  const { user, switchRole } = useAuth();
  const pathname = usePathname();

  const roles: { key: RoleType; label: string; icon: any; targetUrl: string }[] = [
    { key: "PUBLIC", label: "Public Visitor", icon: Eye, targetUrl: "/" },
    { key: "PARTICIPANT", label: "Participant (Ananya)", icon: UserCheck, targetUrl: "/participant/discover" },
    { key: "VENDOR_OWNER", label: "Vendor (NovaHealth)", icon: Building2, targetUrl: "/vendor/overview" },
    { key: "SUPER_ADMIN", label: "Admin & Compliance", icon: ShieldCheck, targetUrl: "/admin/overview" },
  ];

  return (
    <div className="bg-brand-navy text-white text-xs py-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-violet text-white">
          LIVE DEMO MODE
        </span>
        <span className="text-slate-300 hidden md:inline">
          Incorvo Reach Interactive Role Switcher:
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = user.role === r.key;
          return (
            <Link
              key={r.key}
              href={r.targetUrl}
              onClick={() => switchRole(r.key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all duration-150 ${
                isActive
                  ? "bg-brand-violet text-white shadow-sm ring-2 ring-brand-violet/40"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Double-Entry Ledger Verified</span>
      </div>
    </div>
  );
}
