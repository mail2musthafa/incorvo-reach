"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Video, Mic, FileText, Sparkles, Play, Tag, Users, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ResearchStudioPage() {
  const [studies, setStudies] = useState<any[]>([
    {
      id: "study-01",
      title: "Clean-Label Plant Protein Taste & Texture Usability Study",
      hypothesis: "Consumers prefer monk fruit sweetness over stevia by a 3:1 ratio.",
      methodology: "MODERATED_INTERVIEWS",
      tags: ["D2C", "Taste-Test", "Packaging"],
      sessions_count: 8,
      created_at: "2026-08-20T10:00:00Z"
    }
  ]);

  const [sessions, setSessions] = useState<any[]>([
    {
      id: "rs-001",
      participant_name: "Ananya Iyer",
      session_type: "LIVE_INTERVIEW",
      status: "COMPLETED",
      duration_seconds: 1320,
      sentiment_score: 0.85,
      key_themes: ["Clean Finish", "Chewy Consistency", "Premium Box"],
      recording_video_url: "https://cdn.reach.incorvo.in/research/session_001.mp4",
      transcript_summary: "Participant noted exceptional mouthfeel without stevia aftertaste. Requested smaller pocket-sized snack packs.",
      completed_at: "2026-08-21T14:30:00Z"
    }
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [stdRes, sesRes] = await Promise.allSettled([
          apiRequest("/research-studio/studies"),
          apiRequest("/research-studio/sessions")
        ]);
        if (stdRes.status === "fulfilled" && Array.isArray(stdRes.value)) setStudies(stdRes.value);
        if (sesRes.status === "fulfilled" && Array.isArray(sesRes.value)) setSessions(sesRes.value);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">Research Studio & Qualitative Intelligence</h1>
            <p className="text-xs text-brand-muted mt-0.5">
              Live moderated customer interviews, automated speech-to-text transcripts, and highlight clip reels
            </p>
          </div>

          <button
            onClick={() => alert("Launching new moderated study wizard...")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-xs hover:brightness-105"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Schedule Moderated Interview Study</span>
          </button>
        </div>

        {/* Highlight Reel & Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-5">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-violet" />
              Recent Moderated Video Sessions & AI Transcripts
            </h2>

            <div className="space-y-4">
              {sessions.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-brand-navy block text-xs">{s.participant_name}</span>
                      <span className="text-[11px] text-slate-500">Duration: {Math.floor(s.duration_seconds / 60)} mins • Sentiment: +{(s.sentiment_score * 100).toFixed(0)}% Positive</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      TRANSCRIPT READY
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-100">
                    "{s.transcript_summary}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {s.key_themes.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-brand-violet-light text-brand-violet font-bold text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h3 className="text-base font-bold text-brand-navy">Active Qualitative Studies</h3>
            {studies.map((std) => (
              <div key={std.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-brand-muted uppercase block">{std.methodology}</span>
                <h4 className="font-bold text-xs text-brand-navy">{std.title}</h4>
                <span className="text-[11px] text-brand-violet font-semibold block">{std.sessions_count} Participant Sessions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
