"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";

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
    <div className="w-full rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy text-white shadow-2xl overflow-hidden transition-all relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex justify-between items-center cursor-pointer select-none relative z-10 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
            <span>Pre-Flight Rejection Prevention Diagnostic</span>
            <span className="text-slate-400 font-mono text-xs">({hubTitle})</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700">
            {financialImpact}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200 relative z-10">
          {/* Legacy Broken Fate */}
          <div className="p-4 rounded-2xl border border-rose-900/60 bg-rose-950/30 space-y-2 relative overflow-hidden group">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-black uppercase text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Legacy EPFO Portal Fate</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                {legacyDelay}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {legacyFate}
            </p>
          </div>

          {/* Jan-EPF AI Sovereign Safeguard */}
          <div className="p-4 rounded-2xl border border-emerald-800/60 bg-emerald-950/30 space-y-2 relative overflow-hidden group">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Jan-EPF AI Pre-Flight Safeguard</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {sovereignLatency}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {sovereignSafeguard}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
