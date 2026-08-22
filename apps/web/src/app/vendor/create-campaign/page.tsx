"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  FileSearch,
  Video,
  Camera,
  Users,
  MapPin,
  Ticket,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function CreateCampaignWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    templateType: "PRIVATE_SURVEY",
    rewardPerAction: 150,
    totalCapacity: 50,
    estimatedTimeMinutes: 10,
    proofInstructions: "Complete all questions with detailed, uncoerced feedback.",
    verificationMethod: "MANUAL_REVIEW",
    questions: [
      {
        question_text: "What was your immediate impression of the product packaging?",
        question_type: "TEXT",
        is_required: true,
        options_json: [],
      },
      {
        question_text: "How would you rate the overall flavor balance on a scale of 1-5?",
        question_type: "SINGLE_CHOICE",
        is_required: true,
        options_json: ["1 - Poor", "2 - Fair", "3 - Average", "4 - Good", "5 - Excellent"],
      },
    ],
  });

  const templates = [
    { type: "PRIVATE_SURVEY", label: "Private Research Survey", icon: FileSearch, desc: "Qualitative sentiment & deep market feedback." },
    { type: "UGC", label: "Original UGC Video / Media", icon: Camera, desc: "Authentic vertical videos with commercial rights." },
    { type: "VIDEO_QUIZ", label: "Hosted Video & Quiz", icon: Video, desc: "Educational video stream with anti-skip quiz." },
    { type: "QUALIFIED_LEAD", label: "Qualified Lead Inquiries", icon: Users, desc: "Consent-based consultation & demo inquiries." },
    { type: "STORE_VISIT", label: "Store & QR Check-in", icon: MapPin, desc: "Dynamic rotating QR code physical footfall." },
    { type: "COUPON_REDEMPTION", label: "Tracked Coupon Redemption", icon: Ticket, desc: "Unique promo code checkout validations." },
  ];

  const platformFeePerAction = Math.round(Number(formData.rewardPerAction) * 0.15 * 100) / 100;
  const unitCost = Number(formData.rewardPerAction) + platformFeePerAction;
  const totalEscrowBudget = Math.round(unitCost * Number(formData.totalCapacity) * 100) / 100;

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question_text: "",
          question_type: "TEXT",
          is_required: true,
          options_json: [],
        },
      ],
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, idx) => idx !== index),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await apiRequest("/campaigns", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          tagline: formData.tagline,
          description: formData.description,
          template_type: formData.templateType,
          reward_per_action: Number(formData.rewardPerAction),
          total_capacity: Number(formData.totalCapacity),
          estimated_time_minutes: Number(formData.estimatedTimeMinutes),
          proof_instructions: formData.proofInstructions,
          verification_method: formData.verificationMethod,
          questions: formData.questions,
        }),
      });

      router.push("/vendor/campaigns");
    } catch (err: any) {
      setError(err.message || "Failed to launch campaign. Please check required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout portalType="vendor">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wizard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">Create Verified Action Campaign</h1>
            <p className="text-xs text-brand-muted mt-0.5">
              Step {currentStep} of 4 • Escrow-backed outcome configuration
            </p>
          </div>

          {/* Stepper bubbles */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === step
                    ? "bg-brand-violet text-white shadow-2xs"
                    : currentStep > step
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {currentStep > step ? "✓" : step}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs">
          {/* STEP 1: Select Template */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-brand-navy">1. Select Campaign Objective & Template</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose the verifiable outcome you want participants to deliver.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map((tpl) => {
                  const Icon = tpl.icon;
                  const isSelected = formData.templateType === tpl.type;
                  return (
                    <div
                      key={tpl.type}
                      onClick={() => setFormData({ ...formData, templateType: tpl.type })}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-brand-violet bg-brand-violet-light/30 ring-2 ring-brand-violet/20"
                          : "border-brand-border bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-brand-violet text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-brand-navy">{tpl.label}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{tpl.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs flex items-center gap-1.5 shadow-card"
                >
                  <span>Next: Campaign Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Campaign Copy & Instructions */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-brand-navy">2. Campaign Brief & Participant Instructions</h2>
                <p className="text-xs text-slate-500 mt-1">Provide clear, uncoerced guidelines for participants.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Headline Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plant-Based Protein Bar Flavor & Texture Study"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet/40 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Try our clean-label almond fudge bar and share honest qualitative ratings."
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Campaign Description & Context</label>
                <textarea
                  rows={3}
                  placeholder="Explain background context, why you need customer feedback, and how insights will be used."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exact Proof Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Specify acceptable photo/video resolution or required survey thoroughness."
                  value={formData.proofInstructions}
                  onChange={(e) => setFormData({ ...formData, proofInstructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.title}
                  className="px-6 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs flex items-center gap-1.5 shadow-card disabled:opacity-50"
                >
                  <span>Next: Survey Questions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Questions Builder */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-brand-navy">3. Configure Task Questions</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Structured questions for participant responses (no public review coercion).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-violet-light text-brand-violet font-bold text-xs flex items-center gap-1 hover:bg-brand-violet-light/70"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-navy">Question #{idx + 1}</span>
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Enter question text..."
                      value={q.question_text}
                      onChange={(e) => {
                        const updated = [...formData.questions];
                        updated[idx].question_text = e.target.value;
                        setFormData({ ...formData, questions: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                    />

                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 text-slate-700">
                        <span className="font-semibold">Type:</span>
                        <select
                          value={q.question_type}
                          onChange={(e) => {
                            const updated = [...formData.questions];
                            updated[idx].question_type = e.target.value;
                            setFormData({ ...formData, questions: updated });
                          }}
                          className="px-2 py-1 rounded border border-slate-200 bg-white text-xs"
                        >
                          <option value="TEXT">Free Text Response</option>
                          <option value="SINGLE_CHOICE">Single Choice</option>
                          <option value="RATING_SCALE">1-5 Rating Scale</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs flex items-center gap-1.5 shadow-card"
                >
                  <span>Next: Budget & Escrow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Budget & Ledger Escrow Hold */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-brand-navy">4. Budget, Capacity & Escrow Lock</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Campaign funds are held securely in double-entry escrow and only released for verified actions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Participant Reward Per Action (₹)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={formData.rewardPerAction}
                    onChange={(e) => setFormData({ ...formData, rewardPerAction: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none text-sm font-bold text-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Participant Capacity (Spots)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={formData.totalCapacity}
                    onChange={(e) => setFormData({ ...formData, totalCapacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none text-sm font-bold text-brand-navy"
                  />
                </div>
              </div>

              {/* Real-time Escrow Summary Box */}
              <div className="p-5 rounded-2xl bg-brand-violet-light/30 border border-brand-violet/20 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Participant Reward Pool ({formData.totalCapacity} spots × ₹{formData.rewardPerAction}):</span>
                  <span className="font-bold text-brand-navy">
                    ₹{(formData.totalCapacity * formData.rewardPerAction).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Incorvo Platform Commission (15%):</span>
                  <span className="font-bold text-brand-navy">
                    ₹{(formData.totalCapacity * platformFeePerAction).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="pt-2 border-t border-brand-violet/20 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-brand-navy flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-brand-violet" />
                    Total Escrow Budget to Lock:
                  </span>
                  <span className="font-black text-brand-violet text-lg">
                    ₹{totalEscrowBudget.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Policy checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-brand-violet" />
                <span>
                  I confirm that this campaign does not solicit fake public reviews, 5-star manipulation, or forced follower metrics.
                </span>
              </label>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl gradient-brand text-white font-bold text-xs flex items-center gap-1.5 shadow-card hover:brightness-105 transition-all disabled:opacity-50"
                >
                  <span>{loading ? "Locking Escrow & Launching..." : "Fund & Launch Campaign"}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
