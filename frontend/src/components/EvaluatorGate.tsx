"use client";

import React, { useState, useEffect } from "react";
import { Shield, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Zap } from "lucide-react";

const VALID_PASSCODES = ["damik2007", "damik2026", "hackathon2026", "epf2026", "varun2026", "epfo3.0", "demo", "evaluator"];

export function EvaluatorGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    try {
      // 1. Check URL parameters for 1-click bypass link (e.g. ?key=damik2007)
      const params = new URLSearchParams(window.location.search);
      const urlKey = params.get("key") || params.get("pass") || params.get("access");
      if (urlKey && VALID_PASSCODES.includes(urlKey.toLowerCase())) {
        sessionStorage.setItem("jan_epf_unlocked", "true");
        setIsUnlocked(true);
        return;
      }

      // 2. Check saved session
      const saved = sessionStorage.getItem("jan_epf_unlocked");
      if (saved === "true") {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    } catch {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const cleaned = passcodeInput.trim().toLowerCase();
      if (VALID_PASSCODES.includes(cleaned)) {
        try {
          sessionStorage.setItem("jan_epf_unlocked", "true");
        } catch {}
        setIsUnlocked(true);
      } else {
        setErrorMsg("Invalid Evaluator Passcode. Use 1-Click Instant Demo below.");
      }
    }, 300);
  };

  const handle1ClickBypass = () => {
    try {
      sessionStorage.setItem("jan_epf_unlocked", "true");
    } catch {}
    setIsUnlocked(true);
  };

  // While checking session state
  if (isUnlocked === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If unlocked, render full app
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Security Gate Screen
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex justify-between items-center py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase">Jan-EPF AI</h1>
            <p className="text-[10px] text-slate-400 font-mono">Build What Moves India 2026</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Evaluator Ready
        </span>
      </div>

      {/* Main Lock Form */}
      <div className="max-w-md mx-auto w-full my-auto py-10 space-y-5">
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center mx-auto shadow-2xl text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-2">
            Evaluator Showcase Gateway
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Sovereign Digital Public Infrastructure prototype for 70 crore Indian workers. Select 1-click instant access to test all 4 demographic scenarios.
          </p>
        </div>

        {/* 1-Click Instant Bypass for Hackathon Evaluators */}
        <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border-2 border-amber-500/50 p-5 rounded-2xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Hackathon Judge &amp; Evaluator 1-Tap Access
            </span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Zero-Friction
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            No SMS OTPs, passwords, or gatekeepers required. Tap below to immediately explore the rebuilt life-event hubs with pre-seeded personas.
          </p>

          <button
            onClick={handle1ClickBypass}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/30 active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>⚡ Enter Prototype (1-Click Instant Access)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Optional Passcode Unlock */}
        <form onSubmit={handleUnlock} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3 h-3 text-slate-400" />
              <span>Or Enter Evaluator Passcode (damik2007)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="damik2007"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={isVerifying || !passcodeInput.trim()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Unlock"}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center space-y-1">
          <p className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Trust Presidio Shield • 80/20 Sovereign Core Active</span>
          </p>
          <p className="text-[10px] text-slate-600">
            Build What Moves India (Varun Mayya × OpenAI) • Architected by Damik Reddy
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center text-[10px] text-slate-600 py-2">
        Jan-EPF AI • Sovereign Digital Public Infrastructure Prototype
      </div>
    </div>
  );
}
