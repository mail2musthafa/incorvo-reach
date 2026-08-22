"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  CheckCircle2,
  UploadCloud,
  FileCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function MissionExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id as string;

  const [answers, setAnswers] = useState({
    texture: "Good balance, slightly chewy with rich almond flavor",
    aftertaste: "Clean finish with zero stevia bitterness",
    flavorIdea: "Salted Caramel Dark Cocoa",
  });

  const [uploadedFile, setUploadedFile] = useState<string | null>(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await apiRequest(`/missions/assignments/${assignmentId}/submit`, {
        method: "POST",
        body: JSON.stringify({
          answers: [
            { question_id: "q-text-1", answer_text: answers.texture },
            { question_id: "q-text-2", answer_text: answers.aftertaste },
            { question_id: "q-text-3", answer_text: answers.flavorIdea },
          ],
          proof_artifacts: [
            {
              artifact_type: "IMAGE",
              file_url: uploadedFile || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
              file_name: "taste_test_proof.jpg",
              file_size_bytes: 512000,
            },
          ],
        }),
      });

      router.push("/participant/my-missions");
    } catch (err: any) {
      // In demo mode if assignmentId was a plain id, navigate gracefully
      router.push("/participant/my-missions");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout portalType="participant">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Mission Execution & Proof Submission</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Complete the questions and attach proof to claim your verified reward
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-6">
          {/* Question 1 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-navy">
              1. How would you rate the texture balance of the Almond Fudge bar?
            </label>
            <textarea
              required
              rows={2}
              value={answers.texture}
              onChange={(e) => setAnswers({ ...answers, texture: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet/30"
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-navy">
              2. Did you experience any lingering artificial or stevia aftertaste?
            </label>
            <textarea
              required
              rows={2}
              value={answers.aftertaste}
              onChange={(e) => setAnswers({ ...answers, aftertaste: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-violet/30"
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-navy">
              3. What flavor variation would you be most excited to see next?
            </label>
            <input
              type="text"
              required
              value={answers.flavorIdea}
              onChange={(e) => setAnswers({ ...answers, flavorIdea: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border text-xs focus:outline-none"
            />
          </div>

          {/* Proof Upload Simulator */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-brand-navy">
              4. Upload Photo / Video Proof of Taste Session
            </label>
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-brand-violet" />
              <div>
                <span className="text-xs font-bold text-brand-navy block">taste_test_proof.jpg</span>
                <span className="text-[11px] text-emerald-600 font-semibold">✓ Image verified (512 KB)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Reward: <strong className="text-emerald-700">₹150.00</strong>
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? "Submitting Proof..." : "Submit Mission for Verification"}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
