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
  X,
  Bot,
  ShieldCheck
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
    personaUan: "101294817203",
    route: "/career",
    headline: "Unlocks ₹2.60 Lakh Trapped in Prior Job",
    description: "Previous employer never marked Date of Exit. Jan-EPF AI derives it from the last monthly wage deposit in ECR challan records, bypassing unresponsive HR.",
    metric: "21 Days ➔ 1 Click"
  },
  {
    step: 3,
    title: "⚡ Sovereign AI Agent (6-Layer Harness)",
    badge: "80/20 Hybrid LLM",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    personaName: "Priya Sharma",
    personaUan: "101294817203",
    route: "/copilot",
    headline: "Real AI + Deterministic Math Hybrid Workstation",
    description: "80% queries resolved by in-browser deterministic math at 0ms/₹0. 20% routed to Azure-hosted LLM via Vercel AI Gateway. 6-layer harness: Context ➔ Tools ➔ Orchestration ➔ Memory ➔ Guardrails ➔ Evals.",
    metric: "99.4% Autonomous • 0% Hallucination"
  },
  {
    step: 4,
    title: "Triple-Split Passbook & Compounding",
    badge: "8.25% FY Growth",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    personaName: "Gurmeet Singh",
    personaUan: "100112233445",
    route: "/savings",
    headline: "Triple-Split Visualization & Pension PPO",
    description: "Splits corpus into Employee (12%), Employer (3.67%), and EPS-95 (8.33%). 30-year simulator forecasts compounding wealth with monthly EPS-95 pension tracking.",
    metric: "₹3,250/mo Pension Tracking"
  },
  {
    step: 5,
    title: "NPCI Penny Drop & Wagner-Fischer",
    badge: "Sub-200ms Bank KYC",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    personaName: "Sunita Devi",
    personaUan: "101889977665",
    route: "/fix",
    headline: "Fuzzy Name Auto-Resolution (>85% Match)",
    description: "NPCI penny drop validates account holder names instantly. Wagner-Fischer Levenshtein distance reconciles minor spelling discrepancies without employer paperwork.",
    metric: "Free ₹7 Lakh EDLI Nominee"
  },
  {
    step: 6,
    title: "🏛️ Edge Security & DPDP Compliance",
    badge: "Vercel Edge Proxy",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    personaName: "Ramesh Kumar",
    personaUan: "100982348712",
    route: "/architecture",
    headline: "Sovereign Mumbai (bom1) Edge with DPDP Act 2023",
    description: "Edge Proxy runs at Vercel's Mumbai PoP before CDN cache. Blocks exploit probes in 0ms. Injects DPDP compliance headers, request tracing IDs, and SRE circuit breakers with zero-fallback guarantees.",
    metric: "2ms Edge Execution • Grade S+ Security"
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
    if (step.route === "/copilot") {
      router.push("/");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-sovereign-agent"));
      }, 300);
    } else {
      router.push(step.route);
    }
  }, [switchCitizen, router]);

  // Auto-play timer (10s per step for 6 steps = 60s speed run)
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
      className="fixed bottom-4 left-4 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] sm:w-auto animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl bg-slate-900/95 border border-saffron/40 shadow-2xl backdrop-blur-xl text-white overflow-hidden ring-1 ring-white/10">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-saffron/20 via-amber-500/10 to-transparent border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron" />
            </span>
            <span className="font-bold text-saffron uppercase font-mono tracking-wider text-[10px]">
              Judges 60-Sec Speed Run
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({currentStep.step}/{SPEED_RUN_STEPS.length})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1 rounded-lg text-[10px] font-bold font-mono px-2 flex items-center gap-1 transition-all ${
                isPlaying
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-white/10 hover:bg-white/20 text-slate-300"
              }`}
              title={isPlaying ? "Pause 60-Sec Auto Tour" : "Auto-Play 60-Sec Tour"}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play (60s)"}</span>
            </button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body (Collapsible) */}
        {!isMinimized && (
          <div className="p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-white truncate text-xs sm:text-sm">
                  {currentStep.title}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border shrink-0 ${currentStep.badgeColor}`}>
                {currentStep.badge}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              {currentStep.description}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] font-mono">
              <span className="text-emerald-400 font-bold">
                ✓ {currentStep.metric}
              </span>
              <span className="text-slate-400">
                Persona: <strong className="text-white">{currentStep.personaName}</strong>
              </span>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1">
                {SPEED_RUN_STEPS.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => goToStep(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? "w-6 bg-saffron"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    title={`Step ${s.step}: ${s.title}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => goToStep(currentStepIndex - 1)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToStep((currentStepIndex + 1) % SPEED_RUN_STEPS.length)}
                  className="p-1 rounded-lg bg-saffron text-slate-950 font-bold hover:bg-amber-400 shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
