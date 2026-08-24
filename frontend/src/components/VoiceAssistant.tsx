"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  Activity,
  ShieldCheck,
  Building2
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

  const uan = activeCitizen.uan || "100982348712";
  const fullName = activeCitizen.full_name || "Citizen";
  const firstName = fullName.split(" ")[0];
  const company = activeCitizen.active_employment?.establishment_name || "Active Employer";
  const balanceStr = (activeCitizen.passbook_summary?.total_balance ?? 0).toLocaleString("en-IN");

  // Determine persona-specific attributes
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
        : `Hello Sardar Gurmeet Singh Ji! Welcome to your EPS-95 Senior Pension portal. Your monthly pension of ₹3,250/mo is active. How can I assist with your Jeevan Pramaan life certificate?`;
    } else if (isPriya) {
      greeting = language.startsWith("hi")
        ? `नमस्ते प्रिया जी! आपके ${company} खाते में ₹${balanceStr} हैं। आपकी पिछली इंफोसिस नौकरी की एग्जिट डेट ऑटो-डिड्यूस करने या खाता ट्रांसफर करने के लिए कहें।`
        : `Hello Priya! Your total corpus is ₹${balanceStr}. I can help you auto-deduce your missing exit date for Infosys and merge your previous accounts in 1 click.`;
    } else if (isSunita) {
      greeting = language.startsWith("hi")
        ? `नमस्ते सुनीता जी! आपके ${company} खाते में ₹${balanceStr} जमा हैं। ₹7 लाख ईडीएलआई नॉमिनेशन भरने या 1-क्लिक बैंक पेनी ड्रॉप सत्यापन के बारे में पूछें।`
        : `Hello Sunita Devi! Your active balance is ₹${balanceStr}. I can assist you with 1-Click Penny Drop Bank KYC and ₹7 Lakh free EDLI nomination for Manoj Kumar.`;
    } else {
      greeting = language.startsWith("hi")
        ? `नमस्ते रमेश कुमार जी! आपके पेन्या अपेरल्स पीएफ खाते में ₹${balanceStr} जमा हैं। आप ₹48,000 मेडिकल एडवांस या 0% टीडीएस नियम के बारे में पूछ सकते हैं।`
        : `Hello Ramesh Kumar! Your Peenya Apparels EPF balance is ₹${balanceStr} (14.5 yrs service, 0% TDS). How can I assist with your Para 68J emergency advance today?`;
    }

    setMessages([
      {
        id: `init-${uan}-${Date.now()}`,
        sender: "copilot",
        text: greeting,
        spokenText: greeting,
        time: "Just now"
      }
    ]);
  }, [uan, fullName, balanceStr, language, isGurmeet, isPriya, isSunita, company]);

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

    // Construct context strictly from active citizen
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

  // 100% Account-Specific Evaluator Test Pills
  const accountTestPills = useMemo(() => {
    if (isRamesh) {
      return [
        { label: "🇮🇳 [हिंदी] ₹48k मेडिकल एडवांस", query: "मुझे पेन्या अपेरल्स पीएफ से ₹48,000 मेडिकल एडवांस चाहिए", lang: "hi-IN" },
        { label: "🛡️ [TDS] 0% टैक्स छूट नियम", query: "मेरी 14.5 साल की सेवा पर 0% टीडीएस नियम बताएं", lang: "hi-IN" },
        { label: "📜 [Passbook] Peenya Apparels", query: "पेन्या अपेरल्स पीएफ बैलेंस और 8.25% ब्याज विवरण", lang: "hi-IN" },
        { label: "🇬🇧 [English] Para 68J Medical Cap", query: "Check my Para 68J maximum medical advance limit", lang: "en-IN" }
      ];
    }
    if (isPriya) {
      return [
        { label: "💼 [Career] Infosys PF ट्रांसफर करें", query: "इंफोसिस से नया पीएफ खाता ट्रांसफर और मर्ज करें", lang: "hi-IN" },
        { label: "📅 [ECR] एग्जिट डेट ऑटो-डिड्यूस", query: "इंफोसिस नौकरी छोड़ने की तारीख ECR से निकालें", lang: "hi-IN" },
        { label: "🔍 [Fuzzy] आधार नाम स्पेलिंग फिक्स", query: "आधार और पीएफ में प्रिया शर्मा नाम सुधार", lang: "hi-IN" },
        { label: "🇬🇧 [English] Merge 3 PF Accounts", query: "Merge my 3 previous PF accounts to active UAN", lang: "en-IN" }
      ];
    }
    if (isGurmeet) {
      return [
        { label: "👴 [Pension] अगस्त पेंशन स्टेटस (₹3,250)", query: "मेरी मासिक ईपीएस-95 पेंशन और पीपीओ स्थिति", lang: "hi-IN" },
        { label: "🪪 [DLC] जीवन प्रमाण पत्र रिन्यू", query: "डिजिटल जीवन प्रमाण पत्र रिन्यू करें", lang: "hi-IN" },
        { label: "🛡️ [Family] विधवा पेंशन अधिकार", query: "ईपीएस-95 परिवार एवं विधवा पेंशन नियम बताएं", lang: "hi-IN" },
        { label: "🇬🇧 [English] Check PPO-DL-2024-99881", query: "Check my PPO-DL-2024-99881 pension disbursement", lang: "en-IN" }
      ];
    }
    // Sunita Devi
    return [
      { label: "🏦 [KYC] 1-Click पेनी ड्रॉप वेरिफिकेशन", query: "बैंक खाते का तत्काल पेनी ड्रॉप सत्यापन करें", lang: "hi-IN" },
      { label: "🛡️ [EDLI] ₹7 लाख नॉमिनेशन भरें", query: "मनोज कुमार को ₹7 लाख ईडीएलआई बीमा का नॉमिनी बनाएं", lang: "hi-IN" },
      { label: "📈 [Score] रेडीनेस स्कोर 98% करें", query: "मेरा क्लेम रेडीनेस स्कोर 78% से 98% कैसे होगा?", lang: "hi-IN" },
      { label: "🇬🇧 [English] Surat Logistics KYC", query: "Verify bank KYC for Surat Logistics account", lang: "en-IN" }
    ];
  }, [isRamesh, isPriya, isGurmeet]);

  // 100% Account-Specific Quick Action Tiles
  const accountQuickTiles = useMemo(() => {
    if (isRamesh) {
      return [
        { label: "🏥 Peenya Apparels ₹1.56L Advance", query: "मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं", lang: "hi-IN" },
        { label: "📊 8.25% FY Interest Credit", query: "पेन्या अपेरल्स में इस साल का ब्याज कितना है?", lang: "hi-IN" },
        { label: "🛡️ Section 192A TDS 0% Proof", query: "मेरी सेवा 14.5 साल है, टीडीएस क्यों शून्य है?", lang: "hi-IN" },
        { label: "✍️ Check Bank A/C ••••8712", query: "बैंक खाता सत्यापन स्थिति", lang: "hi-IN" }
      ];
    }
    if (isPriya) {
      return [
        { label: "🔄 1-Click Form 13 Job Switch", query: "How to transfer previous company PF balance?", lang: "en-IN" },
        { label: "📅 Deducing Infosys Exit Date", query: "How does ECR auto-deduce missing date of exit?", lang: "en-IN" },
        { label: "📈 Cyber Hub ₹4.75L Compounding", query: "నా పాస్‌బుక్ బ్యాలెన్స్ మరియు వడ్డీ ఎంత?", lang: "te-IN" },
        { label: "✍️ Aadhaar Priyaa vs Priya Fix", query: "Fix my name mismatch with Aadhaar and run Penny Drop", lang: "en-IN" }
      ];
    }
    if (isGurmeet) {
      return [
        { label: "👴 ₹3,250/mo Pension Disbursement", query: "मेरी मासिक पेंशन कब खाते में आएगी?", lang: "hi-IN" },
        { label: "🪪 Facial Biometric Jeevan Pramaan", query: "जीवन प्रमाण पत्र फेस आरडी कैसे काम करता है?", lang: "hi-IN" },
        { label: "🛡️ EPS-95 Widow Pension ₹1,625", query: "परिवार पेंशन के क्या नियम हैं?", lang: "hi-IN" },
        { label: "📜 PPO-DL-2024-99881 Slip", query: "Download my digital PPO card", lang: "en-IN" }
      ];
    }
    // Sunita Devi
    return [
      { label: "🏦 NPCI Penny Drop (HDFC ••••8912)", query: "बैंक खाते का तत्काल पेनी ड्रॉप सत्यापन करें", lang: "hi-IN" },
      { label: "🛡️ ₹7 Lakh Free EDLI Insurance", query: "ईडीएलआई 1976 बीमा के क्या नियम हैं?", lang: "hi-IN" },
      { label: "📋 Nominee: Manoj Kumar (100%)", query: "मनोज कुमार को ई-नॉमिनी कैसे बनाएं?", lang: "hi-IN" },
      { label: "📈 Claim Readiness 78% -> 98%", query: "मेरा क्लेम रेडीनेस स्कोर कैसे बढ़ेगा?", lang: "hi-IN" }
    ];
  }, [isRamesh, isPriya, isGurmeet]);

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isOpen
          ? "bottom-4 right-2 left-2 sm:left-auto sm:right-4 max-w-md w-auto sm:w-[430px] px-1 sm:px-2"
          : "bottom-20 right-3.5 sm:bottom-5 sm:right-5"
      }`}
    >
      {/* 1. ULTRA-LUXURY SEE-THROUGH GLASSMODAL CONTAINER */}
      {isOpen && (
        <div className="backdrop-blur-2xl bg-slate-900/65 dark:bg-slate-950/75 border border-white/25 dark:border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.75)] p-4 sm:p-5 mb-3 transition-all animate-in slide-in-from-bottom-5 space-y-3 flex flex-col max-h-[78vh] relative overflow-hidden ring-1 ring-white/15 text-white">
          {/* Ambient Saffron / Cyan Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-saffron/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Frosted Glass Header */}
          <div className="relative z-10 flex justify-between items-center pb-2.5 border-b border-white/15 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-saffron/90 flex items-center justify-center text-sovereign-darkest shadow-md ring-1 ring-white/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-white tracking-tight">Jan-EPF Sovereign Voice AI</h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-medium">
                  <span className="text-saffron font-bold truncate max-w-[120px]">{firstName}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400 text-[9px]">{uan.slice(0, 4)} •••• {uan.slice(-4)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  title="Stop audio speech"
                  className="text-amber-300 hover:text-amber-100 p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all shadow-sm"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Mute</span>
                </button>
              )}

              <button
                onClick={() => {
                  stopSpeaking();
                  stopListening();
                  setIsOpen(false);
                }}
                className="text-slate-300 hover:text-white p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all backdrop-blur-md"
                title="Minimize voice copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Account Context Chip Bar */}
          <div className="relative z-10 px-2.5 py-1.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/15 flex items-center justify-between text-[10px] text-slate-300 font-mono shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3 h-3 text-saffron shrink-0" />
              <span className="truncate max-w-[160px] font-bold text-white">{company}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
              <ShieldCheck className="w-3 h-3" />
              <span>₹{balanceStr}</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="relative z-10 flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 text-xs max-h-[260px] scroll-touch">
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
                        ? "bg-saffron text-sovereign-darkest shadow-md"
                        : "bg-white/20 text-white border border-white/25"
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-saffron" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] space-y-1.5 shadow-md ${
                      isUser
                        ? "backdrop-blur-md bg-saffron/90 text-sovereign-darkest font-semibold rounded-tr-none border border-saffron/80"
                        : "backdrop-blur-md bg-white/15 dark:bg-slate-800/60 text-slate-100 rounded-tl-none border border-white/20 dark:border-white/10"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-xs">{m.text}</p>

                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/15">
                        {m.spokenText && (
                          <button
                            type="button"
                            onClick={() => speak(m.spokenText || m.text, m.langCode)}
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white hover:text-saffron bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded-md border border-white/20 transition-all backdrop-blur-md shadow-sm"
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
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sovereign-darkest bg-saffron hover:bg-saffron-light px-2.5 py-0.5 rounded-md transition-all shadow-md font-bold"
                          >
                            <span>Open Hub</span>
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
            <div className="relative z-10 flex items-center justify-between px-3 py-2 bg-emerald-950/60 backdrop-blur-md rounded-xl border border-emerald-400/40 shrink-0">
              <div className="flex items-center gap-1">
                <span
                  style={{ height: `${Math.max(8, micVolume * 0.35)}px` }}
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                />
                <span
                  style={{ height: `${Math.max(12, micVolume * 0.55)}px` }}
                  className="w-1 bg-emerald-300 rounded-full transition-all duration-75"
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
                  className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                />
                <span
                  style={{ height: `${Math.max(7, micVolume * 0.3)}px` }}
                  className="w-1 bg-emerald-300 rounded-full transition-all duration-75"
                />
              </div>

              <span className="text-[11px] font-bold text-emerald-300 truncate max-w-[200px]">
                {transcript ? `"${transcript}"` : `Listening for ${firstName}...`}
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
                className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-bold"
              >
                Done
              </button>
            </div>
          )}

          {/* 100% Account-Specific Evaluator Test Pills */}
          <div className="relative z-10 space-y-1 pt-1 border-t border-white/15">
            <div className="flex justify-between items-center text-[10px] text-slate-300 font-bold">
              <span>⚡ Account-Specific Voice Test Prompts:</span>
              <span className="text-saffron font-mono">{firstName}&apos;s Profile</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {accountTestPills.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleProcessUserMessage(pill.query, pill.lang)}
                  className="px-2 py-1 rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-semibold transition-all text-left shadow-sm hover:border-saffron/60"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Glass Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (typedInput.trim()) {
                handleProcessUserMessage(typedInput);
                setTypedInput("");
              }
            }}
            className="relative z-10 flex items-center gap-1.5 backdrop-blur-md bg-white/10 dark:bg-white/5 p-1.5 rounded-2xl border border-white/20 focus-within:border-saffron/70 shrink-0 transition-all"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={`Ask anything for ${firstName}: 'Balance?', 'Withdraw?', 'TDS?'...`}
              className="w-full text-xs font-medium px-2.5 py-1.5 bg-transparent focus:outline-none text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="p-2 rounded-xl bg-saffron text-sovereign-darkest hover:bg-saffron-light disabled:opacity-40 transition-all shrink-0 shadow-md font-bold"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Account-Specific Quick Query Tiles */}
          <div className="relative z-10 space-y-1 shrink-0">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              1-Tap Account Queries ({company})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {accountQuickTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleProcessUserMessage(tile.query, tile.lang);
                  }}
                  className="text-left text-[11px] font-semibold backdrop-blur-md bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl border border-white/15 transition-all flex items-center justify-between group truncate hover:border-saffron/50"
                >
                  <span className="truncate max-w-[170px]">{tile.label}</span>
                  <CornerDownLeft className="w-3 h-3 text-slate-400 group-hover:text-saffron shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ULTRA-PREMIUM SEE-THROUGH GLASS FLOATING ACTION BUTTON */}
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
          className={`flex items-center shadow-[0_10px_35px_rgba(0,0,0,0.5)] font-bold transition-all duration-300 transform hover:scale-105 border ${
            isListening
              ? "backdrop-blur-xl bg-red-600/50 border-red-300 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse"
              : "backdrop-blur-xl bg-slate-900/40 hover:bg-slate-900/60 dark:bg-slate-950/45 dark:hover:bg-slate-950/65 border-white/30 hover:border-saffron/80 text-white ring-1 ring-white/15 hover:shadow-[0_0_25px_rgba(255,153,51,0.4)]"
          } ${
            isOpen
              ? "px-4 py-2.5 rounded-full text-xs sm:text-sm gap-2"
              : "p-3.5 sm:px-4 sm:py-3 rounded-full text-sm gap-2.5"
          }`}
          title="Speak to Jan-EPF Voice Copilot"
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-red-200" />
          ) : (
            <Mic className="w-5 h-5 text-saffron shrink-0" />
          )}
          <span className={isOpen ? "inline" : "hidden sm:inline font-bold text-white drop-shadow-sm"}>
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
