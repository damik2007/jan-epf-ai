"use client";

import React, { useState, memo } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, ChevronDown } from "lucide-react";

export interface PreFlightRejectionDiffCardProps {
  hubTitle: string;
  legacyFate: string;
  legacyDelay: string;
  janEpfAdvantage?: string;
  statutoryRule?: string;
  sovereignSafeguard?: string;
  sovereignLatency?: string;
  financialImpact: string;
}

export const PreFlightRejectionDiffCard = memo(function PreFlightRejectionDiffCard({
  hubTitle,
  legacyFate,
  legacyDelay,
  janEpfAdvantage,
  statutoryRule,
  sovereignSafeguard,
  sovereignLatency,
  financialImpact
}: PreFlightRejectionDiffCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = `diff-content-${hubTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const safeguardText = janEpfAdvantage || sovereignSafeguard || "Deterministic in-browser self-healing active.";
  const latencyBadge = statutoryRule || sovereignLatency || "0.04ms Self-Healed";

  return (
    <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="w-full text-left px-4 py-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron/70"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" aria-hidden="true" />
          <span className="text-xs font-bold text-sovereign-navy dark:text-white">
            Pre-Flight Rejection Prevention Diagnostic ({hubTitle})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {financialImpact}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </div>
      </button>

      {isExpanded && (
        <div id={contentId} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-in fade-in duration-200">
          {/* Legacy Broken Fate */}
          <div className="p-3.5 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 space-y-2">
            <div className="flex items-center justify-between text-red-700 dark:text-red-400 font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Legacy Portal Rejection
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300">
                {legacyDelay}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {legacyFate}
            </p>
          </div>

          {/* Jan-EPF AI Advantage */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Jan-EPF AI Self-Healing
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                {latencyBadge}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {safeguardText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
