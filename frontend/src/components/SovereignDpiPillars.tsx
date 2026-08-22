"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Calculator,
  HeartHandshake,
  Globe2,
  Lock,
  ChevronRight,
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
      title: "Quiet Sovereign Elegance",
      icon: ShieldCheck,
      badge: "Deep Institutional Trust",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
      headline: "Deep Obsidian Navy & Tabular Numerals",
      points: [
        "Fixed-width tabular numerals (`tabular-nums`) eliminate visual jitter during real-time interest compounding.",
        "Obsidian sovereign palette (`#060D17` / `#0B132B`) with warm amber gold highlights.",
        "Whitespace engineered for psychological reassurance during high-stress medical claims."
      ]
    },
    {
      id: 2,
      title: "Sub-50ms Tactile Physics",
      icon: Zap,
      badge: "<16ms Optimistic UI",
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
      headline: "Zero Full-Screen Blocking Spinners",
      points: [
        "100% optimistic local rendering: User actions complete in 1 frame (<16ms) on-device.",
        "Local skeleton shimmers preserve viewport hierarchy with Zero Cumulative Layout Shift (CLS = 0).",
        "Deterministic local rule engine computes Form 31 Para 68J limits without network roundtrips."
      ]
    },
    {
      id: 3,
      title: "100% Financial Lineage",
      icon: Calculator,
      badge: "Explain Every Rupee",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      headline: "Every Rupee has a Mathematical Proof",
      action: () => setExplainModalOpen(true),
      actionLabel: "Open Live Mathematical Derivation",
      points: [
        "1-Click transparent drill-down for Employee Share (12%), Employer Share (3.67%), and EPS (8.33%).",
        "Explicit 8.25% annual compounding monthly running balance calculation log.",
        "Cryptographically signed ledger state with SHA-256 non-repudiation audit hash."
      ]
    },
    {
      id: 4,
      title: "Zero-Anxiety Defensive UX",
      icon: HeartHandshake,
      badge: "5-Second Undo Grace",
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
      headline: "Human Language & Reassurance Safeguards",
      points: [
        "Live Gateway Health Pulses show instant operational status for NPCI, UIDAI, and NSDL.",
        "Plain empathetic human language replaces cryptic database codes (`ORA-01000`).",
        "5-Second interactive undo safety buffers on all fund withdrawals to prevent accidental clicks."
      ]
    },
    {
      id: 5,
      title: "Universal Multi-Modal Reach",
      icon: Globe2,
      badge: "Inclusive to Last Mile",
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
      headline: "4K Desktop to Sub-50KB 2G Mobile",
      points: [
        "Elder Comfort Senior Mode: 125% scaling, 56px touch ergonomics, and WCAG AAA contrast.",
        "Edge-TTS Neural Voice streaming across 10 Indian vernacular languages with zero API cost.",
        "Sub-50KB lightweight client bundles functional over rural 2G/3G cellular networks."
      ]
    },
    {
      id: 6,
      title: "Sovereign Zero-Trust Core",
      icon: Lock,
      badge: "DPDP & Presidio Shield",
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800",
      headline: "100% PII Masking & 6-Circuit Self-Healing",
      points: [
        "Client-side Presidio PII tokenization masks 100% of Aadhaar and PAN before telemetry.",
        "Substitute Employee Resilience Matrix: 6 hot-swappable fallback circuits guaranteeing 100% uptime.",
        "PostgreSQL Row-Level Security (RLS) policies enforcing multi-tenant boundary isolation."
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-sovereign-navy dark:text-white">
              The 6 Pillars of a $100 Billion Sovereign DPI
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Designed for ₹21+ Lakh Crore ($250B) in public retirement assets across 70+ Million citizens.
          </p>
        </div>

        <button
          onClick={() => setExplainModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md"
        >
          <Calculator className="w-4 h-4" />
          <span>Explain Every Rupee</span>
        </button>
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
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                    {p.headline}
                  </div>
                </div>

                <ul className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400">
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
