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
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      accent: "from-emerald-500/10 to-teal-500/5 border-emerald-200"
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
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      accent: "from-blue-500/10 to-indigo-500/5 border-blue-200"
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
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      accent: "from-rose-500/10 to-orange-500/5 border-rose-200"
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
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      accent: "from-purple-500/10 to-fuchsia-500/5 border-purple-200"
    },
    {
      id: "5",
      title: "5. Automated TDS Shield",
      tagline: "Form 15G 1-Click Auto-Filer",
      description: "Detects service < 5 years and auto-generates Form 15G with 1 tap, shielding workers from surprise 20% Section 192A tax cuts.",
      route: "/career",
      cta: "Check TDS Exemption",
      icon: ShieldAlert,
      badge: "Tax Protection",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      accent: "from-amber-500/10 to-yellow-500/5 border-amber-200"
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
      badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
      accent: "from-orange-500/10 to-amber-500/5 border-orange-200"
    },
    {
      id: "7",
      title: "7. Zero-Paper Joint Decl.",
      tagline: "Digital 3-Way Cryptographic Handshake",
      description: "Correct name, DOB, and father's name without printing 4-page forms or physical visits. Instant Citizen e-Sign <-> Employer <-> EPFO RO.",
      route: "/fix",
      cta: "Fix Details Online",
      icon: FileCheck2,
      badge: "100% Paperless",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
      accent: "from-cyan-500/10 to-blue-500/5 border-cyan-200"
    },
    {
      id: "8",
      title: "8. Bereavement & EDLI ₹7L",
      tagline: "1-Click Life Insurance & Widow Pension",
      description: "Guided plain-language survivor support for grieving families to claim the statutory ₹7 Lakh EDLI cover and monthly family pension in 1 click.",
      route: "/savings",
      cta: "View EDLI Protection",
      icon: Users,
      badge: "₹7L Life Cover",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      accent: "from-indigo-500/10 to-violet-500/5 border-indigo-200"
    }
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sovereign-navy text-white text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            <span>SOLVING REAL CITIZEN PAIN POINTS • EPFO 3.0 TRANSFORMATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-sovereign-navy tracking-tight">
            The 8 High-Demand Real-World Features Matrix
          </h2>
          <p className="text-xs text-slate-600 max-w-3xl">
            Derived directly from public grievances and community audits. Every statutory roadblock is solved on-device with zero-trust sovereign architecture.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all text-slate-700 shrink-0"
        >
          <span>{isOpen ? "Collapse Matrix" : "Expand Matrix"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* 8 Feature Cards Grid */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className={`bg-gradient-to-br ${f.accent} rounded-2xl p-4 border flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-3`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="w-9 h-9 rounded-xl bg-sovereign-navy text-white flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4 text-saffron" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">{f.title}</h3>
                    <p className="text-[11px] font-bold text-slate-700">{f.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <Link
                  href={f.route}
                  className="w-full py-2 px-3 bg-sovereign-navy hover:bg-sovereign-light text-white text-xs font-bold rounded-xl flex items-center justify-between transition-colors shadow-xs group"
                >
                  <span>{f.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-saffron group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
