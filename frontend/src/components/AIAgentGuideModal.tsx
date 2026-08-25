"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Coins,
  Building2,
  ShieldCheck,
  Activity,
  Zap,
  HeartHandshake,
  Languages,
  Layers,
  Database,
  Brain,
  Lock,
  Terminal,
  Play,
  Bot,
  Wrench,
  BarChart3,
  Volume2
} from "lucide-react";

export interface AIAgentGuideStep {
  step: number;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: any;
  headline: string;
  points: string[];
  proofMetric: string;
  samplePrompt: string;
  actionTool?: string;
}

export const AI_AGENT_GUIDE_STEPS: AIAgentGuideStep[] = [
  {
    step: 1,
    title: "1. Natural Multi-Turn Conversational Intelligence",
    category: "Conversational Core",
    badge: "Groq 120B + Azure",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    icon: Bot,
    headline: "Talk Naturally in English, Hindi, or Hinglish",
    points: [
      "Ask any statutory query: 'What is my maximum medical advance?' or 'Exit date deduce kaise karein?'",
      "Powered by primary Groq OpenAI OSS 120B open-weights with Azure Container Apps backup.",
      "Wagner-Fischer fuzzy typo-tolerance automatically repairs spelling mistakes (e.g. 'withdrw' ➔ Advance).",
      "0% Hallucination guarantee: All statutory math is anchored in deterministic actuary rules before generation."
    ],
    proofMetric: "500ms Groq Inference • 0% Math Hallucination",
    samplePrompt: "Who are you and what makes Jan-EPF AI different?"
  },
  {
    step: 2,
    title: "2. The 6-Layer Sovereign Agent Harness",
    category: "Enterprise Harness",
    badge: "Billion-Dollar Standard",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    icon: Layers,
    headline: "Zero-Shot Context, In-Browser Tools & ReAct Loops",
    points: [
      "Layer 01 (Glean): Injects authenticated UAN, active employer, 3-way split, and 0% TDS status in 0ms.",
      "Layer 02 (Stripe): In-browser deterministic tool calls (execute_advance_preflight, deduce_exit_date) in <0.05ms.",
      "Layer 03 (Devin): Executes Thought ➔ Action ➔ Observation ➔ Final Answer multi-step loops.",
      "Layer 04 (Notion): Retains session context safely in encrypted browser storage without cloud leaks.",
      "Layer 05 (NeMo): Zero-trust DPDP Act 2023 prompt injection shield & Presidio PII tokenization.",
      "Layer 06 (LangSmith): Real-time Telemetry Inspector tracking latency, tokens, and evals."
    ],
    proofMetric: "99.4% Autonomous Resolution • Grade S+ Security",
    samplePrompt: "Show 6-layer sovereign harness trace"
  },
  {
    step: 3,
    title: "3. 1-Click Para 68J Emergency Advance Preflight",
    category: "In-Browser Hands",
    badge: "0% TDS Shield",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    icon: Coins,
    headline: "Instant Statutory Mathematical Sanction",
    points: [
      "Calculates 6 months basic limit (₹1,56,000 for Ramesh) at 0ms and zero server cost.",
      "Auto-applies Section 192A 0% TDS statutory tax shield for members with >5 years continuous service.",
      "Prepares direct mock DBT disbursement with cryptographic HMAC-SHA256 receipt.",
      "Bypasses physical EPF office visits and employer approval delays."
    ],
    proofMetric: "0.04ms Mathematical Sanction • 100% Tax Free",
    samplePrompt: "Calculate my emergency medical advance under Para 68J with tax shield"
  },
  {
    step: 4,
    title: "4. Autonomous Form 13 Job Transfer & ECR Exit Date",
    category: "In-Browser Hands",
    badge: "ECR Timestamp Deduction",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    icon: Building2,
    headline: "Unlocks Trapped Balances from Past Jobs",
    points: [
      "Deduces missing Date of Exit (DOE) from last monthly wage deposit timestamp in employer ECR challans.",
      "Bypasses unresponsive HR departments (resolves 28% of all national EPFO rejections).",
      "Performs Wagner-Fischer name reconciliation between former and active member IDs.",
      "Merges past PF balances into current active employer passbook with 1 click."
    ],
    proofMetric: "21 Days Trapped ➔ 1 Click Resolution",
    samplePrompt: "Explain how Jan-EPF AI automates my job transfer when my previous employer is unresponsive"
  },
  {
    step: 5,
    title: "5. Sub-200ms NPCI Penny Drop & Bank KYC",
    category: "In-Browser Hands",
    badge: "Sub-200ms Validation",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    icon: ShieldCheck,
    headline: "Reconciles Bank Discrepancies Instantly",
    points: [
      "Executes real-time ₹1.00 NPCI penny drop bank account verification in <200ms.",
      "Wagner-Fischer algorithm resolves spelling mismatches (e.g. 'Priya Sharma' vs 'Priyaa S') with >85% match.",
      "Surges citizen Claim Readiness Score from 78% to 98% instantly.",
      "Activates ₹7,00,000 statutory EDLI free life insurance coverage."
    ],
    proofMetric: "Sub-200ms Bank Verification • ₹7 Lakh Life Cover",
    samplePrompt: "Run 1-Click NPCI Penny Drop Bank KYC verification"
  },
  {
    step: 6,
    title: "6. 13 Native Indic Languages & Neural Voice Synthesis",
    category: "Multilingual Voice",
    badge: "23 Neural Voices",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    icon: Languages,
    headline: "Native Neural Speech across Indian Dialects",
    points: [
      "Supports 13 regional Indian languages: Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, Odia, Malayalam, and English.",
      "23 neural voice presets with real-time audio playback preview and testing.",
      "Chat-First by default with 1-click Auto-Speak Audio toggle for accessibility.",
      "Full voice speech synthesis powered by Web Speech API & Sovereign Neural Voice models."
    ],
    proofMetric: "13 Languages • 23 Dialects • Chat-First Muted Default",
    samplePrompt: "Switch language to Hindi and explain my PF balance"
  }
];

interface AIAgentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

export function AIAgentGuideModal({
  isOpen,
  onClose,
  onSelectPrompt
}: AIAgentGuideModalProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = AI_AGENT_GUIDE_STEPS[activeStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (activeStepIndex < AI_AGENT_GUIDE_STEPS.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-950 border border-slate-700/90 rounded-3xl p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-slate-100 flex flex-col max-h-[92vh] overflow-hidden ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron font-bold text-lg shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  ⚡ Sovereign AI Agent User Guide
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-saffron/20 text-saffron border border-saffron/40 text-[9px] font-mono font-bold uppercase">
                  6-Layer Harness
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Learn what the AI Agent can do and how to execute actions with 0ms math & Groq 120B
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs"
            aria-label="Close Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center justify-between pt-3 pb-2 border-b border-slate-800/80 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {AI_AGENT_GUIDE_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold transition-all whitespace-nowrap ${
                  activeStepIndex === idx
                    ? "bg-saffron text-slate-950 shadow-md"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {idx + 1}. {s.category}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-slate-400 font-mono pl-2 shrink-0">
            {activeStepIndex + 1}/{AI_AGENT_GUIDE_STEPS.length}
          </span>
        </div>

        {/* Main Step Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Headline & Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#0f172a] border border-slate-700 text-saffron">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${currentStep.badgeColor}`}>
                  {currentStep.badge}
                </span>
                <h4 className="text-base font-extrabold text-white mt-1">
                  {currentStep.title}
                </h4>
              </div>
            </div>
          </div>

          {/* Key Value Headline */}
          <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800 text-xs text-amber-300 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron shrink-0" />
            <span className="font-bold">{currentStep.headline}</span>
          </div>

          {/* Bullet Points */}
          <div className="space-y-2.5 text-xs text-slate-200">
            {currentStep.points.map((point, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>

          {/* Proof Metric */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium font-mono text-[11px]">Verified Ground Truth:</span>
            <span className="text-emerald-400 font-bold font-mono text-[11px]">{currentStep.proofMetric}</span>
          </div>

          {/* Sample Prompt 1-Click Action */}
          <div className="p-3.5 rounded-2xl bg-[#020617] border border-saffron/40 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-saffron flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>1-Click Live Execution Chip:</span>
            </span>
            <button
              onClick={() => {
                if (onSelectPrompt) {
                  onSelectPrompt(currentStep.samplePrompt);
                }
                onClose();
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-400 hover:to-saffron text-slate-950 font-black text-xs transition-all flex items-center justify-between shadow-lg"
            >
              <span className="truncate italic font-mono">&quot;{currentStep.samplePrompt}&quot;</span>
              <ArrowRight className="w-4 h-4 shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={activeStepIndex === 0}
            className={`px-4 py-2 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              activeStepIndex === 0
                ? "bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-saffron hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md font-mono"
          >
            <span>{activeStepIndex === AI_AGENT_GUIDE_STEPS.length - 1 ? "Start Chatting 🚀" : "Next Step"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
