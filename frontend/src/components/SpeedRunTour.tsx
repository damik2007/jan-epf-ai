"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Minimize2,
  Maximize2,
  X
} from "lucide-react";

interface SpeedRunStep {
  step: number;
  title: string;
  badge: string;
  badgeColor: string;
  personaName: string;
  personaUan: string;
  route: string;
  headline: string;
  description: string;
  metric: string;
}

const SPEED_RUN_STEPS: SpeedRunStep[] = [
  {
    step: 1,
    title: "1-Click Medical Advance (Para 68J)",
    badge: "0% TDS Shield",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    personaName: "Ramesh Kumar",
    personaUan: "100982348712",
    route: "/money",
    headline: "Pre-Flight Mathematical Sanction in 0.0005ms",
    description: "Para 68J auto-calculates 6 months basic limit (₹1.56L), auto-attaches Form 15G under Section 192A for zero tax deduction, and verifies cheque clarity client-side.",
    metric: "0% Rejection • Instant Disbursal"
  },
  {
    step: 2,
    title: "Autonomous Job Transfer (Form 13)",
    badge: "ECR Exit Auto-Deduction",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    personaName: "Priya Sharma",
    personaUan: "101234567890",
    route: "/career",
    headline: "Unlocks ₹2.60 Lakh Trapped in Prior Job",
    description: "Previous employer never marked Date of Exit. Jan-EPF AI derives it from the last monthly wage deposit in ECR challan records, bypassing unresponsive HR.",
    metric: "21 Days ➔ 1 Click"
  },
  {
    step: 3,
    title: "Triple-Split Passbook & Compounding",
    badge: "8.25% FY Growth",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    personaName: "Gurmeet Singh",
    personaUan: "100456789012",
    route: "/savings",
    headline: "Triple-Split Visualization & Pension PPO",
    description: "Splits corpus into Employee (12%), Employer (3.67%), and EPS-95 (8.33%). 30-year simulator forecasts compounding wealth with monthly EPS-95 pension tracking.",
    metric: "₹3,250/mo Pension Tracking"
  },
  {
    step: 4,
    title: "NPCI Penny Drop & Wagner-Fischer",
    badge: "Sub-200ms Bank KYC",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    personaName: "Sunita Devi",
    personaUan: "100789012345",
    route: "/fix",
    headline: "Fuzzy Name Auto-Resolution (>85% Match)",
    description: "NPCI penny drop validates account holder names instantly. Wagner-Fischer Levenshtein distance reconciles minor spelling discrepancies without employer paperwork.",
    metric: "Free ₹7 Lakh EDLI Nominee"
  }
];

export function SpeedRunTour() {
  const router = useRouter();
  const { switchCitizen } = useCitizen();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const stepIndexRef = useRef(currentStepIndex);
  stepIndexRef.current = currentStepIndex;

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(index);
    const step = SPEED_RUN_STEPS[index];
    switchCitizen(step.personaUan);
    router.push(step.route);
  }, [switchCitizen, router]);

  // Auto-play timer (10s per step) with pure state updates (Rule: rerender-functional-setstate)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        const next = (stepIndexRef.current + 1) % SPEED_RUN_STEPS.length;
        goToStep(next);
      }, 10000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, goToStep]);

  const currentStep = SPEED_RUN_STEPS[currentStepIndex];

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Judges 60-Second Speed Run Tour"
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-[95%] max-w-xl transition-all duration-300"
    >
      <div className="backdrop-blur-xl bg-gradient-to-r from-slate-950/95 via-sovereign-darkest/95 to-slate-900/95 text-white border border-saffron/40 shadow-2xl rounded-2xl p-3 sm:p-4 ring-1 ring-white/10">
        {/* Top Mini Header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-saffron font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Judges Speed-Run ({currentStepIndex + 1}/4)
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              • {currentStep.personaName}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-pressed={isPlaying}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
                isPlaying
                  ? "bg-amber-500 text-slate-950 shadow-md animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-slate-200"
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? "Pause (10s)" : "Auto Tour"}</span>
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close Dock"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body (Collapsible) */}
        {!isMinimized && (
          <div className="space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm">{currentStep.title}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${currentStep.badgeColor}`}>
                  {currentStep.badge}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">{currentStep.metric}</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 sm:line-clamp-none">
              {currentStep.description}
            </p>

            {/* Stepper Buttons & Nav */}
            <div className="flex items-center justify-between pt-1 gap-2 border-t border-white/10">
              <div className="flex gap-1.5">
                {SPEED_RUN_STEPS.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => goToStep(idx)}
                    aria-label={`Step ${s.step}: ${s.title}`}
                    aria-current={currentStepIndex === idx ? "step" : undefined}
                    className={`w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                      currentStepIndex === idx
                        ? "bg-saffron text-slate-950 ring-2 ring-saffron/40 font-black scale-110"
                        : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => goToStep((currentStepIndex - 1 + SPEED_RUN_STEPS.length) % SPEED_RUN_STEPS.length)}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] font-bold flex items-center gap-0.5"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </button>
                <button
                  onClick={() => goToStep((currentStepIndex + 1) % SPEED_RUN_STEPS.length)}
                  className="px-2.5 py-1 rounded-lg bg-saffron hover:bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-0.5 shadow-sm"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
