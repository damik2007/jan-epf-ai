"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Zap,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
  Minimize2,
  Maximize2
} from "lucide-react";

interface SpeedRunStep {
  step: number;
  title: string;
  desc: string;
  route: string;
  personaUan: string;
  highlightAction: string;
}

const SPEED_RUN_STEPS: SpeedRunStep[] = [
  {
    step: 1,
    title: "1. Pre-Flight Claim Readiness Score",
    desc: "Verify Ramesh Kumar's Aadhaar & Bank KYC with 98% instant approval probability.",
    route: "/",
    personaUan: "100982348712",
    highlightAction: "Examines 5 KYC pre-flight checks before filing."
  },
  {
    step: 2,
    title: "2. Form 31 Advance & Cheque Blur OCR",
    desc: "Test Laplacian pixel edge sharpness on bank cheque + 1-click ₹1.56L Medical advance.",
    route: "/money",
    personaUan: "100982348712",
    highlightAction: "Sub-5ms Canvas OCR eliminates 30%+ cheque blur rejections."
  },
  {
    step: 3,
    title: "3. Auto-Deduce Missing Date of Exit",
    desc: "Switch to Priya Sharma: Auto-recover missing exit date ('2023-08-31') from ECR timestamps.",
    route: "/career",
    personaUan: "101294817203",
    highlightAction: "Recovers trapped ₹1.85L with Section 192A TDS Tax Shield."
  },
  {
    step: 4,
    title: "4. 8.25% Compounding & ₹7L EDLI Insurance",
    desc: "Forecasting retirement wealth curve and verified zero-cost statutory life insurance.",
    route: "/savings",
    personaUan: "101889977665",
    highlightAction: "Visual passbook triple-split with month-by-month compounding."
  }
];

export function SpeedRunTour() {
  const router = useRouter();
  const pathname = usePathname();
  const { switchCitizen } = useCitizen();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const currentStep = SPEED_RUN_STEPS[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = (prev + 1) % SPEED_RUN_STEPS.length;
          const nextStep = SPEED_RUN_STEPS[next];
          switchCitizen(nextStep.personaUan);
          router.push(nextStep.route);
          return next;
        });
      }, 10000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, switchCitizen, router]);

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
    const step = SPEED_RUN_STEPS[index];
    switchCitizen(step.personaUan);
    router.push(step.route);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl transition-all duration-300">
      <div className="bg-sovereign-darkest/95 text-white border border-saffron/40 shadow-2xl rounded-2xl p-3 sm:p-4 backdrop-blur-lg">
        {isMinimized ? (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2 text-xs font-bold text-saffron hover:text-amber-300 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ 60s Evaluator Speed-Run ({currentStep.step}/4)</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 text-slate-400 hover:text-white"
                title="Expand Speed-Run Dock"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 text-slate-400 hover:text-white"
                title="Close Speed-Run Dock"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-saffron text-sovereign-darkest flex items-center justify-center text-xs font-black shadow">
                  ⚡
                </span>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>Judge 60-Second Speed Run</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-saffron/20 text-saffron border border-saffron/40">
                      Step {currentStep.step} of 4
                    </span>
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                    isPlaying
                      ? "bg-amber-500 text-slate-950 animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-slate-300"
                  }`}
                  title={isPlaying ? "Pause Auto-Tour" : "Auto-Play 60s Tour"}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlaying ? "Auto-Playing" : "Auto-Play"}</span>
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
                  title="Minimize Dock"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
                  title="Close Dock"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Current Step Details */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-300">
                {currentStep.title}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {currentStep.desc}
              </p>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>{currentStep.highlightAction}</span>
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex justify-between items-center pt-1 border-t border-white/10">
              <div className="flex gap-1">
                {SPEED_RUN_STEPS.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => goToStep(idx)}
                    className={`w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                      currentStepIndex === idx
                        ? "bg-saffron text-sovereign-darkest font-extrabold ring-2 ring-saffron/40"
                        : "bg-white/10 text-slate-400 hover:bg-white/20"
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => goToStep(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => goToStep((currentStepIndex + 1) % SPEED_RUN_STEPS.length)}
                  className="px-3 py-1 rounded bg-saffron hover:bg-amber-400 text-sovereign-darkest text-[11px] font-extrabold flex items-center gap-1 transition-all shadow"
                >
                  <span>{currentStepIndex === SPEED_RUN_STEPS.length - 1 ? "Restart Tour" : "Next Scenario"}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
