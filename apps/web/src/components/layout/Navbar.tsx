"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "For Businesses", href: "/for-businesses" },
    { label: "For Participants", href: "/earn-rewards" },
    { label: "Campaign Types", href: "/campaign-types" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Trust & Safety", href: "/trust-and-safety" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      className={`sticky top-8 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "glass-header border-b border-brand-border/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-brand-navy">
                Incorvo <span className="text-brand-violet">Reach</span>
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted block -mt-1">
              Verified Actions
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "text-brand-violet font-semibold"
                    : "text-slate-600 hover:text-brand-violet"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-3">
          <Link
            href="/early-access"
            className="px-3.5 py-1.5 rounded-xl border border-brand-border text-slate-700 hover:border-brand-violet hover:text-brand-violet text-xs font-bold transition-all"
          >
            Join Early Access
          </Link>
          <Link
            href="/vendor-application"
            className="px-4 py-1.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-xs hover:brightness-105 transition-all"
          >
            Apply for a Pilot
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl border border-brand-border text-slate-700 hover:text-brand-violet focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-brand-border px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-brand-violet-light hover:text-brand-violet"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/early-access"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl border border-brand-border text-slate-800 text-center text-xs font-bold"
            >
              Join Early Access
            </Link>
            <Link
              href="/vendor-application"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl gradient-brand text-white text-center text-xs font-bold shadow-xs"
            >
              Apply for a Pilot
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
