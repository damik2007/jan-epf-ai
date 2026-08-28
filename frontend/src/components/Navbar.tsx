"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Home,
  Wallet,
  Briefcase,
  PiggyBank,
  Wrench,
  UserCheck,
  Languages,
  Eye,
  ShieldCheck,
  ChevronDown,
  Zap,
  Sun,
  Moon,
  Search,
  Activity,
  LogOut,
  Landmark,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  Layers
} from "lucide-react";

import { getTranslation } from "@/lib/translations";
import { EvaluatorTourModal } from "@/components/EvaluatorTourModal";
import { CommandCenter } from "@/components/CommandCenter";
import { ChaosSimulatorModal } from "@/components/ChaosSimulatorModal";
import { ArchitectureInspectorModal } from "@/components/ArchitectureInspectorModal";
import { LiveSovereignPulse } from "@/components/LiveSovereignPulse";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    citizens,
    activeCitizen,
    isAuthenticated,
    login,
    logout,
    switchCitizen,
    language,
    setLanguage,
    seniorMode,
    setSeniorMode,
    theme,
    toggleTheme,
    resetAllData
  } = useCitizen();

  const t = getTranslation(language);

  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [chaosModalOpen, setChaosModalOpen] = useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Close mobile drawer / persona dropdown whenever route changes
  useEffect(() => {
    setMobileDrawerOpen(false);
    setPersonaDropdownOpen(false);
  }, [pathname]);

  // Global Keyboard listener for ⌘K Omnibar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Desktop Navigation Hub Links
  const desktopNavItems = [
    {
      label: t.navMoney || "I Need Money",
      href: "/money",
      icon: Wallet
    },
    {
      label: t.navCareer || "I Changed Jobs",
      href: "/career",
      icon: Briefcase
    },
    {
      label: t.navSavings || "My Savings",
      href: "/savings",
      icon: PiggyBank
    },
    {
      label: t.navFix || "Fix My Details",
      href: "/fix",
      icon: Wrench
    },
    {
      label: "Benchmarks",
      href: "/benchmarks",
      icon: Activity
    },
    {
      label: t.navArchitecture || "Architecture & Research",
      href: "/architecture",
      icon: Landmark
    }
  ];

  // Mobile Bottom Navigation Tabs (5 Key Life-Event Hubs)
  const mobileBottomTabs = [
    {
      label: "Home",
      href: "/",
      icon: Home
    },
    {
      label: t.navMoney || "Money",
      href: "/money",
      icon: Wallet
    },
    {
      label: t.navCareer || "Career",
      href: "/career",
      icon: Briefcase
    },
    {
      label: t.navSavings || "Savings",
      href: "/savings",
      icon: PiggyBank
    },
    {
      label: t.navFix || "Fix KYC",
      href: "/fix",
      icon: Wrench
    }
  ];

  return (
    <>
      {/* =========================================================================
          1. FIXED TOP HEADER
             - Mobile (< md): Sleek single-row compact header (h-14 / 56px)
             - Desktop (>= md): Full 3-tier enterprise header
         ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-sovereign-navy text-white shadow-lg border-b border-sovereign-light transition-all">
        
        {/* --- DESKTOP TIER 1: Sovereign Top Ticker Bar (Hidden on Mobile) --- */}
        <div className="hidden md:flex w-full bg-sovereign-darkest border-b border-sovereign-navy/50 px-4 sm:px-6 lg:px-10 py-1.5 text-xs justify-between items-center text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-saffron animate-pulse shrink-0" />
            <span className="font-bold text-saffron text-xs tracking-wider uppercase">
              PROTOTYPE PROOF-OF-CONCEPT
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 text-xs truncate max-w-md">
              Build What Moves India Hackathon (Varun Mayya × OpenAI)
            </span>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Reset Demo State Button */}
            <button
              onClick={() => {
                if (window.confirm("Reset all test claims, balances, and mock accounts to initial clean state?")) {
                  resetAllData();
                }
              }}
              className="flex items-center gap-1 min-h-[32px] justify-center px-2 py-0.5 rounded text-xs font-bold transition-all bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50"
              title="Reset all test claims and balances to clean state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 min-h-[32px] justify-center px-2 py-0.5 rounded text-xs font-bold transition-all bg-sovereign-light hover:bg-sovereign-accent text-white"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-300" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Senior Mode Toggle */}
            <button
              onClick={() => setSeniorMode((prev) => !prev)}
              className={`flex items-center gap-1 min-h-[32px] justify-center px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                seniorMode
                  ? "bg-samriddhi-bright text-black ring-2 ring-white"
                  : "bg-sovereign-light hover:bg-sovereign-accent text-white"
              }`}
              title="Toggle High-Contrast Senior Citizen Accessibility Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{seniorMode ? t.seniorModeOn : t.seniorModeOff}</span>
            </button>

            {/* Language Selector with all 13 Indic Languages */}
            <div className="flex items-center gap-1 bg-sovereign-light rounded px-2.5 py-0.5 min-h-[32px]">
              <Languages className="w-3.5 h-3.5 text-saffron" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer font-bold"
                aria-label="Select Indic Language"
              >
                <option value="en-IN" className="bg-slate-900 text-white">English (English)</option>
                <option value="hi-IN" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
                <option value="te-IN" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="ta-IN" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="kn-IN" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                <option value="ml-IN" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
                <option value="mr-IN" className="bg-slate-900 text-white">मराठी (Marathi)</option>
                <option value="bn-IN" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
                <option value="gu-IN" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
                <option value="pa-IN" className="bg-slate-900 text-white">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="or-IN" className="bg-slate-900 text-white">ଓଡ଼ିଆ (Odia)</option>
                <option value="as-IN" className="bg-slate-900 text-white">অসমীয়া (Assamese)</option>
                <option value="ur-IN" className="bg-slate-900 text-white">اردو (Urdu)</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- MOBILE COMPACT SINGLE-ROW BAR (< md) --- */}
        <div className="md:hidden flex items-center justify-between h-14 px-3.5 bg-sovereign-navy">
          {/* Logo on Left */}
          <Link prefetch={true} href="/" className="flex items-center gap-2 group shrink-0 min-h-[44px]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron via-samriddhi-gold to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 text-sovereign-darkest font-bold" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base font-black tracking-tight text-white">Jan-EPF</span>
              <span className="text-base font-black text-saffron">AI</span>
              <span className="text-[9px] uppercase tracking-widest px-1 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                2.0
              </span>
            </div>
          </Link>

          {/* Clean Touch Action Group on Right */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Senior Mode Toggle Icon */}
            <button
              onClick={() => setSeniorMode((prev) => !prev)}
              aria-label="Toggle Senior Mode"
              title="Toggle Senior Mode"
              className={`p-2 rounded-xl transition-all min-h-[40px] min-w-[40px] flex items-center justify-center ${
                seniorMode
                  ? "bg-samriddhi-bright text-black ring-2 ring-white"
                  : "bg-sovereign-light/80 text-white hover:bg-sovereign-accent"
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Light / Dark Mode Toggle Icon */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              className="p-2 rounded-xl bg-sovereign-light/80 text-white hover:bg-sovereign-accent transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-300" />
              )}
            </button>

            {/* Persona Switcher Quick Pill */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setPersonaDropdownOpen((prev) => !prev)}
                title={`Logged in as ${activeCitizen.full_name}`}
                aria-label={`Switch persona: ${activeCitizen.full_name}`}
                className="flex items-center gap-1 bg-sovereign-light/90 border border-sovereign-accent px-2 py-1.5 rounded-xl hover:border-saffron transition-all text-left min-h-[40px]"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-white max-w-[65px] truncate">
                  {activeCitizen.full_name.split(" ")[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${personaDropdownOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <button
                onClick={() => login("100982348712")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black bg-saffron text-sovereign-darkest shadow transition-all min-h-[40px]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Demo</span>
              </button>
            )}

            {/* Hamburger / Quick Actions Drawer Trigger */}
            <button
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              aria-label="Open Navigation Drawer"
              className="p-2 rounded-xl bg-sovereign-light/80 hover:bg-sovereign-accent text-slate-200 hover:text-white transition-all min-h-[40px] min-w-[40px] flex items-center justify-center border border-sovereign-accent/60"
            >
              {mobileDrawerOpen ? (
                <X className="w-4 h-4 text-rose-300" />
              ) : (
                <Menu className="w-4 h-4 text-saffron" />
              )}
            </button>
          </div>
        </div>

        {/* --- DESKTOP TIER 2: Main Navbar (Hidden on Mobile) --- */}
        <div className="hidden md:block w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16 gap-4 lg:gap-8">
            {/* Logo & Subtitle */}
            <Link prefetch={true} href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-h-[44px]">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-saffron via-samriddhi-gold to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-sovereign-darkest font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">Jan-EPF</span>
                  <span className="text-lg sm:text-xl font-extrabold text-saffron">AI</span>
                  <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                    SOVEREIGN 2.0
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 hidden lg:block">
                  Rebuilding India's Provident Fund Digital Infrastructure
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center space-x-1 lg:space-x-2 flex-1 justify-center">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    prefetch={true}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all min-h-[44px] whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-saffron text-sovereign-darkest font-bold shadow-md"
                        : "text-slate-200 hover:bg-sovereign-light hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Cluster: Search + Evaluator Tour + Persona Switcher */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setCommandCenterOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sovereign-light/80 hover:bg-sovereign-light text-slate-300 hover:text-white border border-sovereign-accent text-xs transition-all shadow-sm min-h-[44px]"
                title="Open Command Center (⌘K)"
                aria-label="Open Command Center"
              >
                <Search className="w-3.5 h-3.5 text-saffron" />
                <span className="text-xs font-semibold">Search</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-sovereign-darkest text-slate-400 rounded border border-sovereign-accent/60">
                  ⌘K
                </kbd>
              </button>

              {/* Single Authoritative Judges 60s Tour Button */}
              <EvaluatorTourModal />

              {!isAuthenticated ? (
                <button
                  onClick={() => login("100982348712")}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-saffron text-sovereign-darkest hover:bg-amber-400 shadow-md transition-all animate-pulse min-h-[44px]"
                  title="Log in instantly as Ramesh Kumar"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>1-Click Demo Login</span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPersonaDropdownOpen((prev) => !prev)}
                    title={`CITIZEN REDESIGN PROTOTYPE | SIMULATED UAN: ${activeCitizen.uan}`}
                    aria-label={`CITIZEN REDESIGN PROTOTYPE | SIMULATED UAN: ${activeCitizen.uan}`}
                    className="flex items-center gap-2 bg-sovereign-light border border-sovereign-accent px-3 py-1.5 rounded-lg hover:border-saffron transition-all text-left min-h-[44px]"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{activeCitizen.full_name}</span>
                        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${personaDropdownOpen ? "rotate-180" : ""}`} />
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono">
                        UAN: {activeCitizen.uan.slice(0, 4)}••••{activeCitizen.uan.slice(-4)}
                      </div>
                    </div>
                  </button>

                  {/* Desktop Rich Persona Dropdown */}
                  {personaDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-3 py-1.5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                          Switch Citizen Persona
                        </span>
                        <button
                          onClick={() => {
                            setPersonaDropdownOpen(false);
                            logout();
                          }}
                          className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1 min-h-[32px]"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Logout / Gateway</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        {citizens.map((c) => {
                          const isSelected = activeCitizen.uan === c.uan;
                          const scenarioTag =
                            c.uan === "100982348712"
                              ? "Form 31 Advance"
                              : c.uan === "101294817203"
                              ? "Form 13 Job Switch"
                              : c.uan === "100112233445"
                              ? "Senior Pensioner"
                              : "e-Nomination / KYC";

                          return (
                            <button
                              key={c.uan}
                              onClick={() => {
                                switchCitizen(c.uan);
                                setPersonaDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl flex flex-col gap-1 transition-all min-h-[44px] ${
                                isSelected
                                  ? "bg-sovereign-navy text-white font-bold ring-2 ring-saffron/50 shadow-sm"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="font-bold text-xs flex items-center gap-1.5">
                                  <span>{c.full_name}</span>
                                  {isSelected && <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-bold">Active</span>}
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  isSelected ? "bg-white/20 text-saffron" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                }`}>
                                  {scenarioTag}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-[10px]">
                                <span className={isSelected ? "text-slate-300 truncate max-w-[160px]" : "text-slate-500 dark:text-slate-400 truncate max-w-[160px]"}>
                                  {c.active_employment ? c.active_employment.establishment_name : c.pension_details ? "EPS-95 Pensioner" : "Gig / Unorganized Worker"}
                                </span>
                                <span className="font-mono font-semibold">
                                  ₹{(c.passbook_summary.total_balance || (c.pension_details ? c.pension_details.monthly_pension_amount : 0)).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 rounded-b-2xl">
                        <button
                          onClick={() => {
                            resetAllData();
                            setPersonaDropdownOpen(false);
                          }}
                          className="w-full py-2 px-3 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-rose-200 dark:border-rose-800"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset All Demo Claims & Balances</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- DESKTOP TIER 3: Live Sovereign DPI Pulse Ticker (Hidden on Mobile) --- */}
        <div className="hidden md:block">
          <LiveSovereignPulse />
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE PERSONA SWITCHER POPUP (Fixed on Mobile Screens)
         ========================================================================= */}
      {personaDropdownOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 w-full max-w-sm max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="px-2 py-2 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-saffron">
                Switch Citizen Persona
              </span>
              <button
                onClick={() => setPersonaDropdownOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {citizens.map((c) => {
                const isSelected = activeCitizen.uan === c.uan;
                const scenarioTag =
                  c.uan === "100982348712"
                    ? "Form 31 Advance"
                    : c.uan === "101294817203"
                    ? "Form 13 Transfer"
                    : c.uan === "100112233445"
                    ? "Pensioner"
                    : "KYC / EDLI";

                return (
                  <button
                    key={c.uan}
                    onClick={() => {
                      switchCitizen(c.uan);
                      setPersonaDropdownOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl flex flex-col gap-1 transition-all min-h-[48px] ${
                      isSelected
                        ? "bg-sovereign-navy text-white font-bold ring-2 ring-saffron shadow-md"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>{c.full_name}</span>
                        {isSelected && <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-bold">Active</span>}
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? "bg-white/20 text-saffron" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        {scenarioTag}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className={isSelected ? "text-slate-300 truncate max-w-[170px]" : "text-slate-500 dark:text-slate-400 truncate max-w-[170px]"}>
                        {c.active_employment ? c.active_employment.establishment_name : c.pension_details ? "EPS-95 Pensioner" : "Gig / Unorganized Worker"}
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{(c.passbook_summary.total_balance || (c.pension_details ? c.pension_details.monthly_pension_amount : 0)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setPersonaDropdownOpen(false);
                  logout();
                }}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Return to Login Gateway</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MOBILE SLIDE-OVER DRAWER (For Menu / ⌘K / Tools / 13 Languages)
         ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div className="w-[85vw] max-w-sm bg-[#060d17] text-white h-full p-4 overflow-y-auto border-l border-slate-800 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            
            <div className="space-y-4">
              {/* Drawer Top Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-saffron text-slate-950 flex items-center justify-center font-black">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Sovereign Controls</h3>
                    <p className="text-[10px] text-slate-400">Jan-EPF AI Mobile Workspace</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active Citizen Card */}
              {isAuthenticated && (
                <div className="p-3 rounded-2xl bg-sovereign-navy/90 border border-sovereign-light space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{activeCitizen.full_name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        UAN: {activeCitizen.uan}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      Active
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-700/60 flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Total Corpus:</span>
                    <strong className="text-emerald-400 font-bold">
                      ₹{(activeCitizen.passbook_summary.total_balance || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              )}

              {/* Fast Action Buttons (Judges Tour, ⌘K, Chaos, Architecture) */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-saffron">
                  Evaluator & SRE Tools
                </p>

                {/* 1-Click Launch Judges 60s Tour Modal */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    const tourTrigger = document.querySelector("[title*='Judges']");
                    if (tourTrigger instanceof HTMLElement) tourTrigger.click();
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-between shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>⚡ Judges 60s Guided Tour</span>
                  </span>
                  <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded">6 Scenarios</span>
                </button>

                {/* ⌘K Command Center Trigger */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setCommandCenterOpen(true);
                  }}
                  className="w-full py-2 px-3 bg-[#1e293b] hover:bg-[#334155] text-slate-100 text-xs font-bold rounded-xl flex items-center justify-between border border-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-saffron" />
                    <span>Command Center Omnibar</span>
                  </span>
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">⌘K</kbd>
                </button>

                {/* Chaos Simulator Trigger */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setChaosModalOpen(true);
                  }}
                  className="w-full py-2 px-3 bg-[#1e293b] hover:bg-[#334155] text-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-700"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chaos Simulator Sandbox</span>
                </button>

                {/* Architecture Inspector Trigger */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setArchitectureModalOpen(true);
                  }}
                  className="w-full py-2 px-3 bg-[#1e293b] hover:bg-[#334155] text-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-700"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Architecture & Token Inspector</span>
                </button>
              </div>

              {/* Extra Hub Pages */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Infrastructure & Proofs
                </p>
                <Link
                  href="/benchmarks"
                  prefetch={true}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                    pathname === "/benchmarks"
                      ? "bg-saffron text-slate-950 font-bold"
                      : "bg-[#0f172a] text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Benchmarks & Latency Matrix</span>
                </Link>

                <Link
                  href="/architecture"
                  prefetch={true}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`w-full py-2 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                    pathname === "/architecture"
                      ? "bg-saffron text-slate-950 font-bold"
                      : "bg-[#0f172a] text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sovereign Architecture Spec</span>
                </Link>
              </div>

              {/* 13 Indic Language Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Languages className="w-3 h-3 text-saffron" />
                  <span>Indic Language ({language})</span>
                </p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-saffron cursor-pointer"
                >
                  <option value="en-IN">English (English)</option>
                  <option value="hi-IN">हिन्दी (Hindi)</option>
                  <option value="te-IN">తెలుగు (Telugu)</option>
                  <option value="ta-IN">தமிழ் (Tamil)</option>
                  <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml-IN">മലയാളം (Malayalam)</option>
                  <option value="mr-IN">मराठी (Marathi)</option>
                  <option value="bn-IN">বাংলা (Bengali)</option>
                  <option value="gu-IN">ગુજરાતી (Gujarati)</option>
                  <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="or-IN">ଓଡ଼ିଆ (Odia)</option>
                  <option value="as-IN">অসমীয়া (Assamese)</option>
                  <option value="ur-IN">اردو (Urdu)</option>
                </select>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2 mt-4">
              <button
                onClick={() => {
                  if (window.confirm("Reset all test claims, balances, and mock accounts to initial clean state?")) {
                    resetAllData();
                    setMobileDrawerOpen(false);
                  }
                }}
                className="w-full py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-rose-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Demo State</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Logout / Gateway</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. SLEEK MOBILE BOTTOM NAVIGATION BAR (< md)
             - Fixed at the bottom of the viewport
             - 5 core touch hubs: Home, Money, Career, Savings, Fix KYC
             - Styled like modern high-speed UPI & Banking apps (Google Pay)
         ========================================================================= */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#001226]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-safe"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {mobileBottomTabs.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex flex-col items-center justify-center py-1 relative transition-all duration-150 min-h-[48px] rounded-2xl select-none ${
                  isActive
                    ? "text-saffron font-black bg-saffron/10 scale-105"
                    : "text-slate-400 hover:text-slate-200 font-semibold active:scale-95"
                }`}
              >
                {/* Active Luminous Top Bar Indicator */}
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-saffron rounded-full shadow-[0_0_10px_#ff9933]" />
                )}

                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span className="text-[10px] tracking-tight mt-0.5 leading-none truncate max-w-[62px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* =========================================================================
          5. MODAL WRAPPERS & COMMAND CENTER
         ========================================================================= */}
      {/* Cmd+K Omnibar Command Center Modal */}
      <CommandCenter
        isOpen={commandCenterOpen}
        onClose={() => setCommandCenterOpen(false)}
        onOpenChaosSimulator={() => setChaosModalOpen(true)}
      />

      {/* Live Zero-Rejection Chaos Simulator Sandbox Modal */}
      <ChaosSimulatorModal
        isOpen={chaosModalOpen}
        onClose={() => setChaosModalOpen(false)}
      />

      {/* Sovereign AI & Token Economics Inspector Modal */}
      <ArchitectureInspectorModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />
    </>
  );
};
