"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCitizen } from "@/context/CitizenContext";
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  Shield,
  Coins,
  Building2,
  HeartHandshake,
  Zap
} from "lucide-react";

export function EvaluatorTourModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStop, setCurrentStop] = useState<number>(0);
  const { switchCitizen } = useCitizen();

  const tourStops = [
    {
      step: 1,
      title: "The Citizen-Centric Revolution: 4 Life-Event Hubs",
      badge: "Citizen Perspective",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      persona: "Ramesh Kumar (Factory Operator)",
      uan: "100982348712",
      headline: "Replacing 18 Cryptic Forms with 4 Human Life Events",
      explanation:
        "Everyday Indian workers don't know what Form 31, Form 19, or Form 10C mean. Jan-EPF AI organizes social security around natural life intents: Need Money, Changed Jobs, My Savings, and Fix Details.",
      proof: "80% of routine claims are processed on-device (<5ms) for zero API cost.",
      route: "/money",
      cta: "Test Instant Emergency Advance",
      icon: Coins
    },
    {
      step: 2,
      title: "Eliminating Rejections at Source: Canvas OCR & Fuzzy Match",
      badge: "Zero-Rejection Engine",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      persona: "Priya Sharma (Tech Professional)",
      uan: "101294817203",
      headline: "Pre-Flight Verification with Levenshtein ≥85% & In-Browser OCR",
      explanation:
        "EPFO rejects 35-48% of claims after a 20-day wait due to single-letter name typos or blurry cheques. Jan-EPF AI inspects cheque leaves in 2 seconds client-side and guarantees a 99% approval probability.",
      proof: "Canvas Cheque OCR runs entirely in the browser using HTML5 Canvas pixel analysis.",
      route: "/money",
      cta: "Run Pre-Flight Health Check",
      icon: Shield
    },
    {
      step: 3,
      title: "1-Click Multi-Job Consolidation & Missing Date of Exit (DOE)",
      badge: "Form 13 Auto-Merge",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      persona: "Priya Sharma (Job Switcher)",
      uan: "101294817203",
      headline: "Auto-Deducing Exit Dates from ECR Wage Timestamps",
      explanation:
        "When an employee switches companies and the old employer fails to mark the exit date, funds are locked for months. Jan-EPF AI auto-deduces the exit date from the last ECR wage deposit and merges accounts in 1 tap.",
      proof: "Consolidates ₹1,85,000 across multiple Member IDs into a single unified ledger.",
      route: "/career",
      cta: "Merge Past Accounts in 1 Click",
      icon: Building2
    },
    {
      step: 4,
      title: "WCAG AAA Elder Accessibility & Voice-Guided Life Certificate",
      badge: "Senior EPS-95 Mode",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      persona: "Gurmeet Singh (Retired Pensioner, Age 66)",
      uan: "100112233445",
      headline: "Empathetic Design for 7.8 Million Elderly Pensioners",
      explanation:
        "Senior citizens face severe hurdles with captchas, tiny fonts, and November biometric failures. Senior Mode provides 125% scaling, 56px touch ergonomics, Obsidian Navy/Gold contrast, and spoken camera guidance.",
      proof: "Spoken ambient lighting and blink-detect prompts eliminate physical bank queues.",
      route: "/savings",
      cta: "Experience Voice Senior Mode",
      icon: HeartHandshake
    }
  ];

  const current = tourStops[currentStop];
  const Icon = current.icon;

  const handleLaunchStop = (uan: string) => {
    switchCitizen(uan);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105 border border-amber-400"
        title="Quick 60-Second Guided Tour for Hackathon Judges"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>⚡ Judges 60s Tour</span>
      </button>

      {/* Guided Tour Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 space-y-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sovereign-navy text-white text-[10px] font-bold">
                  <Zap className="w-3 h-3 text-saffron" />
                  <span>EVALUATOR & CITIZEN PERSPECTIVE TOUR • STOP {current.step} OF 4</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-sovereign-navy dark:text-white">
                  {current.title}
                </h2>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tour Step Body */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sovereign-navy text-white flex items-center justify-center shadow-md shrink-0">
                  <Icon className="w-6 h-6 text-saffron" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {current.headline}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Simulated Persona:</span>
                    <strong className="text-[11px] text-slate-800 dark:text-slate-200 font-bold">{current.persona}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <p>{current.explanation}</p>
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Proof Metric: {current.proof}</span>
                </div>
              </div>
            </div>

            {/* Navigation & 1-Click Launch */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                {tourStops.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStop(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentStop === idx ? "w-6 bg-sovereign-navy" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={current.route}
                  onClick={() => handleLaunchStop(current.uan)}
                  className="flex-1 sm:flex-none py-2.5 px-4 bg-sovereign-navy hover:bg-sovereign-light text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>{current.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                </Link>

                {currentStop < tourStops.length - 1 ? (
                  <button
                    onClick={() => setCurrentStop(currentStop + 1)}
                    className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-sm"
                  >
                    Next Stop →
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    Done ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
