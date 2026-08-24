"use client";

import React, { useState } from "react";
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
  UserCheck,
  Building2,
  Coins,
  HeartHandshake,
  Shield,
  LogOut,
  ChevronDown
} from "lucide-react";
import { BenchmarkComparison } from "@/components/BenchmarkComparison";
import { CitizenFeatureMatrix } from "@/components/CitizenFeatureMatrix";
import { AudienceSegmentReport } from "@/components/AudienceSegmentReport";
import { SreTelemetryPanel } from "@/components/SreTelemetryPanel";
import { SovereignDpiPillars } from "@/components/SovereignDpiPillars";
import { GatewayHealthPulse } from "@/components/GatewayHealthPulse";
import { ClaimReadinessScore } from "@/components/ClaimReadinessScore";
import { ChaosSimulatorModal } from "@/components/ChaosSimulatorModal";

export default function CitizenLandingPage() {
  const { activeCitizen, isAuthenticated, login, logout, language } = useCitizen();
  const t = getTranslation(language);

  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [activeSectionTab, setActiveSectionTab] = useState<"features" | "audience" | "benchmark" | "sre" | "pillars">("features");

  const totalBalance = activeCitizen.passbook_summary?.total_balance || 0;
  const [displayBalance, setDisplayBalance] = useState(0);
  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);
  const [showArchitectureMatrix, setShowArchitectureMatrix] = useState(false);

  React.useEffect(() => {
    const duration = 800;
    const steps = 30;
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

  const personaScenarios = [
    {
      uan: "100982348712",
      name: "Ramesh Kumar (Age 48)",
      role: "Factory Machine Operator",
      org: "Precision Auto Components Pvt Ltd (8.2 yrs)",
      balance: "₹3,42,500",
      badge: "Form 31 Advance",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      testScenario: "Tests: Emergency Medical (Para 68J) or Housing (Para 68B) advance with instant Canvas Cheque OCR pre-validation.",
      icon: Coins
    },
    {
      uan: "101294817203",
      name: "Priya Sharma (Age 27)",
      role: "Software Engineer",
      org: "Apex AI Systems India (Prev: CloudNine)",
      balance: "₹4,75,000",
      badge: "Form 13 Job Switch",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      testScenario: "Tests: Multi-job PF transfer (₹1.85L) + Auto-deduction of missing Date of Exit (DOE) from last ECR timestamp.",
      icon: Building2
    },
    {
      uan: "100112233445",
      name: "Gurmeet Singh (Age 66)",
      role: "Senior Pensioner",
      org: "Retired (EPS-95 Pensioner)",
      balance: "₹4,250 / mo (Pension)",
      badge: "Senior Pensioner",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      testScenario: "Tests: High-contrast Senior Citizen Mode (130% scaling, black/yellow palette) and EPS-95 monthly pension ledgers.",
      icon: HeartHandshake
    },
    {
      uan: "101889977665",
      name: "Sunita Devi (Age 34)",
      role: "Gig Healthcare Worker",
      org: "QuickBite Logistics & Courier Services",
      balance: "₹86,400",
      badge: "e-Nomination & KYC",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      testScenario: "Tests: Mobile 1-click e-Nomination with Aadhaar e-Sign, Levenshtein fuzzy name match, and ₹7L EDLI insurance.",
      icon: UserCheck
    }
  ];

  const handle1ClickLogin = (uan: string) => {
    setLoggingIn(true);
    login(uan);
    setTimeout(() => setLoggingIn(false), 300);
  };

  // If visitor is NOT authenticated, display the 1-Click Persona Login Gateway
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>HACKATHON EVALUATOR & CITIZEN LOGIN GATEWAY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sovereign-navy dark:text-white tracking-tight">
            Select a Mock Citizen Persona to Begin
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instant 1-Click Evaluator & Citizen Gateway. Select any persona scenario below to immediately test the rebuilt life-event hubs with zero SMS OTP friction.
          </p>
        </div>

        {/* 4 Persona Scenario Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personaScenarios.map((persona) => {
            const Icon = persona.icon;
            const isCurrent = activeCitizen.uan === persona.uan;
            return (
              <div
                key={persona.uan}
                onClick={() => handle1ClickLogin(persona.uan)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 ${
                  isCurrent
                    ? "border-saffron bg-amber-50/50 shadow-md ring-2 ring-saffron/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-sovereign-navy text-white flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-sovereign-navy dark:text-white flex items-center gap-1.5">
                          <span>{persona.name}</span>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{persona.role}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${persona.badgeColor}`}>
                      {persona.badge}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Establishment:</span>
                      <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{persona.org}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Simulated UAN:</span>
                      <strong className="font-mono text-slate-900 dark:text-white">{persona.uan}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Current Corpus:</span>
                      <strong className="font-mono text-emerald-700 font-bold">{persona.balance}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                    💡 {persona.testScenario}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-sovereign-navy text-white hover:bg-sovereign-light flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>1-Click Instant Login as {persona.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Evaluator Security & Zero-Trust Notice */}
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-center max-w-xl mx-auto space-y-1">
          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Sovereign Sandbox Protocol • 100% Deterministic & Safe</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Engineered with Zero-Trust local execution. Select any persona above to instantly test all 8 end-to-end statutory workflows.
          </p>
        </div>
      </div>
    );
  }

  // If visitor IS authenticated, display the full Citizen Dashboard
  const employeeShare = activeCitizen.passbook_summary?.employee_share || 0;
  const interestEarned = activeCitizen.passbook_summary?.interest_credited_current_fy || 0;

  const topicHubs = [
    {
      title: t.navMoney,
      desc: t.homeMoneyDesc,
      href: "/money",
      icon: Wallet,
      tag: "Instant Advance",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      accent: "from-emerald-600 to-teal-700",
      stat: "Instant DBT Sanction"
    },
    {
      title: t.navCareer,
      desc: t.homeCareerDesc,
      href: "/career",
      icon: Briefcase,
      tag: "Job Switch Transfer",
      tagColor: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
      accent: "from-blue-600 to-indigo-800",
      stat: "Auto-Exit Deducer"
    },
    {
      title: t.navSavings,
      desc: t.homeSavingsDesc,
      href: "/savings",
      icon: PiggyBank,
      tag: "8.25% Wealth",
      tagColor: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      accent: "from-amber-500 to-yellow-600",
      stat: "₹7 Lakh Free Insurance"
    },
    {
      title: t.navFix,
      desc: t.homeFixDesc,
      href: "/fix",
      icon: Wrench,
      tag: "Self-Healing KYC",
      tagColor: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
      accent: "from-purple-600 to-indigo-700",
      stat: "Para 72(5) Legal Shield"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Live Sovereign Gateway Pulse */}
      <GatewayHealthPulse />

      {/* Citizen Welcome Banner & Balance Overview */}
      <section className="bg-gradient-to-br from-sovereign-darkest via-sovereign-navy to-sovereign-light text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sovereign-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-samriddhi-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron text-sovereign-darkest">
                CITIZEN REDESIGN PROTOTYPE
              </span>
              <span className="text-xs text-slate-300">
                SIMULATED UAN: <strong className="font-mono text-white">{activeCitizen.uan}</strong>
              </span>
              <button
                onClick={logout}
                className="text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 flex items-center gap-1 transition-colors ml-2"
                title="Switch persona or logout"
              >
                <LogOut className="w-3 h-3 text-saffron" />
                <span>Switch / Logout</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {activeCitizen.full_name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeCitizen.active_employment
                ? `${t.activeEstablishmentLabel}: ${activeCitizen.active_employment.establishment_name} (${activeCitizen.active_employment.total_service_years} years)`
                : activeCitizen.pension_details
                ? `Senior Pensioner • PPO: ${activeCitizen.pension_details.ppo_number} • ${activeCitizen.pension_details.scheme}`
                : "Gig Platform / Unorganized Contributor"}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.verifiedKYCLabel}: {activeCitizen.bank_kyc.bank_name} ({t.verified})</span>
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
              <span>{t.totalBalanceLabel}</span>
              <span className="text-emerald-400 font-bold">● {t.verified}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
              ₹{displayBalance.toLocaleString("en-IN")}
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Employee Share (12%):</span>
                <span className="font-mono font-bold text-white">₹{employeeShare.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">FY Interest (8.25%):</span>
                <span className="font-mono font-bold text-amber-300">₹{interestEarned.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClaimReadinessScore />

      {/* 4 Topic-Centric Action Hubs Header */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-sovereign-navy dark:text-white tracking-tight">
              {t.quickActionsTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.homeSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setChaosSimulatorOpen(true)}
              className="text-xs font-bold px-3 py-1.5 bg-saffron/15 hover:bg-saffron text-sovereign-darkest dark:text-amber-300 dark:hover:text-slate-950 border border-saffron/40 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Launch Chaos Sandbox to inject mismatches and test self-healing"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Stress-Test Chaos Sandbox</span>
            </button>
            <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl">
              80/20 Sovereign Core
            </span>
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
                className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-sovereign-light text-white flex items-center justify-center group-hover:bg-saffron group-hover:text-sovereign-darkest transition-colors shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${hub.tagColor}`}>
                      {hub.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-sovereign-navy dark:text-white group-hover:text-saffron transition-colors">
                      {hub.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
                      {hub.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{hub.stat}</span>
                  <div className="flex items-center gap-1 text-sovereign-navy dark:text-white group-hover:text-saffron group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Architectural Intelligence & Evaluator Showcase Tabs (Collapsible) */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-saffron/20 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-sovereign-navy dark:text-white">
                  Architectural Intelligence & Benchmark Matrix
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                  5 Subsystems
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect 80/20 Sovereign Core, 500-iteration in-browser benchmark runner, audience journeys, and SRE health telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowArchitectureMatrix(!showArchitectureMatrix)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sovereign-navy dark:text-white transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shrink-0"
          >
            <span>{showArchitectureMatrix ? "Collapse Architecture Matrix" : "Inspect Architecture & Live Benchmarks"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showArchitectureMatrix ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showArchitectureMatrix && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            {/* Tab Selection Chips */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Select Subsystem Inspection Tab:
              </span>
              <div role="tablist" className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <button
                  role="tab"
                  aria-selected={activeSectionTab === "features"}
                  onClick={() => setActiveSectionTab("features")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSectionTab === "features"
                      ? "bg-white dark:bg-slate-900 text-sovereign-navy dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  🌟 Breakthroughs
                </button>
                <button
                  role="tab"
                  aria-selected={activeSectionTab === "audience"}
                  onClick={() => setActiveSectionTab("audience")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSectionTab === "audience"
                      ? "bg-white dark:bg-slate-900 text-sovereign-navy dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  👥 Audience Journeys
                </button>
                <button
                  role="tab"
                  aria-selected={activeSectionTab === "benchmark"}
                  onClick={() => setActiveSectionTab("benchmark")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSectionTab === "benchmark"
                      ? "bg-white dark:bg-slate-900 text-sovereign-navy dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  📊 Impact Benchmark
                </button>
                <button
                  role="tab"
                  aria-selected={activeSectionTab === "sre"}
                  onClick={() => setActiveSectionTab("sre")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSectionTab === "sre"
                      ? "bg-white dark:bg-slate-900 text-sovereign-navy dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  ⚡ SRE Telemetry
                </button>
                <button
                  role="tab"
                  aria-selected={activeSectionTab === "pillars"}
                  onClick={() => setActiveSectionTab("pillars")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSectionTab === "pillars"
                      ? "bg-white dark:bg-slate-900 text-sovereign-navy dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  🏛️ Engineering Pillars
                </button>
              </div>
            </div>

            {/* Tab Content Display */}
            <div className="transition-all duration-200">
              {activeSectionTab === "features" && <CitizenFeatureMatrix />}
              {activeSectionTab === "audience" && <AudienceSegmentReport />}
              {activeSectionTab === "benchmark" && <BenchmarkComparison />}
              {activeSectionTab === "sre" && <SreTelemetryPanel />}
              {activeSectionTab === "pillars" && <SovereignDpiPillars />}
            </div>
          </div>
        )}
      </div>

      {/* Live Zero-Rejection Chaos Simulator Sandbox Modal */}
      <ChaosSimulatorModal
        isOpen={chaosSimulatorOpen}
        onClose={() => setChaosSimulatorOpen(false)}
      />
    </div>
  );
}
