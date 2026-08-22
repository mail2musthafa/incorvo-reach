"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Mic, Video, Monitor, StopCircle, Play, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function NativeRecordingStudioPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [recordedComplete, setRecordedComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedTime(0);
    setRecordedComplete(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedComplete(true);
  };

  const handleSubmitStudy = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Research Session & HD Screen/Audio Recording uploaded successfully!");
      router.push("/participant/my-missions");
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <DashboardLayout portalType="participant">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Interactive Usability & Screen Recording Studio</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Record your screen, webcam, and spoken thoughts aloud while testing the vendor's prototype
          </p>
        </div>

        {/* Studio Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          {/* Audio Visualizer & State */}
          <div className="p-8 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center gap-4">
              <span className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-slate-600"}`}></span>
              <span className="font-mono font-black text-2xl tracking-widest">{formatTime(recordedTime)}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5 text-brand-blue" /> Screen Shared</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5 text-emerald-400" /> Microphone Active</span>
            </div>

            {isRecording ? (
              <button
                onClick={handleStopRecording}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop & Finish Recording</span>
              </button>
            ) : !recordedComplete ? (
              <button
                onClick={handleStartRecording}
                className="px-8 py-3 rounded-xl gradient-brand text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-105 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Start Recording Task Session</span>
              </button>
            ) : (
              <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Task Session Recorded ({formatTime(recordedTime)})</span>
              </div>
            )}
          </div>

          {/* Instructions Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-brand-navy block">Study Task Prompt:</span>
            <p className="leading-relaxed">
              1. Navigate to the signup flow on the prototype.<br />
              2. Speak your honest reactions aloud: What is intuitive? What causes friction?<br />
              3. Conclude by rating how easy it was to find the checkout pricing page.
            </p>
          </div>

          {recordedComplete && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmitStudy}
                disabled={submitting}
                className="px-8 py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-card hover:brightness-105 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>{submitting ? "Uploading Video Artifacts..." : "Submit Recording for ₹500 Reward"}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
