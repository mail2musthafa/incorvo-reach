"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function VendorSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([
    {
      submission_id: "sub-seed-3",
      campaign_id: "c1",
      campaign_title: "Plant-Based Protein Bar Flavor & Texture Feedback",
      template_type: "PRIVATE_SURVEY",
      participant_id: "5fa88347...",
      status: "PENDING_REVIEW",
      risk_score: 0.03,
      reward_amount: 150.0,
      submitted_at: "2026-08-22T07:12:57Z",
      answers: [
        { question: "How would you rate texture balance?", answer: "A bit dry/crumbly" },
        { question: "Did you experience any lingering aftertaste?", answer: "Mild stevia note" },
        { question: "Flavor variation you'd like to see?", answer: "Cardamom Pistachio Crunch" },
      ],
      proof: {
        file_name: "protein_bar_taste_session.jpg",
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      },
    },
    {
      submission_id: "sub-seed-1",
      campaign_id: "c1",
      campaign_title: "Plant-Based Protein Bar Flavor & Texture Feedback",
      template_type: "PRIVATE_SURVEY",
      participant_id: "ananya.iy...",
      status: "APPROVED",
      risk_score: 0.02,
      reward_amount: 150.0,
      submitted_at: "2026-08-20T11:00:00Z",
      answers: [
        { question: "How would you rate texture balance?", answer: "Perfect texture balance" },
        { question: "Did you experience any lingering aftertaste?", answer: "No aftertaste (clean finish)" },
      ],
    },
  ]);

  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rejectionCode, setRejectionCode] = useState("PROOF_INCOMPLETE");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/vendors/submissions-queue");
        if (Array.isArray(res) && res.length > 0) {
          setSubmissions((prev) => {
            // merge with detailed samples
            return res;
          });
        }
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const handleDecision = async (submissionId: string, decision: "APPROVED" | "REJECTED") => {
    setReviewing(true);
    try {
      await apiRequest(`/vendors/submissions/${submissionId}/review`, {
        method: "POST",
        body: JSON.stringify({
          decision,
          rejection_reason_code: decision === "REJECTED" ? rejectionCode : null,
          participant_feedback: feedback || (decision === "APPROVED" ? "Verified and approved. Thank you!" : "Requirements not met."),
        }),
      });

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) => (s.submission_id === submissionId ? { ...s, status: decision } : s))
      );
      setSelectedSub(null);
      setFeedback("");
    } catch (err: any) {
      alert(err.message || "Failed to submit decision");
    } finally {
      setReviewing(false);
    }
  };

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Submission Review Queue</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Inspect genuine participant actions, proof files and release double-entry reward settlements
          </p>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-brand-border text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Participant ID</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Reward</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {submissions.map((sub) => (
                  <tr key={sub.submission_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy max-w-xs truncate">
                      {sub.campaign_title || "Plant-Based Protein Bar Study"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {sub.participant_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        {sub.risk_score ? (sub.risk_score * 100).toFixed(0) + "% (Clean)" : "Clean"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      ₹{sub.reward_amount || 150}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : sub.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="px-3 py-1 rounded-lg bg-brand-violet text-white text-xs font-semibold hover:bg-brand-violet-hover"
                      >
                        Inspect & Decide
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Inspector */}
        {selectedSub && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-brand-navy">Review Participant Proof</h3>
                  <p className="text-xs text-brand-muted">{selectedSub.campaign_title}</p>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Answers content */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Submitted Answers & Feedback:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-brand-navy block">Texture Balance:</span>
                    <span className="text-slate-700">A bit dry/crumbly, needs slightly more almond butter.</span>
                  </div>
                  <div>
                    <span className="font-bold text-brand-navy block">Stevia / Sweetener Aftertaste:</span>
                    <span className="text-slate-700">Mild stevia note on the finish, but otherwise clean.</span>
                  </div>
                  <div>
                    <span className="font-bold text-brand-navy block">Suggested Next Flavor:</span>
                    <span className="text-brand-violet font-semibold">Cardamom Pistachio Crunch</span>
                  </div>
                </div>
              </div>

              {/* Feedback input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Participant Feedback Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thank you for the thoughtful qualitative feedback!"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none"
                />
              </div>

              {/* Decision buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  disabled={reviewing}
                  onClick={() => handleDecision(selectedSub.submission_id, "REJECTED")}
                  className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-700 font-bold text-xs hover:bg-red-50 transition-all"
                >
                  Reject Proof
                </button>
                <button
                  disabled={reviewing}
                  onClick={() => handleDecision(selectedSub.submission_id, "APPROVED")}
                  className="flex-1 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Release ₹{selectedSub.reward_amount || 150}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
