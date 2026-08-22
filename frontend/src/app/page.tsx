"use client";

import React from "react";
import Link from "next/link";
import { useCitizen } from "@/context/CitizenContext";
import {
  Wallet,
  Briefcase,
  PiggyBank,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function CitizenLandingPage() {
  const { activeCitizen, seniorMode, language } = useCitizen();

  const totalBalance = activeCitizen.passbook_summary?.total_balance || 0;
  const employeeShare = activeCitizen.passbook_summary?.employee_share || 0;
  const interestEarned = activeCitizen.passbook_summary?.interest_credited_current_fy || 0;

  const topicHubs = [
    {
      title: "I Need Money",
      titleHi: "मुझे पैसे चाहिए",
      titleTe: "నాకు డబ్బులు కావాలి",
      titleTa: "எனக்கு பணம் தேவை",
      desc: "Emergency Medical (Para 68J), Housing (68B), or Marriage/Education advance with sub-2s auto-sanction.",
      href: "/money",
      icon: Wallet,
      tag: "Instant 24hr DBT",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      accent: "from-emerald-600 to-teal-700",
      stat: "Sub-2s Direct Approval"
    },
    {
      title: "I Changed Jobs",
      titleHi: "मैंने नौकरी बदल ली",
      titleTe: "నేను ఉద్యోగం మారాను",
      titleTa: "நான் வேலை மாறினேன்",
      desc: "1-Click multi-establishment PF transfer (Form 13). Auto-deduces missing Date of Exit from last ECR timestamp.",
      href: "/career",
      icon: Briefcase,
      tag: "Auto-Exit Deducer",
      tagColor: "bg-blue-100 text-blue-800 border-blue-300",
      accent: "from-blue-600 to-indigo-800",
      stat: "Unified Single Ledger"
    },
    {
      title: "My Savings & Pension",
      titleHi: "मेरी बचत और पेंशन",
      titleTe: "నా పొదుపు మరియు పెన్షన్",
      titleTa: "என் சேமிப்பு மற்றும் ஓய்வூதியம்",
      desc: "Interactive visual triple-split passbook with 8.25% sovereign compounding retirement forecaster and ₹7L EDLI.",
      href: "/savings",
      icon: PiggyBank,
      tag: "8.25% Sovereign Rate",
      tagColor: "bg-amber-100 text-amber-900 border-amber-300",
      accent: "from-amber-500 to-yellow-600",
      stat: "₹7 Lakh EDLI Covered"
    },
    {
      title: "Fix My Details",
      titleHi: "मेरे विवरण ठीक करें",
      titleTe: "నా వివరాలు సరిదిద్దండి",
      titleTa: "என் விவரங்களை திருத்துங்கள்",
      desc: "Instant Aadhaar fuzzy name check (≥85%), 1-Click Penny-Drop bank verification, and 3-way digital Joint Declaration.",
      href: "/fix",
      icon: Wrench,
      tag: "Zero-Paper 3-Way",
      tagColor: "bg-purple-100 text-purple-800 border-purple-300",
      accent: "from-purple-600 to-indigo-700",
      stat: "Instant Penny Drop"
    }
  ];

  const getLocalizedTitle = (hub: typeof topicHubs[0]) => {
    if (language === "hi-IN") return hub.titleHi;
    if (language === "te-IN") return hub.titleTe;
    if (language === "ta-IN") return hub.titleTa;
    return hub.title;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Citizen Welcome Banner & Balance Overview */}
      <section className="bg-gradient-to-br from-sovereign-darkest via-sovereign-navy to-sovereign-light text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sovereign-accent relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-samriddhi-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron text-sovereign-darkest">
                Citizen Portal • Namaste
              </span>
              <span className="text-xs text-slate-300">
                UAN: <strong className="font-mono text-white">{activeCitizen.uan}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {activeCitizen.full_name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeCitizen.active_employment
                ? `Active at ${activeCitizen.active_employment.establishment_name} (${activeCitizen.active_employment.total_service_years} years service)`
                : activeCitizen.pension_details
                ? `Senior Pensioner • PPO: ${activeCitizen.pension_details.ppo_number} • Scheme: ${activeCitizen.pension_details.scheme}`
                : "Self-Employed / Gig Platform Contributor"}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bank KYC: {activeCitizen.bank_kyc.bank_name} (Verified)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-amber-300">
                <Zap className="w-3.5 h-3.5" />
                <span>8.25% Sovereign Rate Active</span>
              </div>
            </div>
          </div>

          {/* Quick Balance Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full lg:w-80 shadow-2xl space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>Total Accumulated PF</span>
              <span className="text-emerald-400 font-bold">● Active</span>
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-tight">
              ₹{totalBalance.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-300 flex justify-between border-t border-white/10 pt-2">
              <span>Employee Share:</span>
              <span className="font-semibold text-white">₹{employeeShare.toLocaleString("en-IN")}</span>
            </div>
            <div className="text-xs text-slate-300 flex justify-between">
              <span>FY Interest Credited:</span>
              <span className="font-semibold text-samriddhi-bright">₹{interestEarned.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Topic-Centric Life Event Hubs */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sovereign-navy">
              What would you like to do today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select your life event below. Zero confusing bureaucratic forms (No Form 31/19/10C).
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-saffron-dark bg-saffron/10 px-3 py-1 rounded-full border border-saffron/30">
            Topic-Centric Intent Standard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topicHubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-sovereign-navy p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hub.accent} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hub.tagColor}`}>
                      {hub.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-sovereign-navy group-hover:text-saffron-dark transition-colors">
                      {getLocalizedTitle(hub)}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {hub.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sovereign-navy group-hover:text-saffron transition-colors">
                  <span>{hub.stat}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 80/20 On-Site Architectural Guarantees */}
      <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">80/20 On-Site Engine</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Math, fuzzy name matching, and canvas sharpness run in &lt;5ms on your browser at $0 API cost.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Zero-Trust & RLS Shield</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Aadhaar and PAN masked on-device. Multi-tenant PostgreSQL Row-Level Security isolation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Substitute Resilience</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Hot fallbacks for voice, OCR, and databases guarantee zero downtime or transaction drops.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
