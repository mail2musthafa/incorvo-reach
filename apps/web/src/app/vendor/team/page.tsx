"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users2, UserPlus, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

export default function VendorTeamPage() {
  const [members, setMembers] = useState([
    { id: "m1", name: "Rahul Mehta", email: "founder@novahealth.in", role: "OWNER", status: "ACTIVE" },
    { id: "m2", name: "Simran Kaur", email: "growth@novahealth.in", role: "CAMPAIGN_MANAGER", status: "ACTIVE" },
    { id: "m3", name: "Devansh Patel", email: "qa@novahealth.in", role: "REVIEWER", status: "ACTIVE" },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("REVIEWER");
  const [invited, setInvited] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setMembers((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, name: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole, status: "INVITED" }
    ]);
    setInviteEmail("");
    setInvited(true);
    setTimeout(() => setInvited(false), 3000);
  };

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Team Members & Role Access Control</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage granular organization permissions across Owner, Campaign Manager, Reviewer, Analyst, and Billing Manager
          </p>
        </div>

        {/* Invite Member Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs">
          <h2 className="text-base font-bold text-brand-navy mb-1">Invite New Team Member</h2>
          <p className="text-xs text-brand-muted mb-4">
            Assigned roles determine campaign creation, submission moderation, and billing fund authorization.
          </p>

          {invited && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Invitation sent with cryptographic onboarding token!</span>
            </div>
          )}

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
            <input
              type="email"
              required
              placeholder="colleague@novahealth.in"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-brand-border bg-white text-xs font-semibold text-slate-700"
            >
              <option value="CAMPAIGN_MANAGER">Campaign Manager</option>
              <option value="REVIEWER">Submission Reviewer</option>
              <option value="ANALYST">Read-Only Analyst</option>
              <option value="BILLING_MANAGER">Billing Manager</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs"
            >
              Send Invite
            </button>
          </form>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy">{m.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{m.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-brand-violet-light text-brand-violet font-bold text-[10px]">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
