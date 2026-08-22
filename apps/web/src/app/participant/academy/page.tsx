"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GraduationCap, Award, CheckCircle2, Clock, ArrowRight, Coins } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ParticipantAcademyPage() {
  const [courses, setCourses] = useState<any[]>([
    {
      id: "course-01",
      title: "NovaHealth Clean Nutrition & Ingredient Certification",
      description: "Learn clean-label benefits, stevia-free formulations, and objection handling for retail customer inquiries.",
      passing_score_percent: 80,
      estimated_duration_minutes: 15,
      reward_upon_certification_inr: 250.0,
      is_certified: true
    },
    {
      id: "course-02",
      title: "Zenith Cloud SaaS Demo Qualification Masterclass",
      description: "Master B2B tech discovery questions, ICP identification, and enterprise security compliance talk tracks.",
      passing_score_percent: 85,
      estimated_duration_minutes: 25,
      reward_upon_certification_inr: 500.0,
      is_certified: false
    }
  ]);

  const handleTakeExam = (courseId: string) => {
    alert("Exam passed with 92% score! Certification Badge and ₹500 Reward unlocked!");
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, is_certified: true } : c)));
  };

  return (
    <DashboardLayout portalType="participant">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Certification Academy & Skill Assessments</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Complete vendor product courses and qualification exams to unlock high-value enterprise missions and direct rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {c.estimated_duration_minutes} mins
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    ₹{c.reward_upon_certification_inr}
                  </span>
                </div>

                <h3 className="font-bold text-base text-brand-navy">{c.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-2">
                {c.is_certified ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Certified Specialist ✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTakeExam(c.id)}
                    className="w-full py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs hover:brightness-105 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Take Certification Exam</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
