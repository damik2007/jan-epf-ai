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
  ChevronDown
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    citizens,
    activeCitizen,
    switchCitizen,
    language,
    setLanguage,
    seniorMode,
    setSeniorMode
  } = useCitizen();

  const navItems = [
    {
      label: "I Need Money",
      labelHi: "पैसे चाहिए",
      labelTe: "డబ్బులు కావాలి",
      labelTa: "பணம் தேவை",
      href: "/money",
      icon: Wallet,
      badge: "Para 68"
    },
    {
      label: "I Changed Jobs",
      labelHi: "नौकरी बदली",
      labelTe: "ఉద్యోగం మారాను",
      labelTa: "வேலை மாற்றம்",
      href: "/career",
      icon: Briefcase,
      badge: "Form 13"
    },
    {
      label: "My Savings",
      labelHi: "मेरी बचत",
      labelTe: "నా పొదుపు",
      labelTa: "என் சேமிப்பு",
      href: "/savings",
      icon: PiggyBank,
      badge: "8.25%"
    },
    {
      label: "Fix My Details",
      labelHi: "विवरण ठीक करें",
      labelTe: "వివరాలు సరిదిద్దండి",
      labelTa: "திருத்தம்",
      href: "/fix",
      icon: Wrench,
      badge: "Penny Drop"
    }
  ];

  const getLocalizedLabel = (item: typeof navItems[0]) => {
    if (language === "hi-IN") return item.labelHi;
    if (language === "te-IN") return item.labelTe;
    if (language === "ta-IN") return item.labelTa;
    return item.label;
  };

  return (
    <header className="sticky top-0 z-50 bg-sovereign-navy text-white shadow-lg border-b border-sovereign-light">
      {/* Top Sovereign Bar */}
      <div className="bg-sovereign-darkest border-b border-sovereign-navy/50 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-saffron animate-pulse" />
          <span className="font-semibold text-saffron tracking-wide">
            GOVERNMENT OF INDIA • DIGITAL PUBLIC INFRASTRUCTURE
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">EPFO Modernization Prototype (70 Million Citizens)</span>
        </div>

        <div className="flex items-center gap-4">
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
            <span>Senior Mode: {seniorMode ? "ON" : "OFF"}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-sovereign-light rounded px-2 py-0.5">
            <Languages className="w-3.5 h-3.5 text-saffron" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer"
            >
              <option value="en-IN" className="bg-slate-900 text-white">English</option>
              <option value="hi-IN" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
              <option value="te-IN" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
              <option value="ta-IN" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
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
                  <span>{getLocalizedLabel(item)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Persona Switcher & Active Citizen Badge */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="flex items-center gap-2 bg-sovereign-light border border-sovereign-accent px-3 py-1.5 rounded-lg cursor-pointer hover:border-saffron transition-all">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{activeCitizen.full_name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-300">
                    UAN: {activeCitizen.uan.slice(0, 4)}••••{activeCitizen.uan.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Persona Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Switch Test Citizen Persona
                </div>
                {citizens.map((c) => (
                  <button
                    key={c.uan}
                    onClick={() => switchCitizen(c.uan)}
                    className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      activeCitizen.uan === c.uan
                        ? "bg-sovereign-navy text-white font-bold"
                        : "hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{c.full_name}</div>
                      <div className={activeCitizen.uan === c.uan ? "text-slate-300 text-[10px]" : "text-slate-500 text-[10px]"}>
                        {c.active_employment ? c.active_employment.establishment_name : c.pension_details ? `Senior Pensioner (${c.pension_details.scheme})` : "Gig / Unorganized Worker"}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">
                      ₹{(c.passbook_summary.total_balance || 0).toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
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
              <span>{getLocalizedLabel(item)}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
