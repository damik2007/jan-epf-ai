"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, ChevronDown } from "lucide-react";

interface PreFlightRejectionDiffCardProps {
  hubTitle: string;
  legacyFate: string;
  legacyDelay: string;
  sovereignSafeguard: string;
  sovereignLatency: string;
  financialImpact: string;
}

export function PreFlightRejectionDiffCard({
  hubTitle,
  legacyFate,
  legacyDelay,
  sovereignSafeguard,
  sovereignLatency,
  financialImpact
}: PreFlightRejectionDiffCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl overflow-hidden transition-all duration-300">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-sovereign-navy dark:text-white">
            Pre-Flight Rejection Prevention Diagnostic ({hubTitle})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {financialImpact}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-in fade-in duration-200">
          {/* Legacy Broken Fate */}
          <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase text-red-700 dark:text-red-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Legacy EPFO Portal Fate</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-red-600 bg-red-100 dark:bg-red-900/60 px-1.5 py-0.5 rounded">
                {legacyDelay}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {legacyFate}
            </p>
          </div>

          {/* Jan-EPF AI Sovereign Safeguard */}
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Jan-EPF AI Pre-Flight Safeguard</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                {sovereignLatency}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {sovereignSafeguard}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
