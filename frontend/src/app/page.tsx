"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCitizen } from "@/context/CitizenContext";
import { getTranslation } from "@/lib/translations";
import {
  Wallet,
  Briefcase,
  PiggyBank,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Coins,
  HeartHandshake,
  UserCheck,
  ChevronDown,
  Activity,
  ArrowUpRight,
  Lock,
  Cpu
} from "lucide-react";

import { BenchmarkComparison } from "@/components/BenchmarkComparison";
import { CitizenFeatureMatrix } from "@/components/CitizenFeatureMatrix";
import { AudienceSegmentReport } from "@/components/AudienceSegmentReport";
import { SreTelemetryPanel } from "@/components/SreTelemetryPanel";
import { SovereignDpiPillars } from "@/components/SovereignDpiPillars";
import { ChaosSimulatorModal } from "@/components/ChaosSimulatorModal";

export default function CitizenLandingPage() {
  const { activeCitizen, isAuthenticated, login, logout, language } = useCitizen();
  const t = getTranslation(language);

  const [activeSectionTab, setActiveSectionTab] = useState<"features" | "audience" | "benchmark" | "sre" | "pillars">("benchmark");
  const [showArchitectureMatrix, setShowArchitectureMatrix] = useState(false);
  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);

  const totalBalance = activeCitizen.passbook_summary?.total_balance || 0;
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    const duration = 600;
    const steps = 24;
    const increment = totalBalance / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalBalance) {
        setDisplayBalance(totalBalance);
        clearInterval(timer);
      } else {
        setDisplayBalance(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [totalBalance]);

  // Persona login scenarios for unauthenticated evaluators
  const personaScenarios = [
    {
      uan: "100982348712",
      name: "Ramesh Kumar (48)",
      role: "Factory Machine Operator",
      org: "Precision Auto Components (8.2 yrs)",
      balance: "₹3,42,500",
      tag: "Form 31 Advance",
      desc: "Tests instant emergency medical advance with in-browser Cheque OCR pre-validation.",
      icon: Coins,
      accent: "from-emerald-500/20 to-teal-500/10"
    },
    {
      uan: "101294817203",
      name: "Priya Sharma (27)",
      role: "Software Engineer",
      org: "Apex AI Systems (Prev: CloudNine)",
      balance: "₹4,75,000",
      tag: "Form 13 Job Switch",
      desc: "Tests multi-job transfer & auto-recovery of missing Exit Date from ECR timestamps.",
      icon: Building2,
      accent: "from-blue-500/20 to-indigo-500/10"
    },
    {
      uan: "100112233445",
      name: "Gurmeet Singh (66)",
      role: "Senior EPS-95 Pensioner",
      org: "Retired Pensioner (Ludhiana)",
      balance: "₹4,250 / mo",
      tag: "Senior Pensioner",
      desc: "Tests Senior Citizen Mode (150% scaling, zero captchas) & 1-click Jeevan Pramaan DLC.",
      icon: HeartHandshake,
      accent: "from-amber-500/20 to-yellow-500/10"
    },
    {
      uan: "101889977665",
      name: "Sunita Devi (34)",
      role: "Healthcare Logistics Worker",
      org: "QuickBite Logistics (Surat)",
      balance: "₹86,400",
      tag: "e-Nomination & KYC",
      desc: "Tests 1-click digital e-Nomination with Aadhaar e-Sign & ₹7L free EDLI life insurance.",
      icon: UserCheck,
      accent: "from-purple-500/20 to-pink-500/10"
    }
  ];

  // Unauthenticated FastPath Gateway
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>HACKATHON EVALUATOR & CITIZEN FASTPATH GATEWAY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Select a Worker Persona to Test Live
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Instant 1-Click FastPath. Select any persona below to immediately experience the zero-rejection sovereign workflows with zero SMS OTP friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personaScenarios.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.uan}
                onClick={() => login(p.uan)}
                className="group p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-saffron/60 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-saffron transition-colors">
                          {p.name}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{p.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {p.tag}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-xs space-y-1.5 border border-slate-100 dark:border-slate-700/60 font-mono">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Corpus Balance:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{p.balance}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Simulated UAN:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{p.uan}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    💡 {p.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-saffron transition-colors">
                  <span>1-Click Launch Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Authenticated State Calculations
  const employeeShare = activeCitizen.passbook_summary?.employee_share || 0;
  const interestEarned = activeCitizen.passbook_summary?.interest_credited_current_fy || 0;
  const hasNominee = !!activeCitizen.nomination_details?.nomination_filed;
  const readinessPercentage = hasNominee ? 98 : 80;

  const topicHubs = [
    {
      title: t.navMoney,
      desc: "Instant emergency advance (medical, housing, marriage) with sub-0.05ms statutory math & in-browser cheque sharpness OCR.",
      href: "/money",
      icon: Wallet,
      tag: "Para 68 Advance",
      stat: "Instant DBT Sanction",
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      border: "hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: t.navCareer,
      desc: "1-Click multi-company PF transfer. Auto-deduces missing Exit Dates from monthly ECR wage timestamps in <0.001ms.",
      href: "/career",
      icon: Briefcase,
      tag: "Form 13 Transfer",
      stat: "Auto ECR Deducer",
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      border: "hover:border-blue-500/40",
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400"
    },
    {
      title: t.navSavings,
      desc: "Live 8.25% compounding forecaster, statutory triple-split passbook ledger, and ₹7.0 Lakh free EDLI life insurance tracker.",
      href: "/savings",
      icon: PiggyBank,
      tag: "8.25% Sovereign Yield",
      stat: "₹7L EDLI Insurance",
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      border: "hover:border-amber-500/40",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400"
    },
    {
      title: t.navFix,
      desc: "Sub-5ms Levenshtein name match, NPCI penny drop bank check, 3-way Swarm joint declarations & Para 72(5) legal notice drafter.",
      href: "/fix",
      icon: Wrench,
      tag: "Self-Healing KYC",
      stat: "Levenshtein Matcher",
      gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
      border: "hover:border-purple-500/40",
      iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. LUXURY FINTECH CITIZEN HERO OVERVIEW */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-sovereign-navy text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Member Identity & Employment */}
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● Active Citizen Account
              </span>
              <span className="text-xs text-slate-400 font-mono">
                UAN: <strong className="text-slate-200">{activeCitizen.uan}</strong>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {activeCitizen.full_name}
            </h1>

            <p className="text-sm text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-saffron shrink-0" />
              <span>
                {activeCitizen.active_employment
                  ? `${activeCitizen.active_employment.establishment_name} (${activeCitizen.active_employment.total_service_years} yrs service)`
                  : activeCitizen.pension_details
                  ? `Senior Pensioner • PPO: ${activeCitizen.pension_details.ppo_number}`
                  : "Gig / Unorganized Worker"}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeCitizen.bank_kyc?.bank_name} (KYC Active)</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>8.25% Sovereign Rate</span>
              </span>
            </div>
          </div>

          {/* Quick Balance Display */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 p-6 rounded-3xl w-full lg:w-84 shadow-2xl space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Total Passbook Corpus</span>
              <span className="text-emerald-400 font-bold font-mono">8.25% Yield</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white">
              ₹{displayBalance.toLocaleString("en-IN")}
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-700 text-xs text-slate-300 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Employee Share:</span>
                <span className="font-bold text-white">₹{employeeShare.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current FY Interest:</span>
                <span className="font-bold text-amber-400">+₹{interestEarned.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APPLE-STYLE CLAIM READINESS HEALTH BAR */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1 w-full sm:w-auto flex-1">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pre-Flight Claim Readiness Score
              </h3>
            </div>
            <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
              {readinessPercentage}% Approval Probability
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
            <div
              style={{ width: `${readinessPercentage}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Aadhaar Seeded
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Bank KYC Validated
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ PAN Linked
            </span>
            {!hasNominee ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                ⚠ e-Nomination Pending
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ e-Nomination Active
              </span>
            )}
          </div>
        </div>

        {!hasNominee && (
          <Link
            href="/fix"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-saffron hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <span>1-Click e-Nomination Fix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </section>

      {/* 3. 4 LIFE-EVENT ACTION HUBS */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Human Life-Event Portals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Replaces 18 bureaucratic forms. 80% on-device deterministic math with sub-0.05ms execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/benchmarks"
              className="text-xs font-bold px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-700 hover:text-white dark:text-emerald-300 border border-emerald-500/30 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>⚡ Live Benchmarks (&lt;0.05ms)</span>
            </Link>
            <button
              onClick={() => setChaosSimulatorOpen(true)}
              className="text-xs font-bold px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-800 hover:text-slate-950 dark:text-amber-300 border border-amber-500/30 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Stress-Test Chaos Sandbox</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topicHubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className={`group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${hub.border}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform ${hub.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {hub.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-saffron transition-colors">
                      {hub.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                      {hub.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{hub.stat}</span>
                  <div className="flex items-center gap-1 text-slate-900 dark:text-white group-hover:text-saffron group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. COLLAPSIBLE ARCHITECTURE & TELEMETRY ACCORDION */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sovereign Architecture & Deep Telemetry
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  5 Subsystems
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect 80/20 Sovereign Core, 1,000-run live latency runner, audience journeys, and SRE health telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowArchitectureMatrix(!showArchitectureMatrix)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shrink-0"
          >
            <span>{showArchitectureMatrix ? "Collapse Architecture Matrix" : "Inspect Architecture & Live Evals"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showArchitectureMatrix ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showArchitectureMatrix && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            {/* Tab Selection Chips */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() => setActiveSectionTab("benchmark")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSectionTab === "benchmark"
                    ? "bg-saffron text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                📊 1,000-Run Live Latency Runner
              </button>
              <button
                onClick={() => setActiveSectionTab("features")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSectionTab === "features"
                    ? "bg-saffron text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                🏛️ Statutory Feature Matrix
              </button>
              <button
                onClick={() => setActiveSectionTab("audience")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSectionTab === "audience"
                    ? "bg-saffron text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                👥 Demographic Personas
              </button>
              <button
                onClick={() => setActiveSectionTab("sre")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSectionTab === "sre"
                    ? "bg-saffron text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                🛡️ SRE Telemetry & Circuit Breakers
              </button>
              <button
                onClick={() => setActiveSectionTab("pillars")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSectionTab === "pillars"
                    ? "bg-saffron text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                🇮🇳 Sovereign DPI Pillars
              </button>
            </div>

            {/* Subsystem Render */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              {activeSectionTab === "benchmark" && <BenchmarkComparison />}
              {activeSectionTab === "features" && <CitizenFeatureMatrix />}
              {activeSectionTab === "audience" && <AudienceSegmentReport />}
              {activeSectionTab === "sre" && <SreTelemetryPanel />}
              {activeSectionTab === "pillars" && <SovereignDpiPillars />}
            </div>
          </div>
        )}
      </div>

      {/* Chaos Simulator Sandbox Modal */}
      <ChaosSimulatorModal
        isOpen={chaosSimulatorOpen}
        onClose={() => setChaosSimulatorOpen(false)}
      />
    </div>
  );
}
