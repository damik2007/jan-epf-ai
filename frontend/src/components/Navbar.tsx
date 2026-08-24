"use client";

import React, { useState, useEffect } from "react";
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
  Cpu,
  LogOut
} from "lucide-react";

import { getTranslation } from "@/lib/translations";
import { EvaluatorTourModal } from "@/components/EvaluatorTourModal";
import { CommandCenter } from "@/components/CommandCenter";
import { ChaosSimulatorModal } from "@/components/ChaosSimulatorModal";
import { ArchitectureInspectorModal } from "@/components/ArchitectureInspectorModal";

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

  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [chaosModalOpen, setChaosModalOpen] = useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  useEffect(() => {
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
    { label: t.navMoney, href: "/money", icon: Wallet },
    { label: t.navCareer, href: "/career", icon: Briefcase },
    { label: t.navSavings, href: "/savings", icon: PiggyBank },
    { label: t.navFix, href: "/fix", icon: Wrench },
    { label: "Benchmarks", href: "/benchmarks", icon: Activity }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-md transition-all">
      {/* Primary Unified 64px Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron via-samriddhi-gold to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-sovereign-darkest font-bold" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-white">Jan-EPF</span>
            <span className="text-lg font-black text-saffron">AI</span>
            <span className="hidden sm:inline-flex text-[9px] uppercase font-mono font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Sovereign 2.0
            </span>
          </div>
        </Link>

        {/* Center: Desktop Hub Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-saffron text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Actions, Toggles & Persona Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Tour Modal Button */}
          <EvaluatorTourModal />

          {/* Search (⌘K) */}
          <button
            onClick={() => setCommandCenterOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white border border-slate-700 text-xs transition-all"
            title="Open Command Center (⌘K)"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 text-saffron" />
            <kbd className="text-[10px] font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-700 text-slate-400">⌘K</kbd>
          </button>

          {/* Senior Mode Toggle */}
          <button
            onClick={() => setSeniorMode((prev) => !prev)}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              seniorMode
                ? "bg-samriddhi-bright text-slate-950 ring-2 ring-white"
                : "bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            }`}
            title="Toggle High-Contrast Senior Citizen Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">{seniorMode ? "Senior: ON" : "Senior"}</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-300" />}
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-800/70 border border-slate-700 rounded-lg px-1.5 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-saffron shrink-0 mr-1" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer font-semibold max-w-[70px] sm:max-w-[90px] truncate"
            >
              <option value="en-IN" className="bg-slate-900 text-white">EN</option>
              <option value="hi-IN" className="bg-slate-900 text-white">हिन्दी</option>
              <option value="te-IN" className="bg-slate-900 text-white">తెలుగు</option>
              <option value="ta-IN" className="bg-slate-900 text-white">தமிழ்</option>
              <option value="kn-IN" className="bg-slate-900 text-white">ಕನ್ನಡ</option>
              <option value="mr-IN" className="bg-slate-900 text-white">मराठी</option>
              <option value="pa-IN" className="bg-slate-900 text-white">ਪੰਜਾਬੀ</option>
            </select>
          </div>

          {/* Developer Tools Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setToolsDropdownOpen((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1 text-xs font-semibold"
              title="Developer Sandbox & Architecture Tools"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {toolsDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-1"
                onClick={() => setToolsDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold text-slate-400">Developer & Judge Tools</div>
                <button
                  onClick={() => setChaosModalOpen(true)}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-2 text-amber-300"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stress-Test Chaos Sandbox</span>
                </button>
                <button
                  onClick={() => setArchitectureModalOpen(true)}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-2 text-emerald-300"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sovereign Token Economics</span>
                </button>
              </div>
            )}
          </div>

          {/* Persona Switcher Dropdown */}
          {!isAuthenticated ? (
            <button
              onClick={() => login("100982348712")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-saffron text-slate-950 hover:bg-amber-400 shadow-md transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Demo Login</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-xl hover:border-saffron transition-all text-left shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {activeCitizen.full_name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1 leading-tight">
                    <span className="truncate max-w-[100px]">{activeCitizen.full_name.split(" ")[0]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 leading-tight">
                    {activeCitizen.uan.slice(-4)}
                  </div>
                </div>
              </button>

              {/* Rich Persona Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-72 sm:w-80 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 flex justify-between items-center border-b border-slate-800 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Switch Mock Persona
                  </span>
                  <button
                    onClick={logout}
                    className="text-[10px] text-rose-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="space-y-1">
                  {citizens.map((c) => {
                    const isSelected = activeCitizen.uan === c.uan;
                    const scenarioTag =
                      c.uan === "100982348712"
                        ? "Advance"
                        : c.uan === "101294817203"
                        ? "Transfer"
                        : c.uan === "100112233445"
                        ? "Pensioner"
                        : "KYC / Nominee";

                    return (
                      <button
                        key={c.uan}
                        onClick={() => switchCitizen(c.uan)}
                        className={`w-full text-left p-2 rounded-xl flex flex-col gap-0.5 transition-all ${
                          isSelected
                            ? "bg-slate-800 text-white font-bold ring-1 ring-saffron/60 shadow-sm"
                            : "hover:bg-slate-800/50 text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-white">{c.full_name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            isSelected ? "bg-saffron text-slate-950" : "bg-slate-800 text-slate-400"
                          }`}>
                            {scenarioTag}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="truncate max-w-[140px]">
                            {c.active_employment?.establishment_name || "EPS-95 Pensioner"}
                          </span>
                          <span className="font-mono text-emerald-400 font-semibold">
                            ₹{(c.passbook_summary?.total_balance || c.pension_details?.monthly_pension_amount || 0).toLocaleString("en-IN")}
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

      {/* Mobile Sub-Row for the 5 Action Hubs */}
      <div className="md:hidden flex overflow-x-auto px-2 py-1.5 bg-slate-950/80 border-t border-slate-800/60 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? "bg-saffron text-slate-950 font-bold shadow-sm"
                  : "text-slate-300 hover:text-white bg-slate-800/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Cmd+K Omnibar Modal */}
      <CommandCenter
        isOpen={commandCenterOpen}
        onClose={() => setCommandCenterOpen(false)}
        onOpenChaosSimulator={() => setChaosModalOpen(true)}
      />

      {/* Chaos Simulator Sandbox Modal */}
      <ChaosSimulatorModal
        isOpen={chaosModalOpen}
        onClose={() => setChaosModalOpen(false)}
      />

      {/* Architecture & Token Economics Inspector Modal */}
      <ArchitectureInspectorModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />
    </header>
  );
};
