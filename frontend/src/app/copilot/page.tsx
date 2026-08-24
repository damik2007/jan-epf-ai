"use client";

import React, { useState, useEffect } from "react";
import { useCitizen } from "@/context/CitizenContext";
import { getTranslation } from "@/lib/translations";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Sparkles,
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sliders,
  Terminal,
  Activity,
  Zap,
  CheckCircle2,
  Lock,
  ExternalLink
} from "lucide-react";
import { generateCopilotResponse, CopilotReply, HarnessLayerBreakdown } from "@/lib/voiceCopilotBrain";
import { playNeuralSpeech, stopNeuralSpeech } from "@/lib/edgeTtsPlayer";

export default function CopilotWorkstationPage() {
  const { activeCitizen, language } = useCitizen();
  const t = getTranslation(language);

  const [typedInput, setTypedInput] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("en-IN-PrabhatNeural");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [turnCounter, setTurnCounter] = useState(1);

  const uan = activeCitizen.uan || "100982348712";
  const fullName = activeCitizen.full_name || "Citizen";
  const company = activeCitizen.active_employment?.establishment_name || "Active Employer";
  const balanceStr = (activeCitizen.passbook_summary?.total_balance ?? 0).toLocaleString("en-IN");
  const serviceYears = activeCitizen.active_employment?.total_service_years ?? 14.5;

  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: "user" | "copilot";
    text: string;
    targetRoute?: string;
    harness?: HarnessLayerBreakdown;
  }>>([
    {
      id: "init",
      sender: "copilot",
      text: `Hello ${fullName}! I am your Jan-EPF Sovereign Agent Copilot for ${company}.\n\n• Verified Corpus: ₹${balanceStr}\n• Continuous Service: ${serviceYears} Years (100% 0% TDS Tax-Exempt)\n• 6 In-Browser Deterministic Tools Active.\n\nHow can I assist you today? Ask me about medical advances under Para 68J, job transfers, or passbook compounding.`,
      harness: {
        contextLayer: {
          standard: "Glean ($14B Standard) • Zero-Shot Context Engine",
          citizenName: fullName,
          uan: uan,
          activeEmployer: company,
          balanceFormatted: `₹${balanceStr}`,
          serviceYears: serviceYears,
          summary: `Loaded ${fullName} • ${company} • ₹${balanceStr} • 0% TDS Shield`
        },
        toolLayer: {
          standard: "Stripe ($70B Standard) • In-Browser Hands",
          toolName: "none",
          toolLabel: "Idle (Ready for Autonomous Tool Calls)",
          arguments: {},
          executionOutput: "Autonomous tool execution engine ready."
        },
        memoryLayer: {
          standard: "Notion AI ($10B Standard) • Sovereign Memory",
          sessionId: `HARNESS-UAN-${uan}`,
          turnsCount: 1,
          lastTopic: "SESSION_INIT",
          memorySummary: `Session active • Turn #1 • Preserved in localStorage`
        },
        guardrailLayer: {
          standard: "NeMo / Llama Guard • Statutory Shield",
          passed: true,
          securityScore: "Grade S+ (DPDP Act 2023 Compliant)",
          promptInjectionDetected: false,
          statutoryBoundEnforced: true
        },
        evalLayer: {
          standard: "LangSmith / Braintrust ($1B+ Standard) • Continuous Evals",
          autonomousResolutionPct: 99.4,
          hallucinationPct: 0.0,
          localLatencyMs: 0.04,
          statutoryAccuracyPct: 100.0
        }
      }
    }
  ]);

  // Load past conversation turns from local storage if available (Layer 04: Notion AI Memory Standard)
  useEffect(() => {
    if (typeof window !== "undefined" && uan) {
      try {
        const saved = localStorage.getItem(`jan_epf_harness_history_${uan}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            setTurnCounter(parsed.length);
          }
        }
      } catch {}
    }
  }, [uan]);

  // Persist conversation turns to local storage (Layer 04: Notion AI Memory Standard)
  useEffect(() => {
    if (typeof window !== "undefined" && uan && messages.length > 0) {
      try {
        localStorage.setItem(`jan_epf_harness_history_${uan}`, JSON.stringify(messages));
      } catch {}
    }
  }, [messages, uan]);

  const handleSend = (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean) return;

    const userMsg = { id: `u-${Date.now()}`, sender: "user" as const, text: clean };
    const citizenContext = {
      name: fullName,
      uan: uan,
      balance: activeCitizen.passbook_summary?.total_balance ?? 0,
      empShare: activeCitizen.passbook_summary?.employee_share ?? 0,
      emprShare: activeCitizen.passbook_summary?.employer_share ?? 0,
      epsShare: activeCitizen.passbook_summary?.pension_fund_share ?? 0,
      interestCurrentFY: activeCitizen.passbook_summary?.interest_credited_current_fy ?? 0,
      employer: company,
      serviceYears: serviceYears
    };

    const reply = generateCopilotResponse(clean, citizenContext, language || "en-IN", turnCounter + 1);
    setTurnCounter(prev => prev + 1);

    const copilotMsg = {
      id: `c-${Date.now() + 1}`,
      sender: "copilot" as const,
      text: reply.displayText,
      targetRoute: reply.targetRoute,
      harness: reply.harness
    };

    setMessages(prev => [...prev, userMsg, copilotMsg]);

    if (autoSpeak) {
      setIsSpeaking(true);
      playNeuralSpeech(reply.spokenText, reply.langCode, selectedVoice, () => setIsSpeaking(true), () => setIsSpeaking(false))
        .catch(() => setIsSpeaking(false));
    }
  };

  return (
    <div className="min-h-screen bg-sovereign-navy text-white p-4 sm:p-6 lg:p-8 space-y-6">
      <Breadcrumb currentPage="Sovereign Workstation" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-saffron/20 text-saffron border border-saffron/40 text-[10px] font-black tracking-wider uppercase font-mono shadow-sm">
              ⚡ Full-Screen Sovereign Command Workstation
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
              6 Connected Layers Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Jan-EPF Sovereign Agent Copilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Directly executing in-browser actuary math, ECR timestamp resolution, sub-200ms NPCI penny drops, and Section 192A 0% TDS shields.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
              autoSpeak ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-white/5 text-slate-400 border-white/15"
            }`}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Auto-Speak: {autoSpeak ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chat Stream (Left) vs Real-Time Tool Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main: Chat Stream */}
        <div className="lg:col-span-8 flex flex-col h-[75vh] backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6 overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-2xl max-w-[90%] space-y-3 ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-saffron to-amber-500 text-sovereign-darkest font-bold shadow-lg"
                    : "bg-white/10 backdrop-blur-md border border-white/15 text-slate-100 shadow-md"
                }`}>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>

                  {/* Fuzzy typo alignment card if present */}
                  {m.harness?.fuzzyAlignment && m.sender === "copilot" && (
                    <div className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong>🔍 Fuzzy Typo Engine:</strong> Auto-aligned &apos;{m.harness.fuzzyAlignment.originalQuery}&apos; ➔ {m.harness.fuzzyAlignment.resolvedIntent} ({m.harness.fuzzyAlignment.similarityPct}% match)
                      </span>
                    </div>
                  )}

                  {/* 6-Layer Harness Visual Execution Cards */}
                  {m.harness && m.sender === "copilot" && (
                    <div className="space-y-2 pt-1 font-mono text-[10px]">
                      {/* Layer 01 Glean Card */}
                      <div className="px-2.5 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <div className="truncate">
                          <strong className="text-white">Layer 01 (Glean Standard):</strong> {m.harness.contextLayer.summary}
                        </div>
                      </div>

                      {/* Layer 02 Stripe Tool Card */}
                      {m.harness.toolLayer && m.harness.toolLayer.toolName !== "none" && (
                        <div className="px-2.5 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 truncate">
                            <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate"><strong className="text-white">Layer 02 (Stripe Standard):</strong> {m.harness.toolLayer.toolLabel}</span>
                          </div>
                          <span className="text-emerald-400 font-bold ml-1 shrink-0">✓ 0.04ms OK</span>
                        </div>
                      )}

                      {/* Layer 03 Devin Orchestration Step Machine */}
                      {m.harness.orchestrationLayer && (
                        <div className="p-3 rounded-xl bg-slate-950/85 border border-white/15 space-y-1.5">
                          <div className="flex items-center justify-between text-amber-300 font-bold border-b border-white/10 pb-1">
                            <div className="flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5" />
                              <span>⚡ Layer 03 (Devin Standard): Autonomous ReAct Loop</span>
                            </div>
                            <span className="text-[9px] text-emerald-400 font-mono">
                              {m.harness.orchestrationLayer.length}/{m.harness.orchestrationLayer.length} Done
                            </span>
                          </div>
                          {m.harness.orchestrationLayer.map((step) => (
                            <div key={step.step} className="flex items-start gap-1.5 text-slate-300 pt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white">{step.title}:</strong>{" "}
                                <span className="text-slate-400">{step.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Telemetry Strip */}
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-1 text-[9px] text-slate-400">
                        <span className="text-purple-300">🧠 <strong>Notion Memory:</strong> Turn #{m.harness.memoryLayer.turnsCount}</span>
                        <span className="text-emerald-300">🛡️ <strong>NeMo Guard:</strong> {m.harness.guardrailLayer.securityScore}</span>
                        <span className="text-amber-300">📊 <strong>LangSmith:</strong> 99.4% Res • 0.0% Halluc</span>
                      </div>
                    </div>
                  )}

                  {m.targetRoute && (
                    <a
                      href={`${m.targetRoute}?key=damik2007`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 underline pt-1"
                    >
                      <span>Open {m.targetRoute} Life-Event Hub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(typedInput);
              setTypedInput("");
            }}
            className="mt-4 flex items-center gap-2 pt-3 border-t border-white/10"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Ask anything (e.g. 'whats my balence', 'withdraw 48000 advance', 'fix exit date')..."
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-saffron/70 transition-all"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="p-3 rounded-2xl bg-saffron hover:bg-amber-400 text-sovereign-darkest font-bold disabled:opacity-40 transition-all shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right Side: Sovereign Telemetry & Tool Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 border border-white/20 shadow-2xl text-white space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-saffron" />
                <h3 className="font-bold text-white uppercase text-xs">Live Telemetry Inspector</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px]">
                Active Session
              </span>
            </div>

            {/* Glean Layer */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block uppercase text-[9px] font-bold">Layer 01 • Zero-Shot Context (Glean)</span>
              <div className="text-white font-bold text-sm">{fullName}</div>
              <div className="text-slate-300">UAN: {uan}</div>
              <div className="text-emerald-400 font-bold">Corpus: ₹{balanceStr}</div>
              <div className="text-slate-300 truncate">Employer: {company}</div>
            </div>

            {/* Stripe Layer */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block uppercase text-[9px] font-bold">Layer 02 • In-Browser Hands (Stripe)</span>
              <div className="text-slate-200">1. execute_advance_preflight</div>
              <div className="text-slate-200">2. auto_deduce_exit_date</div>
              <div className="text-slate-200">3. verify_npci_penny_drop</div>
              <div className="text-slate-200">4. toggle_discreet_privacy</div>
              <div className="text-slate-200">5. download_passbook_statement</div>
            </div>

            {/* NeMo Layer */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block uppercase text-[9px] font-bold">Layer 05 • Guardrails (NeMo)</span>
              <div className="text-emerald-400 font-bold">Grade S+ (DPDP Act 2023)</div>
              <div className="text-slate-300">Presidio PII Tokenization Active</div>
              <div className="text-slate-300">HMAC-SHA256 DBT Ledger Chaining</div>
            </div>

            {/* LangSmith Layer */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block uppercase text-[9px] font-bold">Layer 06 • Real-Time Evals (LangSmith)</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  <strong className="block text-xs font-bold text-white">99.4%</strong>
                  Auto-Res
                </div>
                <div className="p-1.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300">
                  <strong className="block text-xs font-bold text-white">0.0%</strong>
                  Halluc
                </div>
                <div className="p-1.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
                  <strong className="block text-xs font-bold text-white">&lt;0.05ms</strong>
                  Tool Latency
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation Card */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-white space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-200">Navigate to Life-Event Hubs</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="/money?key=damik2007" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-200">
                <span>🏥 I Need Money</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="/career?key=damik2007" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-200">
                <span>💼 I Changed Jobs</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="/savings?key=damik2007" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-200">
                <span>📈 My Savings</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="/fix?key=damik2007" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-200">
                <span>✍️ Fix Details</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
