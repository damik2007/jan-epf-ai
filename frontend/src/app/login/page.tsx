"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Shield,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Building2,
  Coins,
  HeartHandshake,
  Zap
} from "lucide-react";

export default function LoginPage() {
  const { citizens, switchCitizen, activeCitizen } = useCitizen();
  const router = useRouter();
  const [uanInput, setUanInput] = useState<string>("100982348712");
  const [pinInput, setPinInput] = useState<string>("1234");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const personaScenarios = [
    {
      uan: "100982348712",
      name: "Ramesh Kumar (Age 48)",
      role: "Factory Machine Operator",
      org: "Precision Auto Components Pvt Ltd (8.2 yrs)",
      balance: "₹3,42,500",
      badge: "Form 31 Advance",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      testScenario: "Tests: Emergency Medical / Housing advance (Para 68J) with instant Canvas Cheque OCR pre-validation.",
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
      balance: "₹4,250 / mo",
      badge: "Senior Pensioner",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      testScenario: "Tests: High-contrast Senior Citizen Mode (150% scaling, black/yellow palette) and EPS-95 monthly pension ledgers.",
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
    switchCitizen(uan);
    setTimeout(() => {
      setLoggingIn(false);
      router.push("/");
    }, 400);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    switchCitizen(uanInput);
    setTimeout(() => {
      setLoggingIn(false);
      router.push("/");
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>HACKATHON EVALUATOR LOGIN PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sovereign-navy tracking-tight">
          Select a Mock Citizen Persona to Test
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Per Varun Mayya's hackathon guidelines, testing does not require real citizen Aadhaar or SMS OTPs.
          Click any persona below to immediately log in and test all 8 end-to-end workflows.
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
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sovereign-navy text-white flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5 text-saffron" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-sovereign-navy flex items-center gap-1.5">
                        <span>{persona.name}</span>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </h2>
                      <p className="text-xs text-slate-500">{persona.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${persona.badgeColor}`}>
                    {persona.badge}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Establishment:</span>
                    <strong className="text-slate-800 truncate max-w-[180px]">{persona.org}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Simulated UAN:</span>
                    <strong className="font-mono text-slate-900">{persona.uan}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Current Corpus:</span>
                    <strong className="font-mono text-emerald-700 font-bold">{persona.balance}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                  💡 {persona.testScenario}
                </p>
              </div>

              <button
                type="button"
                className="mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-sovereign-navy text-white hover:bg-sovereign-light flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>1-Click Demo Login as {persona.name.split(" ")[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-saffron" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual / Standard Login Form Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <KeyRound className="w-5 h-5 text-sovereign-navy" />
          <h2 className="text-sm font-bold text-slate-800">
            Standard Citizen / Passkey Login (Pre-Filled)
          </h2>
        </div>

        <form onSubmit={handleManualLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Universal Account Number (UAN)
            </label>
            <input
              type="text"
              value={uanInput}
              onChange={(e) => setUanInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sovereign-navy outline-none"
              placeholder="Enter 12-digit UAN"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Passkey / Demo PIN (Auto-Verified)
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sovereign-navy outline-none"
              placeholder="PIN"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-gradient-to-r from-sovereign-navy to-sovereign-light text-white font-bold rounded-xl text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loggingIn ? (
                <span>Logging In Instantly...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-saffron" />
                  <span>Secure 1-Click Instant Login</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-400 text-center">
          🔒 Zero-Trust Mock Sandbox • No SMS OTP required for Hackathon evaluation.
        </p>
      </div>
    </div>
  );
}
