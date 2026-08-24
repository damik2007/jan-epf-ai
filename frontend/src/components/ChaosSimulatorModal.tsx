"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  FileX,
  CreditCard,
  Camera,
  X,
  ArrowRight
} from "lucide-react";

interface ChaosSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChaosSimulatorModal({ isOpen, onClose }: ChaosSimulatorModalProps) {
  // 5 Chaos Toggles
  const [nameTypo, setNameTypo] = useState(true);
  const [missingDoe, setMissingDoe] = useState(true);
  const [mergedIfsc, setMergedIfsc] = useState(true);
  const [tdsTrap, setTdsTrap] = useState(true);
  const [blurryCheque, setBlurryCheque] = useState(false);

  // Stats calculation
  const activeFrictionCount = [nameTypo, missingDoe, mergedIfsc, tdsTrap, blurryCheque].filter(Boolean).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white border border-white/20 dark:border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sovereign-darkest via-sovereign-navy to-slate-900 text-white p-6 border-b border-slate-800 flex justify-between items-center relative">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-saffron text-sovereign-darkest text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Chaos Sandbox
              </span>
              <span className="text-xs text-slate-400 font-mono">
                80/20 Sovereign Engine Testbed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 text-white">
              Zero-Rejection Claim Stress-Test Simulator
            </h2>
            <p className="text-xs text-slate-300">
              Intentionally trigger India's top 5 claim rejection traps and watch Jan-EPF AI auto-heal them in real-time.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Chaos Trigger Control Bar */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Select Claim Failure Traps ({activeFrictionCount} Active)
              </h3>
              <button
                onClick={() => {
                  setNameTypo(true);
                  setMissingDoe(true);
                  setMergedIfsc(true);
                  setTdsTrap(true);
                  setBlurryCheque(true);
                }}
                className="text-xs text-saffron hover:underline font-bold"
              >
                Trigger All 5 Traps
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Toggle 1: Name Typo */}
              <button
                onClick={() => setNameTypo(!nameTypo)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  nameTypo
                    ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-60"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${nameTypo ? "bg-red-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  <FileX className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Aadhaar Name Typo</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${nameTypo ? "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200" : "bg-slate-200 text-slate-600"}`}>
                      {nameTypo ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    &ldquo;Ramesh Kumar&rdquo; vs &ldquo;Ramesh Kumaar&rdquo;
                  </p>
                </div>
              </button>

              {/* Toggle 2: Missing DOE */}
              <button
                onClick={() => setMissingDoe(!missingDoe)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  missingDoe
                    ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-60"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${missingDoe ? "bg-red-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Missing Exit Date</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${missingDoe ? "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200" : "bg-slate-200 text-slate-600"}`}>
                      {missingDoe ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Employer left Date of Exit blank
                  </p>
                </div>
              </button>

              {/* Toggle 3: Merged Bank IFSC */}
              <button
                onClick={() => setMergedIfsc(!mergedIfsc)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  mergedIfsc
                    ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-60"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${mergedIfsc ? "bg-red-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Obsolete Merged IFSC</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${mergedIfsc ? "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200" : "bg-slate-200 text-slate-600"}`}>
                      {mergedIfsc ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    `ALLA0210001` (Old Allahabad Bank)
                  </p>
                </div>
              </button>

              {/* Toggle 4: Section 192A TDS Trap */}
              <button
                onClick={() => setTdsTrap(!tdsTrap)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  tdsTrap
                    ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-60"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${tdsTrap ? "bg-red-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Section 192A TDS Penalty</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${tdsTrap ? "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200" : "bg-slate-200 text-slate-600"}`}>
                      {tdsTrap ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    ₹1,20,000 withdrawal &lt; 5 yrs service
                  </p>
                </div>
              </button>

              {/* Toggle 5: Blurry Cheque Photo */}
              <button
                onClick={() => setBlurryCheque(!blurryCheque)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  blurryCheque
                    ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-60"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${blurryCheque ? "bg-red-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Low-Contrast Cheque</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${blurryCheque ? "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200" : "bg-slate-200 text-slate-600"}`}>
                      {blurryCheque ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Sharpness score 28% (Threshold: 40%)
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              2. Real-Time Pipeline Execution Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Legacy Portal */}
              <div className="p-5 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/60 space-y-4">
                <div className="flex justify-between items-center border-b border-red-200 dark:border-red-900 pb-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-black text-red-950 dark:text-red-200">
                      Legacy EPFO Member Portal
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                    OUTCOME: REJECTED
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {nameTypo && (
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Error 402 (Name Mismatch):</strong> Claim rejected. Citizen asked to file physical Joint Declaration signed by employer.
                      </div>
                    </div>
                  )}

                  {missingDoe && (
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Error 404 (Date of Exit Blank):</strong> Form 13 transfer locked indefinitely until ex-employer visits regional PF office.
                      </div>
                    </div>
                  )}

                  {mergedIfsc && (
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>DBT Transfer Failure:</strong> Outdated IFSC code `ALLA0210001` rejected by RBI clearing house after 21 days.
                      </div>
                    </div>
                  )}

                  {tdsTrap && (
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Unlawful 20% TDS Deduction:</strong> ₹24,000 forcibly deducted under Section 192A due to missing Form 15G.
                      </div>
                    </div>
                  )}

                  {blurryCheque && (
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Error 409 (Cheque Unreadable):</strong> Claim rejected by field clerk after 30 days of silent queue waiting.
                      </div>
                    </div>
                  )}

                  {!activeFrictionCount && (
                    <p className="text-slate-500 italic py-4 text-center">
                      No errors selected. Toggle friction traps above to simulate legacy rejection.
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-red-100/80 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 font-medium">
                  ⏳ <strong>Average Citizen Delay:</strong> 35 to 45 Days • 💸 <strong>Loss:</strong> ₹24,000 TDS Penalty
                </div>
              </div>

              {/* Right Column: Jan-EPF AI */}
              <div className="p-5 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-800 space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-200 dark:border-emerald-900 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                      Jan-EPF AI Sovereign Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded">
                    100% AUTO-HEALED (0.02ms)
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {nameTypo && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Levenshtein Token Distance:</strong> 93.3% fuzzy similarity detected. Auto-accepted as genuine spelling variance without paper filing.
                      </div>
                    </div>
                  )}

                  {missingDoe && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>ECR Timestamp Deducer:</strong> Missing Date of Exit deduced as `31-Aug-2023` from final salary deduction. 1-Click merge unlocked.
                      </div>
                    </div>
                  )}

                  {mergedIfsc && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>RBI Merger Auto-Resolver:</strong> `ALLA0210001` auto-mapped to Indian Bank `IDIB000A210`. NPCI Penny Drop passed in 30ms.
                      </div>
                    </div>
                  )}

                  {tdsTrap && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Section 192A TDS Shield:</strong> 1-Click Form 15G auto-attached, saving the worker ₹24,000 in unlawful tax deductions.
                      </div>
                    </div>
                  )}

                  {blurryCheque && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Canvas Edge Pre-Flight Shield:</strong> Real-time guidance prevents submission of blurred images before they can be rejected.
                      </div>
                    </div>
                  )}

                  {!activeFrictionCount && (
                    <p className="text-emerald-700 dark:text-emerald-300 italic py-4 text-center">
                      Engine ready. Toggle friction triggers above to observe sub-millisecond self-healing.
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                  ⚡ <strong>Disbursement Time:</strong> Sub-24 Hours • 🛡️ <strong>Rejection Probability:</strong> 0.0%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Powered by 80/20 Sovereign Core & Deterministic Mathematics
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sovereign-navy dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity shadow-lg"
          >
            Close Stress-Test Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
