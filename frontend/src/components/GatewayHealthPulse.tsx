"use client";

import React from "react";
import { Lock } from "lucide-react";

export const GatewayHealthPulse: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-extrabold text-slate-200">SOVEREIGN DPI PULSE:</span>
        <span className="text-emerald-400 font-bold">ALL 6 NETWORKS OPERATIONAL</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>NPCI Instant DBT (100%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>UIDAI Face RD (&lt;50ms)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>NSDL PAN API (Live)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Bank Penny Drop (Sub-200ms)</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <Lock className="w-3 h-3" />
          <span>Presidio PII Shield Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>PWA Offline 2G Ready</span>
        </div>
      </div>
    </div>
  );
};
