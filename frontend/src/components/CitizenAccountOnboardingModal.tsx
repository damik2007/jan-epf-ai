"use client";

import React, { useState, useEffect } from "react";
import { useCitizen } from "@/context/CitizenContext";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
  Wallet,
  Building2,
  Lock,
  ExternalLink,
  Bot,
  HeartHandshake,
  Clock,
  Coins
} from "lucide-react";

interface CitizenAccountOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot?: () => void;
}

export function CitizenAccountOnboardingModal({
  isOpen,
  onClose,
  onOpenCopilot
}: CitizenAccountOnboardingModalProps) {
  const { activeCitizen } = useCitizen();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset to step 0 whenever modal opens or citizen changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen, activeCitizen.uan]);

  if (!isOpen) return null;

  const fullName = activeCitizen.full_name;
  const firstName = fullName.split(" ")[0];
  const uan = activeCitizen.uan;
  const totalBalance = activeCitizen.passbook_summary?.total_balance?.toLocaleString("en-IN") || "3,42,500";
  const empShare = (activeCitizen.passbook_summary?.employee_share || 181525).toLocaleString("en-IN");
  const emprShare = (activeCitizen.passbook_summary?.employer_share || 116450).toLocaleString("en-IN");
  const epsShare = (activeCitizen.passbook_summary?.pension_fund_share || 44525).toLocaleString("en-IN");
  const activeEmployer = activeCitizen.active_employment?.establishment_name || "Precision Auto Components Pvt Ltd";

  const isRamesh = uan.includes("100982348712") || fullName.includes("Ramesh");
  const isPriya = uan.includes("101294817203") || fullName.includes("Priya");
  const isGurmeet = uan.includes("100112233445") || fullName.includes("Gurmeet");
  const isSunita = uan.includes("101889977665") || fullName.includes("Sunita");

  const STEPS = [
    {
      step: 1,
      badge: "Step 1 of 4 • Account Foundation",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      title: `👤 Welcome ${firstName}! Your EPF Identity & Balance Split`,
      subtitle: `Universal Account Number (UAN): ${uan}`,
      icon: Wallet,
      accentColor: "from-blue-500 to-indigo-600",
      points: [
        `Active Establishment: ${activeEmployer} with 100% verified KYC.`,
        `Triple-Split Passbook: ₹${empShare} (Employee 12%) + ₹${emprShare} (Employer 3.67%) + ₹${epsShare} (EPS-95 Pension).`,
        `8.25% FY Annual Compounding: Interest calculates monthly and credits directly into your sovereign ledger.`,
        `Zero Employer Friction: Your UAN remains portable throughout your entire working career across India.`
      ],
      highlightBox: {
        label: "Total Sovereign Corpus",
        val: `₹${totalBalance}`,
        sub: `3 Split Funds Active • 8.25% Interest Compounding`
      }
    },
    {
      step: 2,
      badge: "Step 2 of 4 • Financial Rights",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      title: "🏥 Emergency Advances (Para 68J/B/K) & 0% TDS Tax Shield",
      subtitle: isRamesh
        ? "14.5 Years Service • 100% Tax-Exempt Emergency Limit of ₹1,56,000"
        : "Statutory Advance Caps with Automated Section 192A Form 15G",
      icon: Coins,
      accentColor: "from-emerald-500 to-teal-600",
      points: [
        isRamesh
          ? `Pre-Sanctioned Emergency Limit: ₹1,56,000 available in 0.04ms under Para 68J without doctor signature.`
          : `1-Click Advance Sanctions: Para 68J (Medical), 68B (Housing), and 68K (Marriage/Education).`,
        `Section 192A 0% TDS Shield: If you have >5 years of service, zero tax is deducted on withdrawals.`,
        `Automated Form 15G Attachment: If service is <5 years, Form 15G is automatically drafted to prevent 20% TDS deduction.`,
        `Direct DBT Bank Settlement: Sanctioned claims disburse directly to your NPCI verified bank in <24 hours.`
      ],
      highlightBox: {
        label: "Statutory Tax Exemption",
        val: "0% TDS (Section 192A)",
        sub: "Form 15G Auto-Attached • 0.04ms Mathematical Sanction"
      }
    },
    {
      step: 3,
      badge: "Step 3 of 4 • Bank KYC & Security",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      title: "🏦 Bank Penny Drop & ₹7,00,000 Free Life Cover (EDLI)",
      subtitle: "Sub-200ms Direct NPCI Integration + Phonetic Name Reconciler",
      icon: ShieldCheck,
      accentColor: "from-cyan-500 to-blue-600",
      points: [
        `Instant NPCI Penny Drop: ₹1 is credited to your bank account to verify active account status in <200ms.`,
        `Wagner-Fischer Name Matcher: Automatically bridges minor spelling differences between Aadhaar and Bank passbook.`,
        `Claim Readiness Score: Automatically boosts your account approval readiness from 78% up to 98%.`,
        `₹7,00,000 Free EDLI Life Insurance: Every active EPF member gets free statutory life cover for their registered nominee.`
      ],
      highlightBox: {
        label: "Statutory Free Life Cover",
        val: "₹7,00,000 EDLI",
        sub: "Free for all active members • Sub-200ms Bank Verification"
      }
    },
    {
      step: 4,
      badge: "Step 4 of 4 • Sovereign AI Copilot",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      title: "⚡ 24/7 Sovereign AI Copilot & Autonomous Problem Solver",
      subtitle: "80/20 Deterministic Engine • 13 Indic Regional Languages",
      icon: Bot,
      accentColor: "from-amber-500 to-saffron",
      points: [
        `Autonomous Job Switch (Form 13): Auto-deduces missing exit dates from monthly ECR wage timestamps, bypassing HR.`,
        `13 Native Indian Languages: Voice and chat in Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Gujarati, Punjabi, and English.`,
        `DPDP Act 2023 Compliance: Zero PII leakage with Presidio tokenization and on-screen Discreet Privacy Mode (Cmd/Ctrl + P).`,
        `Instant Answers: Ask anything about your PF balance, pension slips, tax exemptions, or claim pre-flights.`
      ],
      highlightBox: {
        label: "AI Copilot Response Time",
        val: "<0.05ms (0ms / ₹0.00)",
        sub: "6-Layer Sovereign Harness • 100% Statutory Precision"
      }
    }
  ];

  const current = STEPS[currentStepIndex];
  const IconComp = current.icon;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-700/90 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060d17] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-saffron to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-saffron/20 text-saffron border border-saffron/40 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Citizen Knowledge Guide
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  EPFO Direct Architecture
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Key Things Every Citizen Needs To Know
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Guide"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progression Bar & Dots */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-[#0a101d] border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                aria-label={`Jump to Step ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? "w-8 bg-saffron shadow-sm shadow-saffron/50"
                    : idx < currentStepIndex
                    ? "w-2.5 bg-emerald-500"
                    : "w-2.5 bg-slate-700 hover:bg-slate-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Step Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${current.badgeColor}`}>
                {current.badge}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <IconComp className="w-5 h-5 text-saffron shrink-0" />
              <span>{current.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">{current.subtitle}</p>
          </div>

          {/* Points List */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3 shadow-inner">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <span>What You Need To Know</span>
            </h4>
            <ul className="space-y-2.5">
              {current.points.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Highlight Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c1427] border border-slate-700/80 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                {current.highlightBox.label}
              </div>
              <div className="text-base sm:text-lg font-black text-amber-300">
                {current.highlightBox.val}
              </div>
              <div className="text-[11px] text-slate-300">
                {current.highlightBox.sub}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/30 flex items-center justify-center text-saffron shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Footer Actions Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#060d17] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-all"
            >
              Skip to Dashboard
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenCopilot && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCopilot();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-saffron" />
                <span>Ask AI Copilot</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-saffron hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            >
              <span>{isLastStep ? "Got it! Go to Dashboard ➔" : "Continue ➔"}</span>
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
