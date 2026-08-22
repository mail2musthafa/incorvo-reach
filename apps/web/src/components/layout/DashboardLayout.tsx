"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ErahAssistant } from "@/components/common/ErahAssistant";
import {
  ShieldCheck,
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Inbox,
  BarChart3,
  Wallet,
  Settings,
  Compass,
  CheckCircle2,
  ListTodo,
  LogOut,
  Menu,
  X,
  Building2,
  Users2,
  FileCheck,
  AlertOctagon,
  LifeBuoy,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string | number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  portalType: "vendor" | "participant" | "admin";
}

export function DashboardLayout({ children, portalType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const vendorNav: NavItem[] = [
    { label: "Overview", href: "/vendor/overview", icon: LayoutDashboard },
    { label: "Campaigns", href: "/vendor/campaigns", icon: Megaphone, badge: "4" },
    { label: "Create Campaign", href: "/vendor/create-campaign", icon: PlusCircle },
    { label: "Submissions Queue", href: "/vendor/submissions", icon: Inbox, badge: "6" },
    { label: "Action Analytics", href: "/vendor/analytics", icon: BarChart3 },
    { label: "Funds & Ledger", href: "/vendor/funds", icon: Wallet },
  ];

  const participantNav: NavItem[] = [
    { label: "Discover Missions", href: "/participant/discover", icon: Compass, badge: "4 New" },
    { label: "My Missions", href: "/participant/my-missions", icon: ListTodo },
    { label: "Earnings & Wallet", href: "/participant/wallet", icon: Wallet },
  ];

  const adminNav: NavItem[] = [
    { label: "Platform Overview", href: "/admin/overview", icon: LayoutDashboard },
    { label: "Vendor Verification", href: "/admin/vendors", icon: Building2, badge: "1 Pending" },
    { label: "Payout Moderation", href: "/admin/payouts", icon: Wallet, badge: "1 Queued" },
    { label: "Disputes & Fraud", href: "/admin/disputes", icon: AlertOctagon, badge: "1 Open" },
  ];

  const currentNav =
    portalType === "vendor" ? vendorNav : portalType === "participant" ? participantNav : adminNav;

  const portalTitle =
    portalType === "vendor"
      ? "Vendor Workspace"
      : portalType === "participant"
      ? "Participant App"
      : "Platform Admin";

  return (
    <div className="min-h-screen flex bg-brand-bg">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-brand-border flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Portal Header */}
          <div className="h-16 px-6 border-b border-brand-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base text-brand-navy tracking-tight">
                  Incorvo <span className="text-brand-violet">Reach</span>
                </span>
                <span className="text-[10px] text-brand-muted block font-semibold -mt-1">{portalTitle}</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== `/${portalType}/overview` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand-violet-light text-brand-violet font-bold shadow-2xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-violet" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-brand-violet text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-brand-border">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-2">
            <div className="truncate mr-2">
              <span className="font-bold text-xs text-brand-navy block truncate">{user.fullName}</span>
              <span className="text-[11px] text-brand-muted truncate block">{user.email}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active"></span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile toggle & quick actions */}
        <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-8 flex items-center justify-between sticky top-8 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-brand-navy hidden sm:block">
              {portalTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden md:inline text-slate-500 font-medium">
              Immutable Ledger: <strong className="text-emerald-600">Reconciled</strong>
            </span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Public Website
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Embedded Erah AI Assistant */}
      <ErahAssistant role={portalType} />
    </div>
  );
}
