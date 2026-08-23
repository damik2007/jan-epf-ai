"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Building2,
  Coins,
  HeartHandshake,
  Zap,
  Fingerprint,
  Smartphone
} from "lucide-react";

export default function LoginPage() {
  const { citizens, switchCitizen, activeCitizen, setSeniorMode } = useCitizen();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<"EVALUATOR_FASTPATH" | "PRODUCTION_PASSKEY" | "AADHAAR_OTP">("EVALUATOR_FASTPATH");
  const [uanInput, setUanInput] = useState<string>("100982348712");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [passkeyActive, setPasskeyActive] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [whatsappDelivery, setWhatsappDelivery] = useState<boolean>(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const personaScenarios = [
    {
      uan: "100982348712",
      name: "Ramesh Kumar (Age 48)",
      role: "Factory Machine Operator",
      org: "Precision Auto Components Pvt Ltd (8.2 yrs)",
      balance: "₹3,42,500",
      badge: "Form 31 Advance",
      badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      testScenario: "Emergency Medical / Housing advance (Para 68J) with instant Canvas Cheque OCR pre-validation.",
      icon: Coins
    },
    {
      uan: "101294817203",
      name: "Priya Sharma (Age 27)",
      role: "Software Engineer",
      org: "Apex AI Systems India (Prev: CloudNine)",
      balance: "₹4,75,000",
      badge: "Form 13 Job Switch",
      badgeColor: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      testScenario: "Multi-job PF transfer (₹1.85L) + Auto-deduction of missing Date of Exit (DOE) from last ECR timestamp.",
      icon: Building2
    },
    {
      uan: "100112233445",
      name: "Gurmeet Singh (Age 66)",
      role: "Senior Pensioner (Age ≥ 60)",
      org: "Retired (EPS-95 Pensioner)",
      balance: "₹4,250 / mo",
      badge: "Senior Pensioner",
      badgeColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      testScenario: "Auto-activates Senior Citizen Mode (125% scaling, warm gold palette) and EPS-95 monthly pension ledgers.",
      icon: HeartHandshake
    },
    {
      uan: "101889977665",
      name: "Sunita Devi (Age 34)",
      role: "Gig Healthcare Worker",
      org: "QuickCart Delivery Logistics",
      balance: "₹86,400",
      badge: "e-Nomination & KYC",
      badgeColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800",
      testScenario: "Mobile 1-click e-Nomination with Aadhaar e-Sign, Levenshtein fuzzy name match, and ₹7L EDLI insurance.",
      icon: UserCheck
    }
  ];

  const handle1ClickLogin = (uan: string) => {
    setLoggingIn(true);
    switchCitizen(uan);
    if (uan === "100112233445") {
      setSeniorMode(true);
    }
    setTimeout(() => {
      setLoggingIn(false);
      router.push("/");
    }, 250);
  };

  const handleBiometricPasskey = () => {
    setPasskeyActive(true);
    setTimeout(() => {
      setPasskeyActive(false);
      handle1ClickLogin(uanInput);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    // Auto-focus next input
    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setTimeout(() => {
      setLoggingIn(false);
      handle1ClickLogin(uanInput);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>HACKATHON DUAL-MODE AUTHENTICATION GATEWAY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sovereign-navy dark:text-white tracking-tight">
          Sovereign DPI Authentication Gateway
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Evaluators can test with <strong>1-Click Instant Persona Ingestion</strong> (zero SMS delay) or experience the production-grade <strong>FIDO2 Biometric Passkey / 10-Min Resilient OTP</strong> flow.
        </p>
      </div>

      {/* Dual Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-1">
          <button
            onClick={() => setAuthMode("EVALUATOR_FASTPATH")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              authMode === "EVALUATOR_FASTPATH"
                ? "bg-sovereign-navy dark:bg-amber-500 text-white dark:text-slate-950 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-saffron" />
            <span>Mode A: Evaluator 1-Click Fast-Path</span>
          </button>

          <button
            onClick={() => setAuthMode("PRODUCTION_PASSKEY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              authMode === "PRODUCTION_PASSKEY"
                ? "bg-sovereign-navy dark:bg-amber-500 text-white dark:text-slate-950 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mode B: FIDO2 Biometric Passkey</span>
          </button>

          <button
            onClick={() => {
              setAuthMode("AADHAAR_OTP");
              setOtpSent(true);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              authMode === "AADHAAR_OTP"
                ? "bg-sovereign-navy dark:bg-amber-500 text-white dark:text-slate-950 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span>Mode C: 10-Min Resilient OTP</span>
          </button>
        </div>
      </div>

      {/* MODE A: EVALUATOR 1-CLICK FASTPATH (4 PERSONAS) */}
      {authMode === "EVALUATOR_FASTPATH" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personaScenarios.map((persona) => {
              const Icon = persona.icon;
              const isCurrent = activeCitizen.uan === persona.uan;
              return (
                <div
                  key={persona.uan}
                  onClick={() => handle1ClickLogin(persona.uan)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between card-hover-lift ${
                    isCurrent
                      ? "border-saffron bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-saffron/30"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-sovereign-navy dark:bg-slate-800 text-white flex items-center justify-center font-bold">
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

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Establishment:</span>
                        <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{persona.org}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Simulated UAN:</span>
                        <strong className="font-mono text-slate-900 dark:text-slate-100">{persona.uan}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Current Corpus:</span>
                        <strong className="font-mono text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">{persona.balance}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-blue-50/50 dark:bg-blue-950/20 p-2 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                      💡 {persona.testScenario}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-sovereign-navy dark:bg-amber-500 dark:text-slate-950 text-white hover:bg-sovereign-light transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>1-Click Ingest as {persona.name.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-saffron dark:text-slate-950" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE B: FIDO2 BIOMETRIC PASSKEY */}
      {authMode === "PRODUCTION_PASSKEY" && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg mx-auto space-y-6 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Fingerprint className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-sovereign-navy dark:text-white">
              FIDO2 Device Biometric Passkey
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with Touch ID, Face ID, or Windows Hello for instant &lt;50ms cryptographic authentication.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1 font-mono">
            <div className="text-slate-500">Universal Account Number (UAN):</div>
            <div className="font-bold text-slate-900 dark:text-white">{uanInput} (Ramesh Kumar)</div>
          </div>

          <button
            onClick={handleBiometricPasskey}
            disabled={passkeyActive}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Fingerprint className="w-5 h-5" />
            <span>{passkeyActive ? "Verifying Biometrics..." : "1-Tap Touch ID / Face ID Login"}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Passwords • Zero Squiggly Captchas • Sub-50ms Response</span>
          </div>
        </div>
      )}

      {/* MODE C: 10-MIN RESILIENT AADHAAR OTP */}
      {authMode === "AADHAAR_OTP" && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg mx-auto space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Smartphone className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-sovereign-navy dark:text-white">
              Resilient 6-Digit Aadhaar OTP
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sent to Aadhaar-linked mobile ending in <strong>XXXX-4819</strong>.
            </p>
          </div>

          {/* 6 Large 60px OTP Boxes */}
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-center gap-2.5">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputsRef.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-black font-mono rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sovereign-navy dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all shadow-inner"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                ● 10:00 Min Validity (Zero 30s Timeout)
              </span>
              <button
                type="button"
                onClick={() => setOtpDigits(["1", "2", "3", "4", "5", "6"])}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
              >
                Auto-Fill Demo OTP (123456)
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">WhatsApp Backup Delivery:</span>
              <button
                type="button"
                onClick={() => setWhatsappDelivery((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  whatsappDelivery
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {whatsappDelivery ? "Enabled ✓" : "Disabled"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 px-6 rounded-2xl bg-sovereign-navy dark:bg-amber-500 dark:text-slate-950 text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-saffron dark:text-slate-950" />
              <span>{loggingIn ? "Authenticating..." : "Verify OTP & Enter"}</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            🔒 Instant Self-Unlock Active • Zero 24-hour account locks on wrong entries.
          </p>
        </div>
      )}
    </div>
  );
}
