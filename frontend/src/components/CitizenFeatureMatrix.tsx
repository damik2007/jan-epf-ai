"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Activity,
  Radar,
  GitMerge,
  ShieldAlert,
  HeartHandshake,
  FileCheck2,
  Users,
  ChevronDown,
  Sparkles,
  ArrowRight
} from "lucide-react";

export function CitizenFeatureMatrix() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const features = [
    {
      id: "1",
      title: "1. Instant UPI Advance",
      tagline: "Sub-2s Emergency Payout",
      description: "Auto-settles emergency medical advances under ₹50,000 in seconds via simulated instant UPI/IMPS. Replaces 7–20 day clerical delays.",
      route: "/money",
      cta: "Test Instant Payout",
      icon: Zap,
      badge: "EPFO 3.0 Standard",
      badgeColor: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
      accent: "hover:border-emerald-500/50"
    },
    {
      id: "2",
      title: "2. Claim Health Score (99%)",
      tagline: "Pre-Flight Rejection Diagnostic",
      description: "Pre-validates Name Match (Levenshtein ≥85%), Bank KYC, and Canvas Cheque readability BEFORE submission to guarantee zero rejections.",
      route: "/money",
      cta: "Run Diagnostic",
      icon: Activity,
      badge: "Zero-Rejection Shield",
      badgeColor: "bg-blue-950/60 text-blue-300 border-blue-800/60",
      accent: "hover:border-blue-500/50"
    },
    {
      id: "3",
      title: "3. Employer ECR Radar",
      tagline: "'PF Theft Alert' Watchdog",
      description: "Monitors monthly salary deductions against EPFO ECR challans. Alerts the worker on the 16th if the company deducted PF but failed to deposit.",
      route: "/savings",
      cta: "View Deposit Watchdog",
      icon: Radar,
      badge: "Statutory Compliance",
      badgeColor: "bg-rose-950/60 text-rose-300 border-rose-800/60",
      accent: "hover:border-rose-500/50"
    },
    {
      id: "4",
      title: "4. 1-Click Multi-Merge",
      tagline: "Universal Account Consolidation",
      description: "Consolidates 3–4 past Member IDs into active employment in 1 tap. Auto-deduces missing Date of Exit from last ECR wage timestamp.",
      route: "/career",
      cta: "Merge Accounts",
      icon: GitMerge,
      badge: "Form 13 Auto-Merge",
      badgeColor: "bg-purple-950/60 text-purple-300 border-purple-800/60",
      accent: "hover:border-purple-500/50"
    },
    {
      id: "5",
      title: "5. Automated TDS Shield",
      tagline: "Form 15G 1-Click Auto-Filer",
      description: "Detects service < 5 years and auto-generates Form 15G with 1 tap, shielding workers from surprise 10%–20% Section 192A TDS deductions on withdrawals over ₹50,000.",
      route: "/career",
      cta: "Check TDS Exemption",
      icon: ShieldAlert,
      badge: "Tax Protection",
      badgeColor: "bg-amber-950/60 text-amber-300 border-amber-800/60",
      accent: "hover:border-amber-500/50"
    },
    {
      id: "6",
      title: "6. Senior Voice Life Cert.",
      tagline: "Guided Jeevan Pramaan Face RD",
      description: "Voice-assisted facial biometric capture with gentle spoken cues ('Please blink your eyes now, Gurmeet ji') and Elder Comfort mode.",
      route: "/savings",
      cta: "Renew Life Certificate",
      icon: HeartHandshake,
      badge: "EPS-95 Pension",
      badgeColor: "bg-orange-950/60 text-orange-300 border-orange-800/60",
      accent: "hover:border-orange-500/50"
    },
    {
      id: "7",
      title: "7. Zero-Paper Joint Decl.",
      tagline: "Digital 3-Way Cryptographic Handshake",
      description: "Correct name, DOB, and father's name without printing 4-page forms or physical visits. Instant Citizen e-Sign <-> Employer <-> EPFO RO.",
      route: "/fix",
      cta: "Submit Digital Joint Decl.",
      icon: FileCheck2,
      badge: "Zero Paperwork",
      badgeColor: "bg-teal-950/60 text-teal-300 border-teal-800/60",
      accent: "hover:border-teal-500/50"
    },
    {
      id: "8",
      title: "8. AI Grievance Copilot",
      tagline: "Automated Error-Code Root Cause",
      description: "Paste delayed claim complaints in plain Hindi/English. The AI diagnoses the exact root cause and submits a prioritized resolution draft.",
      route: "/fix",
      cta: "Diagnose Delay",
      icon: Users,
      badge: "EPFiGMS Modernization",
      badgeColor: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60",
      accent: "hover:border-indigo-500/50"
    }
  ];

  return (
    <section className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700/80 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-mono tracking-wider font-bold shadow-sm uppercase">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            <span>Solving Real Citizen Pain Points • EPFO 3.0 Transformation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
            The 8 High-Demand Real-World Features Matrix
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-1">
            Derived directly from public grievances and community audits. Every statutory roadblock is solved on-device with zero-trust sovereign architecture.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-all text-slate-300 shrink-0 border border-white/10"
        >
          <span>{isOpen ? "Collapse Matrix" : "Expand Matrix"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* 8 Feature Cards Grid */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10 animate-in fade-in duration-300">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className={`p-5 rounded-2xl bg-slate-800/70 backdrop-blur-md border border-slate-700/80 transition-all shadow-lg flex flex-col justify-between group overflow-hidden ${f.accent}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-saffron flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-saffron transition-colors leading-snug">{f.title}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{f.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pb-2">
                    {f.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 mt-2">
                  <Link
                    href={f.route}
                    className="w-full py-2.5 px-3 bg-saffron text-sovereign-darkest hover:bg-amber-400 text-xs font-extrabold rounded-xl flex items-center justify-between transition-all shadow-md group-hover:shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  >
                    <span>{f.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
