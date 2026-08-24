"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
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
  LogOut
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
    toggleTheme
  } = useCitizen();

  const t = getTranslation(language);

  const [commandCenterOpen, setCommandCenterOpen] = React.useState(false);
  const [chaosModalOpen, setChaosModalOpen] = React.useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    {
      label: t.navMoney,
      href: "/money",
      icon: Wallet
    },
    {
      label: t.navCareer,
      href: "/career",
      icon: Briefcase
    },
    {
      label: t.navSavings,
      href: "/savings",
      icon: PiggyBank
    },
    {
      label: t.navFix,
      href: "/fix",
      icon: Wrench
    },
    {
      label: "Benchmarks",
      href: "/benchmarks",
      icon: Activity
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sovereign-navy text-white shadow-lg border-b border-sovereign-light transition-all">
      {/* 1. Top Sovereign Ticker Bar - Full Width with Generous Spacing */}
      <div className="w-full bg-sovereign-darkest border-b border-sovereign-navy/50 px-4 sm:px-6 lg:px-10 py-1.5 text-xs flex flex-wrap gap-2 justify-between items-center text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-saffron animate-pulse shrink-0" />
          <span className="font-bold text-saffron text-[10px] sm:text-xs tracking-wider uppercase">
            PROTOTYPE PROOF-OF-CONCEPT
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300 text-xs">
            Build What Moves India Hackathon (Varun Mayya × OpenAI)
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 justify-center px-2 py-1 sm:py-0.5 rounded text-xs font-bold transition-all bg-sovereign-light hover:bg-sovereign-accent text-white"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-300" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Senior Mode Toggle */}
          <button
            onClick={() => setSeniorMode((prev) => !prev)}
            className={`flex items-center gap-1 min-h-[44px] sm:min-h-0 justify-center px-2.5 py-1 sm:py-0.5 rounded text-xs font-bold transition-all ${
              seniorMode
                ? "bg-samriddhi-bright text-black ring-2 ring-white"
                : "bg-sovereign-light hover:bg-sovereign-accent text-white"
            }`}
            title="Toggle High-Contrast Senior Citizen Accessibility Mode"
          >
            <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{seniorMode ? t.seniorModeOn : t.seniorModeOff}</span>
          </button>

          {/* Language Selector with all 13 Indic Languages */}
          <div className="flex items-center gap-1 bg-sovereign-light rounded px-2.5 py-1 sm:py-0.5 min-h-[44px] sm:min-h-0">
            <Languages className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-saffron" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-xs sm:text-[11px] md:text-xs border-none focus:outline-none cursor-pointer font-bold"
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

      {/* 2. Main Navbar - Full Width with Generous Spacing */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16 gap-4 lg:gap-8">
          {/* Logo & Subtitle */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-h-[44px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-saffron via-samriddhi-gold to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-sovereign-darkest font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">Jan-EPF</span>
                <span className="text-lg sm:text-xl font-extrabold text-saffron">AI</span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                  SOVEREIGN 2.0
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 hidden md:block">
                Rebuilding India's Provident Fund Digital Infrastructure
              </p>
            </div>
          </Link>

          {/* 5 Topic Hub Navigation Links - Centered & Spacious */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                    isActive
                      ? "bg-saffron text-sovereign-darkest font-bold shadow-md"
                      : "text-slate-200 hover:bg-sovereign-light hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Cluster: Search + Single Judges Tour + Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setCommandCenterOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sovereign-light/80 hover:bg-sovereign-light text-slate-300 hover:text-white border border-sovereign-accent text-xs transition-all shadow-sm min-h-[44px]"
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
              <div className="relative group">
                <button
                  type="button"
                  title={`CITIZEN REDESIGN PROTOTYPE | SIMULATED UAN: ${activeCitizen.uan}`}
                  aria-label={`CITIZEN REDESIGN PROTOTYPE | SIMULATED UAN: ${activeCitizen.uan}`}
                  className="flex items-center gap-2 bg-sovereign-light border border-sovereign-accent px-3 py-1.5 rounded-lg hover:border-saffron transition-all text-left min-h-[44px]"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{activeCitizen.full_name}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      UAN: {activeCitizen.uan.slice(0, 4)}••••{activeCitizen.uan.slice(-4)}
                    </div>
                  </div>
                </button>

                {/* Rich Persona Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Switch Citizen Persona
                    </span>
                    <button
                      onClick={logout}
                      className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1 min-h-[44px]"
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
                          onClick={() => switchCitizen(c.uan)}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Live Sovereign DPI Pulse Ticker */}
      <LiveSovereignPulse />

      {/* Mobile Navigation Sub-Bar (Horizontal Scroll) */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-sovereign-darkest border-t border-sovereign-navy gap-2 scrollbar-none w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap font-medium min-h-[44px] transition-all ${
                isActive
                  ? "bg-saffron text-sovereign-darkest font-bold shadow-sm"
                  : "text-slate-300 bg-sovereign-light/50 hover:bg-sovereign-light"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

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
    </header>
  );
};
