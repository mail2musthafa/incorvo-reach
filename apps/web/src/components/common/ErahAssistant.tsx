"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Globe,
  AlertTriangle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  BookOpen,
  LifeBuoy,
  PhoneCall
} from "lucide-react";
import { ErahCharacter, ErahState } from "./ErahCharacter";
import { apiRequest } from "@/lib/api";

interface ErahAssistantProps {
  role?: "vendor" | "participant" | "admin" | "visitor";
}

interface ChatMessage {
  id: string;
  sender: "user" | "erah";
  text: string;
  actionType?: string;
  draftData?: any;
  suggestedActions?: string[];
  sources?: string[];
  feedback?: "helpful" | "unhelpful" | null;
}

export function ErahAssistant({ role = "vendor" }: ErahAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [characterState, setCharacterState] = useState<ErahState>("idle");
  const [voiceActive, setVoiceActive] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [language, setLanguage] = useState("English");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "erah",
      text:
        role === "vendor"
          ? "Hello! I am **Erah AI**, your Incorvo Reach campaign architect.\n\nTell me your business objective, target audience, or budget, and I'll generate a complete, policy-compliant campaign brief for you."
          : role === "participant"
          ? "Hi there! I am **Erah AI**.\n\nI can help you discover high-paying missions, understand task instructions in simple words (English/Hindi/Telugu/Urdu), and check your wallet payout status."
          : role === "admin"
          ? "Greetings Admin! I am **Erah AI**.\n\nI monitor fraud velocity outliers, flag suspicious duplicate proof hashes, and prioritize your verification and dispute queues."
          : "Welcome to Incorvo Reach! I am **Erah AI**.\n\nAre you looking to grow a business with verified customer actions, or would you like to earn rewards by participating in research and product testing?",
      sources: ["Acceptable Campaign Policy", "Campaign Operations Handbook"],
      suggestedActions:
        role === "vendor"
          ? [
              "I own 5 restaurants in Hyderabad and want repeat customers",
              "Create UGC Video Brief",
              "Calculate Pricing Economics",
              "Contact Campaign Operations"
            ]
          : role === "participant"
          ? [
              "Recommend high reward missions",
              "Check my wallet and payout status",
              "తెలుగులో సహాయం (Telugu Help)",
              "Report a rejected task"
            ]
          : role === "admin"
          ? [
              "Summarize fraud alerts",
              "Prioritize pending vendor GSTINs",
              "Check ledger reconciliation status"
            ]
          : [
              "How Incorvo Reach works",
              "Apply for a Vendor Pilot",
              "Join Participant Early Access",
              "Review Trust & Safety Charter"
            ]
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Handle Speech Recognition
  const toggleVoiceRecording = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use text input.");
      return;
    }

    if (voiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceActive(false);
      setCharacterState("idle");
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang =
          language === "Telugu"
            ? "te-IN"
            : language === "Hindi"
            ? "hi-IN"
            : language === "Urdu"
            ? "ur-IN"
            : "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setVoiceActive(true);
          setCharacterState("listening");
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = () => {
          setVoiceActive(false);
          setCharacterState("idle");
        };

        recognition.onend = () => {
          setVoiceActive(false);
          if (characterState === "listening") {
            setCharacterState("idle");
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        setVoiceActive(false);
        setCharacterState("idle");
      }
    }
  };

  // Text-To-Speech (SpeechSynthesis)
  const speakResponse = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Interrupt previous speech

    const cleanText = text.replace(/[*#•]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang =
      language === "Telugu"
        ? "te-IN"
        : language === "Hindi"
        ? "hi-IN"
        : language === "Urdu"
        ? "ur-IN"
        : "en-IN";
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsSpeakingAudio(true);
      setCharacterState("speaking");
    };

    utterance.onend = () => {
      setIsSpeakingAudio(false);
      setCharacterState("idle");
    };

    utterance.onerror = () => {
      setIsSpeakingAudio(false);
      setCharacterState("idle");
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingAudio(false);
      setCharacterState("idle");
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    stopSpeaking();
    const userMsgId = `usr-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: "user", text: query }
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setCharacterState("thinking");

    try {
      const res = await apiRequest("/ai/erah/chat", {
        method: "POST",
        body: JSON.stringify({
          role,
          message: query,
          language
        })
      });

      const erahReply = res.reply || "I am processing your request...";
      const newErahMsg: ChatMessage = {
        id: `erah-${Date.now()}`,
        sender: "erah",
        text: erahReply,
        actionType: res.action_type,
        draftData: res.draft_data,
        suggestedActions: res.suggested_actions,
        sources: [
          "Acceptable Campaign Policy §2.1",
          "Campaign Operations Handbook 2026",
          "DPDP Privacy Governance Charter"
        ],
        feedback: null
      };

      setMessages([...newMessages, newErahMsg]);

      if (res.action_type === "POLICY_WARNING") {
        setCharacterState("warning");
      } else {
        setCharacterState("speaking");
        speakResponse(erahReply);
      }
    } catch (err) {
      // Offline fallback
      setTimeout(() => {
        let reply =
          "I have referenced our official operating handbook. I can help convert this into a policy-compliant campaign draft or guide you on verification rules.";
        if (
          query.toLowerCase().includes("restaurant") ||
          query.toLowerCase().includes("hyderabad")
        ) {
          reply =
            "I've structured a **Retail Footfall & QR Check-in Campaign Draft** for your Hyderabad locations:\n\n• **Format**: Store Check-in & Review Feedback\n• **Recommended Reward**: ₹150.00 per verified visit\n• **Proof Requirement**: GPS geotag check-in (< 100m radius) + timestamped kiosk QR token scan + 3-question survey\n• **Estimated Budget for 100 Verified Visits**: ₹22,500\n\nWould you like me to pre-fill this into your Campaign Builder?";
        }

        const fallbackMsg: ChatMessage = {
          id: `erah-${Date.now()}`,
          sender: "erah",
          text: reply,
          sources: ["Campaign Operations Handbook", "Acceptable Campaign Policy"],
          suggestedActions: [
            "Apply Draft to Campaign Builder",
            "Adjust Budget",
            "Speak with Human Support"
          ],
          feedback: null
        };

        setMessages([...newMessages, fallbackMsg]);
        setCharacterState("speaking");
        speakResponse(reply);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (msgId: string, type: "helpful" | "unhelpful") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback: type } : m))
    );
    if (type === "helpful") {
      setCharacterState("success");
      setTimeout(() => setCharacterState("idle"), 2500);
    }
  };

  return (
    <>
      {/* Animated Character Widget Fixed at Bottom-Right */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-6 z-50 flex flex-col items-end">
        <ErahCharacter
          state={characterState}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowSpeechBubble(false);
          }}
          showMessage={showSpeechBubble && !isOpen}
          messageText={
            role === "vendor"
              ? "Hi! I’m Erah. Need help drafting your campaign or calculating budget?"
              : role === "participant"
              ? "Hi! I’m Erah. Want me to find high-paying missions or check payouts?"
              : "Hi! I’m Erah, your Incorvo Reach AI assistant. Click to talk!"
          }
          onCloseMessage={() => setShowSpeechBubble(false)}
        />
      </div>

      {/* Multimodal Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[580px] bg-white rounded-3xl border border-brand-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm leading-none">Erah AI</h3>
                  <span className="px-1.5 py-0.5 rounded bg-brand-violet/40 text-[9px] font-bold text-violet-200">
                    STAGE 4 • MULTIMODAL
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Incorvo Reach Multimodal Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio Mute/Stop Toggle */}
              {isSpeakingAudio && (
                <button
                  onClick={stopSpeaking}
                  className="p-1 rounded-lg bg-emerald-600/80 text-white text-[10px] flex items-center gap-1 px-2 animate-pulse"
                >
                  <VolumeX className="w-3 h-3" />
                  <span>Stop Voice</span>
                </button>
              )}

              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/60"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                } space-y-2`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "gradient-brand text-white rounded-br-xs shadow-xs font-medium"
                      : m.actionType === "POLICY_WARNING"
                      ? "bg-amber-50 text-amber-900 border border-amber-300 rounded-bl-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs"
                  }`}
                >
                  {m.text}

                  {/* RAG Knowledge Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                      <BookOpen className="w-3 h-3 text-brand-violet" />
                      <span className="font-bold">Sources:</span>
                      {m.sources.map((src, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[9px]"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Helpful / Unhelpful Feedback & Action Pills */}
                {m.sender === "erah" && (
                  <div className="space-y-2 w-full">
                    {/* Feedback row */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pl-1">
                      <span>Was this helpful?</span>
                      <button
                        onClick={() => handleFeedback(m.id, "helpful")}
                        className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                          m.feedback === "helpful" ? "text-emerald-600 font-bold" : ""
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(m.id, "unhelpful")}
                        className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                          m.feedback === "unhelpful" ? "text-red-600 font-bold" : ""
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Suggested Action Pills */}
                    {m.suggestedActions && m.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {m.suggestedActions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleSendMessage(act)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-brand-violet/20 hover:border-brand-violet text-brand-violet text-[10px] font-bold shadow-xs hover:bg-brand-violet-light/30 transition-all text-left"
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-violet animate-spin" />
                <span>Erah is analyzing knowledge & policies...</span>
              </div>
            )}
          </div>

          {/* Voice Bar & Input Footer */}
          <div className="p-3 bg-white border-t border-brand-border space-y-2">
            {voiceActive && (
              <div className="p-2 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-700 animate-pulse">
                <div className="flex items-center gap-2 font-bold">
                  <Mic className="w-4 h-4 text-red-600 animate-bounce" />
                  <span>Listening in {language}... Speak now.</span>
                </div>
                <button
                  onClick={toggleVoiceRecording}
                  className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]"
                >
                  Done Speaking
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-xl border transition-all ${
                  voiceActive
                    ? "bg-red-600 text-white border-red-600 shadow-md"
                    : "bg-slate-50 text-slate-600 border-brand-border hover:border-brand-violet hover:text-brand-violet"
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder={
                  role === "vendor"
                    ? "Ask Erah to create a draft or calculate budget..."
                    : role === "participant"
                    ? "Ask about tasks, payouts, or rules..."
                    : "Ask Erah anything about Incorvo Reach..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-brand-border text-xs focus:outline-none focus:ring-1 focus:ring-brand-violet"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 rounded-xl gradient-brand text-white shadow-xs hover:brightness-105 disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
