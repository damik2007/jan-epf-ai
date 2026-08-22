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
  Moon
} from "lucide-react";

import { getTranslation } from "@/lib/translations";
import { EvaluatorTourModal } from "@/components/EvaluatorTourModal";

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

  const navItems = [
    {
      label: t.navMoney,
      href: "/money",
      icon: Wallet,
      badge: "Para 68"
    },
    {
      label: t.navCareer,
      href: "/career",
      icon: Briefcase,
      badge: "Form 13"
    },
    {
      label: t.navSavings,
      href: "/savings",
      icon: PiggyBank,
      badge: "8.25%"
    },
    {
      label: t.navFix,
      href: "/fix",
      icon: Wrench,
      badge: "Penny Drop"
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sovereign-navy text-white shadow-lg border-b border-sovereign-light">
      {/* Top Sovereign Bar */}
      <div className="bg-sovereign-darkest border-b border-sovereign-navy/50 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-saffron animate-pulse" />
          <span className="font-semibold text-saffron tracking-wide">
            PROTOTYPE PROOF-OF-CONCEPT
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">Build What Moves India Hackathon (Varun Mayya × OpenAI)</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold transition-all bg-sovereign-light hover:bg-sovereign-accent text-white"
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

          {/* Senior Mode Toggle Button */}
          <button
            onClick={() => setSeniorMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
              seniorMode
                ? "bg-samriddhi-bright text-black ring-2 ring-white"
                : "bg-sovereign-light hover:bg-sovereign-accent text-white"
            }`}
            title="Toggle High-Contrast Senior Citizen Accessibility Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{seniorMode ? t.seniorModeOn : t.seniorModeOff}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-sovereign-light rounded px-2 py-0.5">
            <Languages className="w-3.5 h-3.5 text-saffron" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer font-bold"
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
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron via-samriddhi-gold to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-sovereign-darkest font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">Jan-EPF</span>
                <span className="text-xl font-extrabold text-saffron">AI</span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                  Sovereign 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Rebuilding India's Provident Fund Digital Infrastructure
              </p>
            </div>
          </Link>

          {/* 4 Topic Hub Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
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

          {/* Persona Switcher & Active Citizen Badge & Evaluator Tour */}
          <div className="flex items-center gap-2">
            <EvaluatorTourModal />

            {!isAuthenticated ? (
              <button
                onClick={() => login("100982348712")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-saffron text-sovereign-darkest hover:bg-amber-400 shadow-md transition-all animate-pulse"
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
                  className="flex items-center gap-2 bg-sovereign-light border border-sovereign-accent px-3 py-1.5 rounded-lg hover:border-saffron transition-all text-left"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{activeCitizen.full_name}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
                    </div>
                    <div className="text-[10px] text-slate-300">
                      UAN: {activeCitizen.uan.slice(0, 4)}••••{activeCitizen.uan.slice(-4)}
                    </div>
                  </div>
                </button>

                {/* Rich Persona Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-84 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Switch Citizen Persona
                    </span>
                    <button
                      onClick={logout}
                      className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline"
                    >
                      Logout / Gateway
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
                          className={`w-full text-left p-2.5 rounded-xl flex flex-col gap-1 transition-all ${
                            isSelected
                              ? "bg-sovereign-navy text-white font-bold ring-2 ring-saffron/50 shadow-sm"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-bold text-xs flex items-center gap-1.5">
                              <span>{c.full_name}</span>
                              {isSelected && <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-white rounded font-bold">Active</span>}
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                              isSelected ? "bg-white/20 text-saffron" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}>
                              {scenarioTag}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px]">
                            <span className={isSelected ? "text-slate-300 truncate max-w-[160px]" : "text-slate-500 dark:text-slate-400 truncate max-w-[160px]"}>
                              {c.active_employment ? c.active_employment.establishment_name : c.pension_details ? `EPS-95 Pensioner` : "Gig / Unorganized Worker"}
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

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex overflow-x-auto px-2 py-2 bg-sovereign-darkest/90 border-t border-sovereign-navy gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                isActive
                  ? "bg-saffron text-sovereign-darkest font-bold"
                  : "text-slate-300 bg-sovereign-light/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
