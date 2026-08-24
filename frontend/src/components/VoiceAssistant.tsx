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
  CornerDownLeft,
  X,
  RotateCcw,
  Send,
  ExternalLink,
  Bot,
  User,
  Activity
} from "lucide-react";
import { getTranslation } from "@/lib/translations";
import { generateCopilotResponse, CopilotReply } from "@/lib/voiceCopilotBrain";
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

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const accumulatedTranscriptRef = useRef<string>("");
  const hasDispatchedRef = useRef<boolean>(false);

  // Synchronize persona and language changes dynamically
  useEffect(() => {
    setActiveSpeechLang(language || "en-IN");
    stopNeuralSpeech();
    setIsSpeaking(false);

    const firstName = activeCitizen.full_name ? activeCitizen.full_name.split(" ")[0] : "Citizen";
    const isSenior = !!activeCitizen.pension_details;
    const balanceStr = (activeCitizen.passbook_summary?.total_balance ?? 0).toLocaleString("en-IN");
    const pensionStr = (activeCitizen.pension_details?.monthly_pension_amount ?? 4250).toLocaleString("en-IN");
    const company = activeCitizen.active_employment?.establishment_name || "Active Employer";

    let greeting = "";
    if (language.startsWith("hi")) {
      greeting = isSenior
        ? `नमस्ते ${firstName} जी! आपके ईपीएस-95 खाते में मासिक पेंशन ₹${pensionStr} और कुल बचत ₹${balanceStr} है। डिजिटल जीवन प्रमाण पत्र या पेंशन के बारे में पूछें।`
        : `नमस्ते ${firstName} जी! आपके ${company} पीएफ खाते में ₹${balanceStr} जमा हैं। आप मुझसे पैसे निकालने, कंपनी बदलने, या आधार सुधार के बारे में पूछ सकते हैं।`;
    } else if (language.startsWith("te")) {
      greeting = isSenior
        ? `నమస్కారం ${firstName} గారు! మీ నెలవారీ పెన్షన్ ₹${pensionStr} మరియు మొత్తం బ్యాలెన్స్ ₹${balanceStr}. జీవన్ ప్రమాణ్ లేదా పెన్షన్ వివరాల కోసం అడగండి.`
        : `నమస్కారం ${firstName} గారు! మీ ${company} ఖాతాలో ₹${balanceStr} ఉన్నాయి. అడ్వాన్స్ లేదా జాబ్ బదిలీ కోసం మాట్లాడండి.`;
    } else if (language.startsWith("ta")) {
      greeting = isSenior
        ? `வணக்கம் ${firstName}! உங்கள் ஓய்வூதிய தொகை ₹${pensionStr}/மாதம். உங்கள் சேமிப்பு விவரங்களை அறிய கேளுங்கள்.`
        : `வணக்கம் ${firstName}! உங்கள் ${company} பிஎஃப் கணக்கில் ₹${balanceStr} உள்ளது. நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`;
    } else {
      greeting = isSenior
        ? `Hello ${firstName}! Welcome to your EPS-95 Pension portal. Your monthly pension is ₹${pensionStr}/mo with ₹${balanceStr} in passbook. How can I assist you today?`
        : `Hello ${firstName}! I am your Jan-EPF AI Companion. Your active ${company} balance is ₹${balanceStr}. How can I help you today?`;
    }

    setMessages([
      {
        id: `init-${activeCitizen.uan}-${Date.now()}`,
        sender: "copilot",
        text: greeting,
        spokenText: greeting,
        time: "Just now"
      }
    ]);
  }, [activeCitizen.uan, activeCitizen.full_name, activeCitizen.passbook_summary?.total_balance, language]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Ultra-Natural Human Neural Speech Synthesis Engine (Edge-TTS + Fallback)
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

  // Cleanly stop listening and release microphone streams
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

  // Process user input via Conversational AI Brain
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

    // Construct context strictly from active citizen to avoid persona bleed
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
      edliCoverage: activeCitizen.insurance_details?.edli_coverage_amount || 700000
    };

    const reply: CopilotReply = generateCopilotResponse(
      cleanText,
      citizenContext,
      forcedLang || activeSpeechLang
    );

    const copilotMsg: ChatMessage = {
      id: `copilot-${Date.now() + 1}`,
      sender: "copilot",
      text: reply.displayText,
      spokenText: reply.spokenText,
      targetRoute: reply.targetRoute,
      langCode: reply.langCode,
      category: reply.category,
      time: now
    };

    setMessages((prev) => [...prev, userMsg, copilotMsg]);
    setActiveSpeechLang(reply.langCode);
    speak(reply.spokenText, reply.langCode);
  }, [activeCitizen, activeSpeechLang, speak, stopListening]);

  // Initialize Speech Recognition on Mount and activeSpeechLang change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = activeSpeechLang;

          recognition.onstart = () => {
            setIsListening(true);
            hasDispatchedRef.current = false;
            accumulatedTranscriptRef.current = "";
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

          recognition.onerror = (err: any) => {
            console.warn("Speech recognition event error:", err);
            stopListening();
          };

          recognition.onend = () => {
            // If ended with accumulated text not yet dispatched, process it now
            if (!hasDispatchedRef.current && accumulatedTranscriptRef.current.trim().length > 1) {
              hasDispatchedRef.current = true;
              handleProcessUserMessage(accumulatedTranscriptRef.current);
            }
            stopListening();
          };

          recognitionRef.current = recognition;
        } catch (e) {
          console.warn("Speech recognition initialization failed:", e);
        }
      }
    }
  }, [activeSpeechLang, handleProcessUserMessage, stopListening]);

  // Start real-time Web Audio API frequency visualizer + Speech Recognition
  const startListening = async () => {
    setIsOpen(true);
    setTranscript("");
    accumulatedTranscriptRef.current = "";
    hasDispatchedRef.current = false;
    stopSpeaking();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };

        checkVolume();
      }
    } catch (err) {
      console.warn("Web Audio mic stream permission denied:", err);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = activeSpeechLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Recognition already active or retrying:", e);
        setIsListening(true);
      }
    } else {
      const fallbackMsg = language.startsWith("hi")
        ? "माइक समर्थित नहीं है। कृपया नीचे दिए गए टेक्स्ट बॉक्स में टाइप करें।"
        : "Microphone access is not supported in this browser. Please type your query below.";
      const newReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "copilot",
        text: fallbackMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, newReply]);
      speak(fallbackMsg, activeSpeechLang);
    }
  };

  const quickTiles = [
    {
      label: "🇮🇳 मेडिकल इमरजेंसी एडवांस",
      query: "मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं",
      lang: "hi-IN"
    },
    {
      label: "🇮🇳 నా PF బ్యాలెన్స్ & వడ్డీ",
      query: "నా పాస్‌బుక్ బ్యాలెన్స్ మరియు వడ్డీ ఎంత?",
      lang: "te-IN"
    },
    {
      label: "🔄 1-Click Job PF Transfer",
      query: "How to transfer previous company PF balance?",
      lang: "en-IN"
    },
    {
      label: "✍️ Fix Aadhaar Name Mismatch",
      query: "Fix my name mismatch with Aadhaar and run Penny Drop",
      lang: "en-IN"
    }
  ];

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isOpen
          ? "bottom-4 right-2 left-2 sm:left-auto sm:right-4 max-w-md w-auto sm:w-[420px] px-1 sm:px-3"
          : "bottom-20 right-3.5 sm:bottom-4 sm:right-4"
      }`}
    >
      {isOpen && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-sovereign-navy dark:border-slate-700 p-4 mb-3 transition-all animate-in slide-in-from-bottom-5 space-y-3 flex flex-col max-h-[75vh]">
          {/* Header */}
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-saffron flex items-center justify-center text-sovereign-darkest shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-sovereign-navy dark:text-white">Jan-EPF Neural Voice AI</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>Human Natural Cadence • Edge-TTS</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  title="Stop audio speech"
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-800 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] font-bold flex items-center gap-1"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              )}
              <button
                onClick={() => {
                  stopSpeaking();
                  stopListening();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 text-xs max-h-[260px] scroll-touch">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isUser
                        ? "bg-sovereign-navy text-white dark:bg-amber-500 dark:text-slate-950"
                        : "bg-saffron text-sovereign-darkest"
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] space-y-1.5 shadow-sm ${
                      isUser
                        ? "bg-sovereign-navy text-white rounded-tr-none font-medium dark:bg-amber-500 dark:text-slate-950"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-xs">{m.text}</p>

                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        {m.spokenText && (
                          <button
                            type="button"
                            onClick={() => speak(m.spokenText || m.text, m.langCode)}
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sovereign-navy dark:text-white hover:text-saffron bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-600 transition-all shadow-sm"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay</span>
                          </button>
                        )}

                        {m.targetRoute && (
                          <button
                            type="button"
                            onClick={() => {
                              stopSpeaking();
                              stopListening();
                              setIsOpen(false);
                              router.push(m.targetRoute!);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 px-2 py-0.5 rounded-md transition-all shadow-sm"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Live Mic Waveform Indicator */}
          {isListening && (
            <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 shrink-0">
              <div className="flex items-center gap-1">
                <span
                  style={{ height: `${Math.max(8, micVolume * 0.35)}px` }}
                  className="w-1 bg-emerald-500 rounded-full transition-all duration-75"
                />
                <span
                  style={{ height: `${Math.max(12, micVolume * 0.55)}px` }}
                  className="w-1 bg-emerald-600 rounded-full transition-all duration-75"
                />
                <span
                  style={{ height: `${Math.max(6, micVolume * 0.25)}px` }}
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                />
                <span
                  style={{ height: `${Math.max(14, micVolume * 0.65)}px` }}
                  className="w-1 bg-saffron rounded-full transition-all duration-75"
                />
                <span
                  style={{ height: `${Math.max(10, micVolume * 0.45)}px` }}
                  className="w-1 bg-emerald-500 rounded-full transition-all duration-75"
                />
                <span
                  style={{ height: `${Math.max(7, micVolume * 0.3)}px` }}
                  className="w-1 bg-emerald-600 rounded-full transition-all duration-75"
                />
              </div>

              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 truncate max-w-[200px]">
                {transcript ? `"${transcript}"` : `Listening in ${activeSpeechLang.split("-")[0].toUpperCase()}...`}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (transcript) {
                    handleProcessUserMessage(transcript);
                  } else {
                    stopListening();
                  }
                }}
                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[10px] font-bold"
              >
                Done
              </button>
            </div>
          )}

          {/* 1-Tap Vernacular Voice Test Pills for Evaluators */}
          <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-bold">
              <span>⚡ 1-Tap Indic Voice Test Prompts:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">Whisper ASR • ₹0 Bill</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleProcessUserMessage("मुझे अस्पताल के लिए ₹50,000 एडवांस चाहिए")}
                className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold hover:bg-amber-100 transition-all text-left"
              >
                🇮🇳 [हिंदी] ₹50k मेडिकल एडवांस
              </button>
              <button
                type="button"
                onClick={() => handleProcessUserMessage("నా పాత కంపెనీ PF బ్యాలెన్స్ బదిలీ చేయండి")}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold hover:bg-blue-100 transition-all text-left"
              >
                🇮🇳 [తెలుగు] PF ఖాతా బదిలీ
              </button>
              <button
                type="button"
                onClick={() => handleProcessUserMessage("எனது மொத்த சேமிப்பு மற்றும் வட்டி விவரங்கள்")}
                className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-bold hover:bg-purple-100 transition-all text-left"
              >
                🇮🇳 [தமிழ்] 8.25% வட்டி பாஸ்புக்
              </button>
              <button
                type="button"
                onClick={() => handleProcessUserMessage("Fix 1-letter name typo from Aadhaar")}
                className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition-all text-left"
              >
                🇬🇧 [English] Fix Aadhaar Typo
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (typedInput.trim()) {
                handleProcessUserMessage(typedInput);
                setTypedInput("");
              }
            }}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Ask anything: 'How to withdraw?', 'Balance?', 'Hi'..."
              className="w-full text-xs font-medium px-2.5 py-1.5 bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="p-2 rounded-xl bg-sovereign-navy dark:bg-amber-500 dark:text-slate-950 text-white hover:bg-sovereign-light disabled:opacity-40 transition-all shrink-0 shadow-sm"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Tiles */}
          <div className="space-y-1 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Instant 1-Tap Queries
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleProcessUserMessage(tile.query, tile.lang);
                  }}
                  className="text-left text-[11px] font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-sovereign-navy dark:hover:bg-amber-500 hover:text-white dark:hover:text-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-between group truncate"
                >
                  <span className="truncate max-w-[170px]">{tile.label}</span>
                  <CornerDownLeft className="w-3 h-3 text-slate-400 group-hover:text-white dark:group-hover:text-slate-950 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center justify-end">
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
          className={`flex items-center shadow-2xl font-bold transition-all transform hover:scale-105 border-2 ${
            isListening
              ? "bg-red-500 text-white border-white animate-pulse"
              : "bg-sovereign-navy text-white border-saffron hover:bg-sovereign-light dark:bg-slate-900 dark:border-amber-400"
          } ${
            isOpen
              ? "px-4 py-2.5 rounded-full text-xs sm:text-sm gap-2"
              : "p-3.5 sm:px-4 sm:py-3 rounded-full text-sm gap-2.5"
          }`}
          title="Speak to Jan-EPF Voice Copilot"
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5 text-saffron shrink-0" />
          )}
          <span className={isOpen ? "inline" : "hidden sm:inline font-bold"}>
            {isListening ? "Listening..." : t.speakToVoice}
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-300 shrink-0" />
          ) : (
            <ChevronUp className="hidden sm:inline w-4 h-4 text-slate-300 shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
};
