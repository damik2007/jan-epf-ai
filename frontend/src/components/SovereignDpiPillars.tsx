"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Calculator,
  HeartHandshake,
  Globe2,
  Lock,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { ExplainRupeeModal } from "@/components/ExplainRupeeModal";

export const SovereignDpiPillars: React.FC = () => {
  const [explainModalOpen, setExplainModalOpen] = useState<boolean>(false);
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      id: 1,
      title: "Institutional UI Architecture",
      icon: ShieldCheck,
      badge: "Sovereign Trust",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
      headline: "Tabular Precision & Zero Visual Jitter",
      points: [
        "Fixed-width tabular numerals eliminate layout shifts during real-time compounding calculations.",
        "Deep navy palette with high-contrast accessibility across both light and dark modes.",
        "Calm, purposeful visual hierarchy engineered to reduce anxiety during claim submissions."
      ]
    },
    {
      id: 2,
      title: "Sub-50ms On-Device Engine",
      icon: Zap,
      badge: "80/20 Client Core",
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
      headline: "Deterministic Instant Calculations",
      points: [
        "100% optimistic local execution: Routine calculations (Para 68J, TDS, Levenshtein match) run on-device in <1ms.",
        "Skeleton shimmers preserve viewport layout with Zero Cumulative Layout Shift (CLS = 0).",
        "Offline-tolerant form state in local storage ensures zero progress loss during network interruptions."
      ]
    },
    {
      id: 3,
      title: "100% Financial Lineage",
      icon: Calculator,
      badge: "Mathematical Proof",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      headline: "Every Rupee Fully Reconciled",
      action: () => setExplainModalOpen(true),
      actionLabel: "Inspect Live Mathematical Proof",
      points: [
        "Transparent triple-split derivation: Employee Share (12%), Employer Share (3.67%), and EPS Pension (8.33%).",
        "Explicit 8.25% annual compounding monthly running balance audit ledger.",
        "Tamper-evident cryptographic ledger state with SHA-256 audit trail tokens."
      ]
    },
    {
      id: 4,
      title: "Defensive Reassurance UX",
      icon: HeartHandshake,
      badge: "5-Second Grace",
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
      headline: "Human Language & Accidental Error Safeguards",
      points: [
        "Live Gateway Health Pulses show real-time operational status for NPCI, UIDAI, and NSDL.",
        "Empathetic human language replaces cryptic database error codes.",
        "5-Second interactive undo grace period buffer on fund withdrawals to prevent accidental claims."
      ]
    },
    {
      id: 5,
      title: "Universal Multi-Modal Reach",
      icon: Globe2,
      badge: "Inclusive DPI",
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
      headline: "Desktop to Sub-50KB 2G Mobile",
      points: [
        "Elder Comfort Senior Mode: 150% font scaling, 56px touch ergonomics, and high-contrast palette.",
        "Edge-TTS Neural Voice streaming across 10 Indian regional languages with zero API token cost.",
        "Lightweight bundles optimized for budget mobile devices over rural 2G/3G connections."
      ]
    },
    {
      id: 6,
      title: "Zero-Trust Security Core",
      icon: Lock,
      badge: "DPDP & Presidio",
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800",
      headline: "On-Device PII Masking & Self-Healing Matrix",
      points: [
        "Client-side Presidio PII tokenization masks 100% of Aadhaar and PAN before telemetry logging.",
        "Substitute Employee Resilience Matrix: 6 hot-swappable fallback circuits ensuring 100% uptime.",
        "PostgreSQL Row-Level Security (RLS) policies enforcing multi-tenant boundary isolation."
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-sovereign-navy dark:text-white tracking-tight">
              Core Architectural Engineering Pillars
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Engineered for ₹21+ Lakh Crore in retirement assets across 70+ Million Indian workers with zero downtime and sub-second verification.
          </p>
        </div>
      </div>

      {/* Grid of 6 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          const isSelected = activePillar === idx;
          return (
            <div
              key={p.id}
              onClick={() => setActivePillar(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer card-hover-lift flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/20 dark:bg-slate-800"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-850"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl border ${p.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {p.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-sovereign-navy dark:text-white">
                    {p.id}. {p.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {p.headline}
                  </div>
                </div>

                <ul className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  {p.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                      <span className="leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {p.action && (
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      p.action!();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>{p.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Explain Rupee Interactive Modal */}
      <ExplainRupeeModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
      />
    </div>
  );
};
