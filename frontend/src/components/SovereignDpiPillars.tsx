"use client";

import React, { useState } from "react";
import {
  Shield,
  Zap,
  TrendingUp,
  HeartHandshake,
  Smartphone,
  Lock,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu
} from "lucide-react";
import { ExplainRupeeModal } from "@/components/ExplainRupeeModal";

export function SovereignDpiPillars() {
  const [explainRupeeOpen, setExplainRupeeOpen] = useState(false);

  const pillars = [
    {
      id: 1,
      title: "1. Institutional UI Architecture",
      subtitle: "Tabular Precision & Zero Visual Jitter",
      icon: Shield,
      tag: "SOVEREIGN TRUST",
      badgeColor: "bg-blue-950 text-blue-300 border-blue-800",
      points: [
        "Fixed-width tabular numerals eliminate layout shifts during real-time compounding calculations.",
        "Deep navy palette with high-contrast accessibility across both light and dark modes.",
        "Calm, purposeful visual hierarchy engineered to reduce anxiety during claim submissions."
      ]
    },
    {
      id: 2,
      title: "2. Sub-50ms On-Device Engine",
      subtitle: "Deterministic Instant Calculations",
      icon: Zap,
      tag: "80/20 CLIENT CORE",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-800",
      points: [
        "100% optimistic local execution: Routine calculations (Para 68J, TDS, Levenshtein match) run on-device in <1ms.",
        "Skeleton shimmers preserve viewport layout with Zero Cumulative Layout Shift (CLS = 0).",
        "Offline-tolerant form state in local storage ensures zero progress loss during network interruptions."
      ]
    },
    {
      id: 3,
      title: "3. 100% Financial Lineage",
      subtitle: "Every Rupee Fully Reconciled",
      icon: TrendingUp,
      tag: "MATHEMATICAL PROOF",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800",
      points: [
        "Transparent triple-split derivation: Employee Share (12%), Employer Share (3.67%), and EPS Pension (8.33%).",
        "Explicit 8.25% annual compounding monthly running balance audit ledger.",
        "Tamper-evident cryptographic ledger state with SHA-256 audit trail tokens."
      ],
      hasAction: true,
      actionLabel: "Inspect Live Mathematical Proof ↗",
      onAction: () => setExplainRupeeOpen(true)
    },
    {
      id: 4,
      title: "4. Defensive Reassurance UX",
      subtitle: "Human Language & Accidental Error Safeguards",
      icon: HeartHandshake,
      tag: "5-SECOND GRACE",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-800",
      points: [
        "Live Gateway Health Pulses show real-time operational status for NPCI, UIDAI, and NSDL.",
        "Empathetic human language replaces cryptic database error codes.",
        "5-Second interactive undo grace period buffer on fund withdrawals to prevent accidental claims."
      ]
    },
    {
      id: 5,
      title: "5. Universal Multi-Modal Reach",
      subtitle: "Desktop to Sub-50KB 2G Mobile",
      icon: Smartphone,
      tag: "INCLUSIVE DPI",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-800",
      points: [
        "Elder Comfort Senior Mode: 150% font scaling, 56px touch ergonomics, and high-contrast palette.",
        "Edge-TTS Neural Voice streaming across 13 Indian regional languages with zero API token cost.",
        "Lightweight bundles optimized for budget mobile devices over rural 2G/3G connections."
      ]
    },
    {
      id: 6,
      title: "6. Zero-Trust Security Core",
      subtitle: "On-Device PII Masking & Self-Healing Matrix",
      icon: Lock,
      tag: "DPDP & PRESIDIO",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-800",
      points: [
        "Client-side Presidio PII tokenization masks 100% of Aadhaar and PAN before telemetry logging.",
        "Substitute Employee Resilience Matrix: 6 hot-swappable fallback circuits ensuring 100% uptime.",
        "PostgreSQL Row-Level Security (RLS) policies enforcing multi-tenant boundary isolation."
      ]
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-700/80 pb-4 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-saffron/20 text-saffron">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-saffron font-mono">
              SOVEREIGN ARCHITECTURE BLUEPRINT
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Core Architectural Engineering Pillars
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Engineered for &#8377;21+ Lakh Crore in retirement assets across 70+ Million Indian workers with zero downtime and sub-second verification.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-mono text-emerald-300 font-bold shrink-0">
          6 Core Pillars Active
        </div>
      </div>

      {/* 6 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="p-6 rounded-2xl bg-slate-800/70 backdrop-blur-md border border-slate-700/80 hover:border-saffron/50 transition-all shadow-lg space-y-3 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-saffron flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${pillar.badgeColor}`}>
                    {pillar.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-saffron transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {pillar.subtitle}
                  </p>
                </div>

                <ul className="space-y-2 pt-2 border-t border-slate-700/60 text-xs text-slate-300">
                  {pillar.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-saffron text-sm leading-none shrink-0 mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {pillar.hasAction && (
                <div className="pt-2 relative z-10">
                  <button
                    onClick={pillar.onAction}
                    className="w-full py-2.5 px-3 rounded-xl bg-saffron text-sovereign-darkest hover:bg-amber-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>{pillar.actionLabel}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rupee Lineage Audit Modal */}
      <ExplainRupeeModal
        isOpen={explainRupeeOpen}
        onClose={() => setExplainRupeeOpen(false)}
      />
    </div>
  );
}
