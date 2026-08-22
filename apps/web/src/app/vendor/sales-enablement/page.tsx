"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GraduationCap, Award, BookOpen, CheckCircle2, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function SalesEnablementPage() {
  const [courses, setCourses] = useState<any[]>([
    {
      id: "course-01",
      title: "NovaHealth Clean Nutrition & Ingredient Certification",
      description: "Learn clean-label benefits, stevia-free formulations, and objection handling for retail customer inquiries.",
      passing_score_percent: 80,
      estimated_duration_minutes: 15,
      certified_participants_count: 84,
      reward_upon_certification_inr: 250.0
    },
    {
      id: "course-02",
      title: "Zenith Cloud SaaS Demo Qualification Masterclass",
      description: "Master B2B tech discovery questions, ICP identification, and enterprise security compliance talk tracks.",
      passing_score_percent: 85,
      estimated_duration_minutes: 25,
      certified_participants_count: 32,
      reward_upon_certification_inr: 500.0
    }
  ]);

  const [scripts, setScripts] = useState<any[]>([
    {
      id: "script-01",
      product_name: "Nova Almond Fudge Clean Protein Bar",
      opening_hook: "Hi! Are you looking for a clean afternoon energy boost without any artificial sweetener aftertaste?",
      key_value_props: ["15g Grass-fed Whey", "Zero Stevia / Zero Sucralose", "Monk fruit sweetened", "Gluten Free"],
      common_objections: {
        "Is it too sweet?": "No, monk fruit delivers a balanced subtle chocolate taste with zero lingering sweetness.",
        "How does it compare to standard bars?": "Standard bars use maltitol or sucralose which cause bloating; our formula is 100% gut-friendly."
      },
      closing_cta: "Would you like to try a single bar today or grab the 6-pack with free express shipping?"
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [csRes, scRes] = await Promise.allSettled([
          apiRequest("/sales-enablement/courses"),
          apiRequest("/sales-enablement/scripts")
        ]);
        if (csRes.status === "fulfilled" && Array.isArray(csRes.value)) setCourses(csRes.value);
        if (scRes.status === "fulfilled" && Array.isArray(scRes.value)) setScripts(scRes.value);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Sales Enablement & Agent Certification Academy</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Train participants on your product line, certify qualification exam scores, and publish sales objection talk tracks
          </p>
        </div>

        {/* Courses & Scripts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-violet" />
              Vendor Training Courses & Certification
            </h2>

            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-navy text-xs">{c.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Pass: {c.passing_score_percent}%
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{c.description}</p>
                  <div className="flex justify-between text-[11px] pt-1 text-slate-500 font-semibold">
                    <span>{c.certified_participants_count} Certified Agents</span>
                    <span className="text-brand-violet font-bold">₹{c.reward_upon_certification_inr} Reward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-blue" />
              Assisted Sales Talk Tracks & Objection Handling
            </h2>

            {scripts.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-brand-navy block text-xs">{s.product_name}</span>
                  <span className="text-slate-600 italic block mt-1">"{s.opening_hook}"</span>
                </div>

                <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                  <span className="font-bold text-brand-navy text-[11px] block">Key Value Props:</span>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                    {s.key_value_props.map((v: string) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
