"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Coins,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params?.id as string;

  const [mission, setMission] = useState<any>({
    id: missionId,
    title: "Plant-Based Protein Bar Flavor & Texture Feedback",
    tagline: "Taste test NovaHealth's new almond fudge bar and provide honest private research.",
    description: "We are formulating a clean-label protein bar with zero artificial sweeteners. Complete a structured 12-question private feedback survey evaluating texture, sweetness and satiety.",
    vendor_name: "NovaHealth Organics",
    template_type: "PRIVATE_SURVEY",
    reward_per_action: 150.0,
    estimated_time_minutes: 8,
    remaining_capacity: 97,
    proof_instructions: "Answer all private survey questions with genuine, detailed feedback.",
    verification_method: "MANUAL_REVIEW",
  });

  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest(`/campaigns/${missionId}`);
        if (res && res.title) {
          setMission(res);
        }
      } catch (err) {
        // fallback
      }
    }
    if (missionId) load();
  }, [missionId]);

  const handleAcceptMission = async () => {
    setAccepting(true);
    setError("");

    try {
      const res = await apiRequest(`/missions/${missionId}/accept`, {
        method: "POST",
      });

      router.push(`/participant/execute/${res.assignment_id || missionId}`);
    } catch (err: any) {
      setError(err.message || "Failed to accept mission. Spots may be filled.");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <DashboardLayout portalType="participant">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/participant/discover"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discover</span>
        </Link>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
                {mission.vendor_name}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy mt-0.5">{mission.title}</h1>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-brand-muted block">Verified Reward</span>
              <span className="text-xl font-black text-emerald-700">₹{mission.reward_per_action}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Time</span>
              <span className="font-bold text-brand-navy">{mission.estimated_time_minutes} mins</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Format</span>
              <span className="font-bold text-brand-navy">{mission.template_type}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Capacity</span>
              <span className="font-bold text-emerald-700">{mission.remaining_capacity} open</span>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <h3 className="font-bold text-sm text-brand-navy">Mission Brief & Objective:</h3>
            <p>{mission.description}</p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-brand-violet-light/30 border border-brand-violet/20 text-xs">
            <h3 className="font-bold text-brand-navy flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-violet" />
              Submission & Verification Requirements:
            </h3>
            <p className="text-slate-700">{mission.proof_instructions}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Reservation window: <strong>24 Hours</strong>
            </span>

            <button
              onClick={handleAcceptMission}
              disabled={accepting}
              className="px-8 py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{accepting ? "Reserving Spot..." : "Accept Mission & Begin Task"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
