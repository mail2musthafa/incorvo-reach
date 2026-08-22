"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Check, Volume2, Mic, Bot } from "lucide-react";

export type ErahState =
  | "run"
  | "arrive"
  | "welcome"
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "success"
  | "warning"
  | "minimized";

interface ErahCharacterProps {
  state?: ErahState;
  onClick?: () => void;
  showMessage?: boolean;
  messageText?: string;
  onCloseMessage?: () => void;
}

export function ErahCharacter({
  state = "idle",
  onClick,
  showMessage = false,
  messageText = "Hi I’m Erah",
  onCloseMessage
}: ErahCharacterProps) {
  const [internalState, setInternalState] = useState<ErahState>(state);
  const [hasEntered, setHasEntered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic Eye Blinking Simulation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const enteredBefore = typeof window !== "undefined" && sessionStorage.getItem("erah_entered_v4");
    if (!enteredBefore) {
      setInternalState("run");
      const t1 = setTimeout(() => {
        setInternalState("arrive");
      }, 1000);
      const t2 = setTimeout(() => {
        setInternalState("welcome");
        sessionStorage.setItem("erah_entered_v4", "true");
        setHasEntered(true);
      }, 1800);
      const t3 = setTimeout(() => {
        setInternalState(state === "run" || state === "arrive" || state === "welcome" ? "idle" : state);
      }, 4000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setInternalState(state);
      setHasEntered(true);
    }
  }, []);

  useEffect(() => {
    if (hasEntered) {
      setInternalState(state);
    }
  }, [state, hasEntered]);

  return (
    <div className="relative select-none pointer-events-auto">
      {/* Speech Bubble: "Hi I'm Erah" */}
      {showMessage && internalState !== "minimized" && (
        <div
          onClick={onClick}
          className="absolute bottom-[210px] right-2 sm:-right-2 w-52 px-4 py-3 bg-white rounded-3xl border-2 border-brand-violet shadow-2xl text-xs cursor-pointer hover:border-brand-blue hover:scale-105 transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-300 z-50 group"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
              <span>Hi I’m</span>
              <span className="text-brand-violet font-black">Erah AI</span>
            </h4>
            {onCloseMessage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseMessage();
                }}
                className="text-slate-400 hover:text-slate-700 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-600 font-medium leading-snug">
            Your Incorvo Reach AI assistant. Tap to speak or chat!
          </p>

          {/* Curved Speech Pointer */}
          <div className="absolute -bottom-2.5 right-10 w-4 h-4 bg-white border-r-2 border-b-2 border-brand-violet transform rotate-45"></div>
        </div>
      )}

      {/* Floating Animated Mascot Wrapper */}
      <div
        onClick={onClick}
        className={`relative cursor-pointer transition-all duration-500 ease-out group animate-erah-float ${
          internalState === "run"
            ? "translate-x-32 opacity-0 animate-in slide-in-from-right-32 duration-700"
            : internalState === "arrive"
            ? "rotate-6 scale-110"
            : internalState === "welcome"
            ? "scale-105"
            : "hover:scale-105"
        }`}
      >
        {/* Glowing Aura Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-violet/25 via-brand-blue/15 to-transparent rounded-full blur-2xl -z-10 group-hover:from-brand-violet/40 transition-all"></div>

        {/* 3D-styled SVG Superhero Mascot in Incorvo Brand Violet/Blue/Cyan/Green (Zero Red) */}
        <div className="w-[145px] sm:w-[165px] h-[210px] sm:h-[235px] relative flex items-center justify-center">
          <svg
            viewBox="0 0 160 225"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-2xl"
          >
            {/* Ground Contact Shadow */}
            <ellipse cx="80" cy="216" rx="46" ry="6.5" fill="#0F172A" fillOpacity="0.25" />

            {/* Royal Indigo/Violet Flowing Superhero Cape (Zero Red) */}
            <g className="animate-erah-cape">
              <path
                d="M52 90C38 120 26 160 22 192C44 200 70 196 90 193C110 189 134 182 144 165C136 128 116 98 108 90L80 94L52 90Z"
                fill="url(#violetCapeGradient)"
              />
            </g>

            {/* Royal Violet/Indigo Superhero Boots (Zero Red) */}
            {/* Left Boot */}
            <path
              d="M54 168L50 198C50 205 52 212 60 214C70 216 74 212 72 204L68 168H54Z"
              fill="url(#violetBootGradient)"
            />
            <path d="M50 195C50 195 56 198 68 195L69 204C69 204 58 214 50 204V195Z" fill="#312E81" />
            <path d="M50 202L68 202L66 214L50 210V202Z" fill="#1E1B4B" />

            {/* Right Boot */}
            <path
              d="M92 168L96 198C96 205 94 212 86 214C76 216 72 212 74 204L78 168H92Z"
              fill="url(#violetBootGradient)"
            />
            <path d="M96 195C96 195 90 198 78 195L77 204C77 204 88 214 96 204V195Z" fill="#312E81" />
            <path d="M96 202L78 202L80 214L96 210V202Z" fill="#1E1B4B" />

            {/* Royal Blue Suit Legs */}
            <path d="M54 135L54 172H68L68 135H54Z" fill="#1D4ED8" />
            <path d="M78 135L78 172H92L92 135H78Z" fill="#1D4ED8" />

            {/* Emerald Green Pleated Superhero Skirt */}
            <path
              d="M44 116L38 142C55 147 90 147 108 142L102 116H44Z"
              fill="url(#skirtGradient)"
            />
            <path d="M56 116L52 144" stroke="#047857" strokeWidth="1.5" />
            <path d="M68 116L68 145" stroke="#047857" strokeWidth="1.5" />
            <path d="M80 116L80 145" stroke="#047857" strokeWidth="1.5" />
            <path d="M92 116L96 144" stroke="#047857" strokeWidth="1.5" />

            {/* Superhero Belt (Cyan/Blue) */}
            <rect x="46" y="112" width="54" height="6" rx="3" fill="#0284C7" />
            <circle cx="73" cy="115" r="4" fill="#38BDF8" />

            {/* Royal Blue Torso */}
            <path
              d="M48 76C48 76 56 68 73 68C90 68 98 76 98 76L102 115H44L48 76Z"
              fill="url(#blueSuitGradient)"
            />

            {/* Glowing White Infinity Butterfly Logo On Chest */}
            <g transform="translate(60, 80)">
              <path
                d="M13 14C9 14 6 11 6 7.5C6 4 9 1 13 1C17 1 20 7.5 20 7.5C20 7.5 23 1 27 1C31 1 34 4 34 7.5C34 11 31 14 27 14C23 14 20 7.5 20 7.5C20 7.5 17 14 13 14Z"
                fill="#FFFFFF"
                filter="url(#glowFilter)"
              />
              <circle cx="13" cy="7.5" r="3.5" fill="#1E40AF" />
              <circle cx="27" cy="7.5" r="3.5" fill="#1E40AF" />
            </g>

            {/* Right Arm: Pointing Enthusiastically with Royal Violet Glove */}
            <g className="animate-erah-point">
              <path d="M96 78L130 68L132 82L98 90" fill="#1E40AF" />
              {/* Violet Glove & Pointing Hand */}
              <path d="M128 66L148 58C152 56 156 60 152 64L140 76L130 84L125 74L128 66Z" fill="#6657F5" />
              <circle cx="148" cy="60" r="3.2" fill="#818CF8" />
            </g>

            {/* Left Arm: Holding Golden Star Wand with Royal Violet Glove */}
            <g className="animate-erah-wand">
              <path d="M50 78L30 92L38 104L52 90" fill="#1E40AF" />
              {/* Violet Glove */}
              <circle cx="34" cy="98" r="8" fill="#6657F5" />

              {/* Star Magic Wand */}
              <line x1="34" y1="98" x2="20" y2="125" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <path
                d="M38 88L41 95L48 95L43 100L45 107L38 103L32 107L34 100L29 95L36 95L38 88Z"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="1.2"
              />
              {/* Star Sparkle Particles */}
              <circle cx="38" cy="97" r="2.5" fill="#FEF3C7" className="animate-ping" />
              <circle cx="44" cy="90" r="1.5" fill="#FCD34D" className="animate-pulse" />
              <circle cx="32" cy="85" r="1" fill="#FCD34D" className="animate-pulse" />
            </g>

            {/* Dark Wavy Hair Framing Face */}
            <path
              d="M32 45C32 20 48 10 74 10C100 10 114 20 114 45C114 78 120 90 120 102C112 108 102 102 96 90C92 70 92 48 92 38H54C54 48 54 70 50 90C44 102 34 108 26 102C26 90 32 78 32 45Z"
              fill="#2A160A"
            />

            {/* Neck */}
            <path d="M66 56H80V70H66V56Z" fill="#FED7AA" />

            {/* Cute Face */}
            <ellipse cx="73" cy="46" rx="26" ry="24" fill="#FED7AA" />

            {/* Big Expressive Animated Eyes */}
            {isBlinking ? (
              // Blink Closed State
              <g>
                <path d="M56 42C59 44 67 44 70 42" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M76 42C79 44 87 44 90 42" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : internalState === "thinking" ? (
              <g>
                <circle cx="63" cy="42" r="6" fill="#0284C7" />
                <circle cx="83" cy="42" r="6" fill="#0284C7" />
                <circle cx="63" cy="42" r="3" fill="#FFFFFF" />
                <circle cx="83" cy="42" r="3" fill="#FFFFFF" />
              </g>
            ) : (
              <g>
                {/* Left Eye */}
                <ellipse cx="63" cy="42" rx="7" ry="8" fill="#FFFFFF" />
                <circle cx="64" cy="42" r="5" fill="#0284C7" />
                <circle cx="65" cy="42" r="3" fill="#0F172A" />
                <circle cx="62" cy="39" r="2" fill="#FFFFFF" />
                <circle cx="66" cy="44" r="0.8" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="83" cy="42" rx="7" ry="8" fill="#FFFFFF" />
                <circle cx="84" cy="42" r="5" fill="#0284C7" />
                <circle cx="85" cy="42" r="3" fill="#0F172A" />
                <circle cx="82" cy="39" r="2" fill="#FFFFFF" />
                <circle cx="86" cy="44" r="0.8" fill="#FFFFFF" />

                {/* Eyebrows */}
                <path d="M57 34C60 32 66 33 68 35M78 35C80 33 86 32 89 34" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {/* Rosy Cheeks */}
            <circle cx="56" cy="48" r="4.5" fill="#FCA5A5" fillOpacity="0.65" />
            <circle cx="90" cy="48" r="4.5" fill="#FCA5A5" fillOpacity="0.65" />

            {/* Button Nose & Warm Smile */}
            <path d="M72 46C73 47 75 47 76 46" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            {internalState === "speaking" ? (
              <path d="M67 52C67 56 71 58 74 58C77 58 81 56 81 52H67Z" fill="#F43F5E" />
            ) : (
              <path d="M67 51C69 55 77 55 80 51" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Green to Blue Gradient Aviator Helmet */}
            <path
              d="M44 38C44 14 54 4 74 4C94 4 104 14 104 38C104 42 102 44 98 42C92 28 84 20 74 20C64 20 56 28 50 42C46 44 44 42 44 38Z"
              fill="url(#helmetGradient)"
            />

            {/* Left Green Helmet Ear Cushion */}
            <ellipse cx="44" cy="40" rx="8.5" ry="12.5" fill="#10B981" stroke="#059669" strokeWidth="2" />
            <circle cx="44" cy="40" r="4" fill="#34D399" />

            {/* Right Blue Helmet Ear Cushion */}
            <ellipse cx="104" cy="40" rx="8.5" ry="12.5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
            <circle cx="104" cy="40" r="4" fill="#60A5FA" />

            {/* Gradients & Filters */}
            <defs>
              <linearGradient id="helmetGradient" x1="44" y1="4" x2="104" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" />
                <stop offset="0.5" stopColor="#06B6D4" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>

              <linearGradient id="blueSuitGradient" x1="48" y1="68" x2="102" y2="115" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#1E40AF" />
              </linearGradient>

              <linearGradient id="skirtGradient" x1="44" y1="116" x2="102" y2="145" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>

              <linearGradient id="violetCapeGradient" x1="52" y1="90" x2="142" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6657F5" />
                <stop offset="1" stopColor="#312E81" />
              </linearGradient>

              <linearGradient id="violetBootGradient" x1="50" y1="168" x2="72" y2="214" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6657F5" />
                <stop offset="1" stopColor="#3730A3" />
              </linearGradient>

              <filter id="glowFilter" x="-10" y="-10" width="60" height="40" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>

          {/* Floating Tag: "Erah AI" */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900/95 text-white border border-brand-violet text-[9px] font-black shadow-xl flex items-center gap-1 whitespace-nowrap">
            {internalState === "listening" ? (
              <>
                <Mic className="w-2.5 h-2.5 text-brand-violet animate-pulse" />
                <span className="text-violet-300">Listening...</span>
              </>
            ) : internalState === "thinking" ? (
              <>
                <Sparkles className="w-2.5 h-2.5 text-brand-violet animate-spin" />
                <span className="text-violet-300">Thinking...</span>
              </>
            ) : internalState === "speaking" ? (
              <>
                <Volume2 className="w-2.5 h-2.5 text-emerald-400 animate-bounce" />
                <span className="text-emerald-300">Speaking...</span>
              </>
            ) : internalState === "success" ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-emerald-300">Success</span>
              </>
            ) : (
              <>
                <Sparkles className="w-2.5 h-2.5 text-brand-violet" />
                <span>Erah AI</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
