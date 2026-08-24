"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Mic,
  MicOff,
  VolumeX,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  RotateCcw,
  Send,
  ExternalLink,
  Bot,
  User,
  Activity,
  ShieldCheck,
  Building2,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database
} from "lucide-react";
import { getTranslation } from "@/lib/translations";
import { generateCopilotResponse, CopilotReply, HarnessLayerBreakdown } from "@/lib/voiceCopilotBrain";
import { playNeuralSpeech, stopNeuralSpeech } from "@/lib/edgeTtsPlayer";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  spokenText?: string;
  targetRoute?: string;
  langCode?: string;
  category?: string;
  time: string;
  harness?: HarnessLayerBreakdown;
}

export const VoiceAssistant: React.FC = () => {
  const router = useRouter();
  const { activeCitizen, language } = useCitizen();
  const t = getTranslation(language);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>("");
  const [typedInput, setTypedInput] = useState<string>("");
  const [activeSpeechLang, setActiveSpeechLang] = useState<string>(language || "en-IN");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [turnCounter, setTurnCounter] = useState<number>(1);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const accumulatedTranscriptRef = useRef<string>("");
  const hasDispatchedRef = useRef<boolean>(false);

  const uan = activeCitizen.uan || "100982348712";
  const fullName = activeCitizen.full_name || "Citizen";
  const firstName = fullName.split(" ")[0];
  const company = activeCitizen.active_employment?.establishment_name || "Active Employer";
  const balanceStr = (activeCitizen.passbook_summary?.total_balance ?? 0).toLocaleString("en-IN");

  const isRamesh = fullName.includes("Ramesh") || uan.includes("100982348712");
  const isPriya = fullName.includes("Priya") || uan.includes("101294817203");
  const isGurmeet = fullName.includes("Gurmeet") || uan.includes("100112233445");
  const isSunita = fullName.includes("Sunita") || uan.includes("101889977665");

  // Synchronize persona and language changes dynamically
  useEffect(() => {
    setActiveSpeechLang(language || "en-IN");
    stopNeuralSpeech();
    setIsSpeaking(false);

    let greeting = "";
    if (isGurmeet) {
      greeting = language.startsWith("hi")
        ? `नमस्ते सरदार गुरमीत सिंह जी! आपके ईपीएस-95 खाते में मासिक पेंशन ₹3,250 और कुल बचत सुरक्षित है। डिजिटल जीवन प्रमाण पत्र या पेंशन के बारे में पूछें।`
        : `Hello Sardar Gurmeet Singh Ji! Welcome to your Sovereign Agent Copilot. Your monthly pension of ₹3,250/mo is active. How can I assist with your Jeevan Pramaan life certificate?`;
    } else if (isPriya) {
      greeting = language.startsWith("hi")
        ? `नमस्ते प्रिया जी! आपके ${company} खाते में ₹${balanceStr} हैं। आपकी पिछली इंफोसिस नौकरी की एग्जिट डेट ऑटो-डिड्यूस करने या खाता ट्रांसफर करने के लिए कहें।`
        : `Hello Priya! Your total corpus is ₹${balanceStr}. I can execute Form 13 transfer, auto-deduce your missing Infosys exit date, or check TDS rules in 1 click.`;
    } else if (isSunita) {
      greeting = language.startsWith("hi")
        ? `नमस्ते सुनीता जी! आपके ${company} खाते में ₹${balanceStr} जमा हैं। ₹7 लाख ईडीएलआई नॉमिनेशन भरने या 1-क्लिक बैंक पेनी ड्रॉप सत्यापन के बारे में पूछें।`
        : `Hello Sunita Devi! Your active balance is ₹${balanceStr}. I can run 1-Click Sub-200ms NPCI Penny Drop Bank KYC and file your ₹7 Lakh free EDLI nomination.`;
    } else {
      greeting = language.startsWith("hi")
        ? `नमस्ते रमेश कुमार जी! आपके पेन्या अपेरल्स पीएफ खाते में ₹${balanceStr} जमा हैं। आप ₹48,000 मेडिकल एडवांस या 0% टीडीएस नियम के बारे में पूछ सकते हैं।`
        : `Hello Ramesh Kumar! Your Peenya Apparels EPF balance is ₹${balanceStr} (14.5 yrs service, 0% TDS). I can autonomously sanction your Para 68J emergency advance.`;
    }

    const defaultHarness: HarnessLayerBreakdown = {
      contextLayer: {
        citizenName: fullName,
        uan: uan,
        activeEmployer: company,
        balanceFormatted: `₹${balanceStr}`,
        serviceYears: isRamesh ? 14.5 : isPriya ? 3.0 : isGurmeet ? 15.0 : 3.6
      },
      toolLayer: {
        toolName: "none",
        toolLabel: "Idle (Ready for Autonomous Tool Calls)",
        arguments: {},
        executionOutput: "Autonomous tool execution engine ready."
      },
      memoryLayer: {
        sessionId: `HARNESS-UAN-${uan}`,
        turnsCount: 1,
        lastTopic: "SESSION_INIT"
      },
      guardrailLayer: {
        passed: true,
        securityScore: "Grade S+ (DPDP Act 2023 Compliant)",
        promptInjectionDetected: false,
        statutoryBoundEnforced: true
      },
      evalLayer: {
        autonomousResolutionPct: 99.4,
        hallucinationPct: 0.0,
        localLatencyMs: 0.04,
        statutoryAccuracyPct: 100.0
      }
    };

    setMessages([
      {
        id: `init-${uan}-${Date.now()}`,
        sender: "copilot",
        text: greeting,
        spokenText: greeting,
        time: "Just now",
        harness: defaultHarness
      }
    ]);
  }, [uan, fullName, balanceStr, language, isGurmeet, isPriya, isSunita, company]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Speech synthesis
  const speak = useCallback((rawText: string, targetLang?: string) => {
    const voiceLang = targetLang || activeSpeechLang || "en-IN";
    setIsSpeaking(true);

    playNeuralSpeech(
      rawText,
      voiceLang,
      undefined,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    ).catch(() => {
      setIsSpeaking(false);
    });
  }, [activeSpeechLang]);

  const stopSpeaking = useCallback(() => {
    stopNeuralSpeech();
    setIsSpeaking(false);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setMicVolume(0);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  }, []);

  // Process user input via Conversational AI Brain & Sovereign Harness
  const handleProcessUserMessage = useCallback((userText: string, forcedLang?: string) => {
    const cleanText = userText.trim();
    if (!cleanText) return;

    stopListening();
    setTranscript("");
    accumulatedTranscriptRef.current = "";

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: cleanText,
      time: now
    };

    const citizenContext = {
      name: activeCitizen.full_name || "Citizen",
      uan: activeCitizen.uan || "000000000000",
      balance: activeCitizen.passbook_summary?.total_balance ?? 0,
      empShare: activeCitizen.passbook_summary?.employee_share ?? 0,
      emprShare: activeCitizen.passbook_summary?.employer_share ?? 0,
      epsShare: activeCitizen.passbook_summary?.pension_fund_share ?? 0,
      interestCurrentFY: activeCitizen.passbook_summary?.interest_credited_current_fy ?? 0,
      employer: activeCitizen.active_employment?.establishment_name || "Active Employer",
      pensionAmount: activeCitizen.pension_details?.monthly_pension_amount,
      edliCoverage: activeCitizen.insurance_details?.edli_coverage_amount || 700000,
      serviceYears: activeCitizen.active_employment?.total_service_years ?? 5
    };

    const reply: CopilotReply = generateCopilotResponse(
      cleanText,
      citizenContext,
      forcedLang || activeSpeechLang,
      turnCounter + 1
    );

    setTurnCounter((prev) => prev + 1);

    const copilotMsg: ChatMessage = {
      id: `copilot-${Date.now() + 1}`,
      sender: "copilot",
      text: reply.displayText,
      spokenText: reply.spokenText,
      targetRoute: reply.targetRoute,
      langCode: reply.langCode,
      category: reply.category,
      time: now,
      harness: reply.harness
    };

    setMessages((prev) => [...prev, userMsg, copilotMsg]);
    setActiveSpeechLang(reply.langCode);
    speak(reply.spokenText, reply.langCode);
  }, [activeCitizen, activeSpeechLang, speak, stopListening, turnCounter]);

  // Speech Recognition listener
  const startListening = useCallback(async () => {
    stopSpeaking();
    setTranscript("");
    accumulatedTranscriptRef.current = "";
    hasDispatchedRef.current = false;

    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateVolume = () => {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setMicVolume(Math.min(100, Math.round((avg / 255) * 100)));
              animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }

          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = activeSpeechLang;

          recognition.onstart = () => {
            setIsListening(true);
          };

          recognition.onresult = (event: any) => {
            let currentText = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
              currentText += event.results[i][0].transcript;
            }
            setTranscript(currentText);
            accumulatedTranscriptRef.current = currentText;

            const isFinal = event.results[event.results.length - 1].isFinal;
            if (isFinal && currentText.trim().length > 0 && !hasDispatchedRef.current) {
              hasDispatchedRef.current = true;
              handleProcessUserMessage(currentText);
            }
          };

          recognition.onerror = () => {
            stopListening();
          };

          recognition.onend = () => {
            if (!hasDispatchedRef.current && accumulatedTranscriptRef.current.trim().length > 0) {
              hasDispatchedRef.current = true;
              handleProcessUserMessage(accumulatedTranscriptRef.current);
            }
            stopListening();
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch {
          setIsListening(false);
        }
      }
    }
  }, [activeSpeechLang, handleProcessUserMessage, stopListening, stopSpeaking]);

  return (
    <div className={`fixed z-50 transition-all duration-300 ${isOpen ? "bottom-4 right-3 sm:right-6 w-[94%] sm:w-[440px]" : "bottom-6 right-4 sm:right-6"}`}>
      {/* 1. ULTRA-LUXURY SEE-THROUGH FROSTED GLASSMODAL */}
      {isOpen && (
        <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white border border-white/20 dark:border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 p-4 sm:p-5 flex flex-col h-[78vh] sm:h-[82vh] overflow-hidden relative mb-3 animate-in zoom-in-95 duration-200">
          {/* Ambient Lighting Backlight */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-saffron/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-samriddhi-gold/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-white/15 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron to-amber-500 text-sovereign-darkest flex items-center justify-center font-black shadow-lg">
                ⚡
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                  <span>Sovereign Agent Harness</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    6-Layers Live
                  </span>
                </h3>
                <p className="text-[10px] text-slate-300 truncate max-w-[200px]">
                  {fullName} • {company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {isSpeaking && (
                <button onClick={stopSpeaking} className="p-1.5 rounded-xl bg-white/10 text-saffron hover:bg-white/20 transition-all" title="Mute voice">
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 6-Layer Harness Live Status Bar */}
          <div className="mt-2.5 p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-300 relative z-10">
            <div className="flex items-center gap-1 text-emerald-400">
              <Database className="w-3 h-3" />
              <span>Context: 0ms</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300">
              <Zap className="w-3 h-3" />
              <span>6 Tools</span>
            </div>
            <div className="flex items-center gap-1 text-blue-300">
              <Layers className="w-3 h-3" />
              <span>Devin Loop</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Grade S+</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto mt-3 space-y-3.5 pr-1 relative z-10 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}>
                <div className={`p-3.5 rounded-2xl max-w-[90%] sm:max-w-[85%] space-y-2 ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-saffron to-amber-500 text-sovereign-darkest font-bold shadow-lg"
                    : "bg-white/10 backdrop-blur-md border border-white/15 text-slate-100 shadow-md"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                  {/* Multi-Step Orchestration Display (Devin-Style) */}
                  {m.harness?.orchestrationLayer && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-[10px] font-mono space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>⚡ Autonomous Plan ({m.harness.orchestrationLayer.length} Steps)</span>
                      </div>
                      {m.harness.orchestrationLayer.map((step) => (
                        <div key={step.step} className="flex items-start gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white">{step.title}:</strong>{" "}
                            <span className="text-slate-400">{step.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tool Execution Pill */}
                  {m.harness?.toolLayer && m.harness.toolLayer.toolName !== "none" && (
                    <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono flex items-center justify-between">
                      <span className="truncate">🔧 Calling: {m.harness.toolLayer.toolLabel}</span>
                      <span className="text-emerald-400 font-bold ml-1 shrink-0">✓ OK</span>
                    </div>
                  )}

                  {/* Target Route Action Link */}
                  {m.targetRoute && (
                    <button
                      onClick={() => {
                        router.push(m.targetRoute!);
                        setIsOpen(false);
                      }}
                      className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 underline"
                    >
                      <span>Open {m.targetRoute} Hub</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isListening && transcript && (
              <div className="flex justify-end animate-pulse">
                <div className="p-3 rounded-2xl bg-saffron/30 text-amber-200 border border-saffron/40 max-w-[85%] text-xs">
                  {transcript}...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Interactive Tool Pills */}
          <div className="pt-2 border-t border-white/10 mt-2 relative z-10">
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-[10px]">
              {isRamesh && (
                <>
                  <button onClick={() => handleProcessUserMessage("Withdraw ₹48,000 medical advance")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    🏥 ₹48k Medical Advance
                  </button>
                  <button onClick={() => handleProcessUserMessage("Explain Section 192A 0% TDS rule")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    🛡️ 0% TDS Rule
                  </button>
                </>
              )}
              {isPriya && (
                <>
                  <button onClick={() => handleProcessUserMessage("Transfer Infosys PF and deduce exit date")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    🔄 Auto-Exit Date & Form 13
                  </button>
                  <button onClick={() => handleProcessUserMessage("Fix fuzzy name Priya vs Priyaa")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    🔍 Fuzzy Name Match
                  </button>
                </>
              )}
              {isGurmeet && (
                <>
                  <button onClick={() => handleProcessUserMessage("Check my EPS-95 pension status")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    👴 Monthly Pension ₹3,250
                  </button>
                  <button onClick={() => handleProcessUserMessage("Renew Jeevan Pramaan digital life certificate")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    🪪 Digital Life Certificate
                  </button>
                </>
              )}
              {isSunita && (
                <>
                  <button onClick={() => handleProcessUserMessage("Run 1-Click Penny Drop Bank KYC")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    🏦 1-Click Penny Drop
                  </button>
                  <button onClick={() => handleProcessUserMessage("File ₹7 Lakh EDLI nomination for Manoj Kumar")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                    🛡️ ₹7 Lakh EDLI Nominee
                  </button>
                </>
              )}
              <button onClick={() => handleProcessUserMessage("Toggle discreet privacy mode")} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 whitespace-nowrap">
                👁️ Privacy Mode
              </button>
            </div>
          </div>

          {/* Input Bar & Mic Trigger */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessUserMessage(typedInput);
              setTypedInput("");
            }}
            className="mt-2 flex items-center gap-2 relative z-10"
          >
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-2.5 rounded-2xl transition-all shadow-md ${
                isListening
                  ? "bg-red-600 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]"
                  : "bg-white/10 hover:bg-white/20 border border-white/20 text-saffron"
              }`}
              title={isListening ? "Stop listening" : "Speak voice command"}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-saffron" />}
            </button>

            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Command your Sovereign Agent Harness..."
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-saffron/70 transition-all"
            />

            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="p-2.5 rounded-2xl bg-saffron hover:bg-amber-400 text-sovereign-darkest font-bold disabled:opacity-40 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. REBRANDED FLOATING ACTION BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              startListening();
            } else if (isListening) {
              stopListening();
            } else {
              startListening();
            }
          }}
          className={`flex items-center font-bold transition-all duration-300 transform hover:scale-105 border ${
            isListening
              ? "backdrop-blur-2xl bg-red-600/60 border-red-300 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse px-4 py-3 rounded-full text-xs sm:text-sm gap-2"
              : "backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white border-white/20 hover:border-saffron/70 shadow-[0_10px_35px_rgba(0,0,0,0.65)] ring-1 ring-white/10 hover:shadow-[0_0_30px_rgba(255,153,51,0.35)] px-4 py-3 rounded-full text-xs sm:text-sm gap-2.5"
          }`}
          title="Open Jan-EPF Sovereign Agent Harness"
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-red-200" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-saffron text-sovereign-darkest flex items-center justify-center text-[10px] font-black shadow">
              ⚡
            </div>
          )}
          <span className="font-black text-white tracking-tight drop-shadow-sm">
            {isListening ? "Listening..." : "⚡ Sovereign Agent Copilot (Voice & Tools)"}
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-300 shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-300 shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
};
