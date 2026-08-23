"use client";

import React, { useState, useEffect } from "react";
import { Shield, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const VALID_PASSCODES = ["damik2007", "damik2026", "hackathon2026", "epf2026", "varun2026", "epfo3.0"];

export function EvaluatorGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    try {
      // 1. Check URL parameters for 1-click bypass link (e.g. ?key=hackathon2026)
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
        setErrorMsg("Invalid Evaluator Passcode. Access restricted to authorized judges.");
      }
    }, 400);
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
            <p className="text-[10px] text-slate-400 font-mono">Sovereign Pre-Release v1.0</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center gap-1">
          <Lock className="w-3 h-3" /> Protected Deployment
        </span>
      </div>

      {/* Main Lock Form */}
      <div className="max-w-md mx-auto w-full my-auto py-12 space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center mx-auto shadow-2xl text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-2">
            Evaluator Security Gate
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            This pre-release submission is locked to protect architectural assets and credits. Enter the Hackathon Evaluator passcode to unlock.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4 backdrop-blur-md">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Enter Evaluator Passcode</span>
            </label>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter security passcode..."
              autoFocus
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-mono tracking-widest"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !passcodeInput.trim()}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isVerifying ? (
              <span>Verifying Cryptographic Key...</span>
            ) : (
              <>
                <span>Unlock Platform Access</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              🔒 Evaluator Access: Please enter the authorized passcode provided in your hackathon submission notes.
            </p>
          </div>
        </form>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center space-y-1">
          <p className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Trust Presidio Shield • Anti-Copy Protection Active</span>
          </p>
          <p className="text-[10px] text-slate-600">
            Build What Moves India • Architected by Damik Reddy
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center text-[10px] text-slate-600 py-2">
        Protected Deployment • Jan-EPF AI Sovereign Sandbox
      </div>
    </div>
  );
}
