"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronUp,
  ChevronDown,
  CornerDownLeft,
  X,
  RotateCcw,
  Send,
  Languages,
  ExternalLink,
  Bot,
  User
} from "lucide-react";
import { getTranslation } from "@/lib/translations";
import { generateCopilotResponse, CopilotReply } from "@/lib/voiceCopilotBrain";

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
  const [transcript, setTranscript] = useState<string>("");
  const [typedInput, setTypedInput] = useState<string>("");
  const [activeSpeechLang, setActiveSpeechLang] = useState<string>(language || "en-IN");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const initialGreeting = language.startsWith("hi")
    ? `नमस्ते ${activeCitizen.full_name.split(" ")[0]} जी! मैं आपका जन-ईपीएफ वॉयस साथी हूँ। अपने पीएफ बैलेंस, पैसे निकालने, या आधार सुधार के बारे में पूछें।`
    : language.startsWith("te")
    ? `నమస్కారం ${activeCitizen.full_name.split(" ")[0]} గారు! నేను మీ జన-ఈపీఎఫ్ సహాయకుడిని. అడ్వాన్స్ లేదా వివరాల గురించి మాట్లాడండి.`
    : `Hello ${activeCitizen.full_name.split(" ")[0]}! I am your Jan-EPF AI Assistant. How can I help you with your EPF account today?`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "copilot",
      text: initialGreeting,
      spokenText: initialGreeting,
      time: "Just now"
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Synchronize language when citizen language changes
  useEffect(() => {
    setActiveSpeechLang(language || "en-IN");
  }, [language]);

  // Initialize Speech Recognition on Mount
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
          };

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            if (event.results[current].isFinal) {
              handleProcessUserMessage(text);
            }
          };

          recognition.onerror = (err: any) => {
            console.warn("Speech recognition event error / permission:", err);
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } catch (e) {
          console.warn("Speech recognition initialization failed:", e);
        }
      }
    }
  }, [activeSpeechLang]);

  // Sweet, Melodic, Warm Multilingual Text-To-Speech Synthesis
  const speak = (text: string, targetLang?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voiceLang = targetLang || activeSpeechLang || "en-IN";
      utterance.lang = voiceLang;
      // Sweet, gentle, calm and soothing cadence
      utterance.rate = 0.88;
      utterance.pitch = 1.08;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = voiceLang.slice(0, 2);
        
        // Priority list of sweet, gentle, natural female and native voices
        const sweetNames = [
          "Google हिन्दी",
          "Google తెలుగు",
          "Google தமிழ்",
          "Google UK English Female",
          "Google US English Female",
          "Samantha",
          "Karen",
          "Moira",
          "Tessa",
          "Lekha",
          "Veena",
          "Neerja",
          "Swara",
          "Heera",
          "Sangeeta",
          "Kavya",
          "Zira",
          "Siri"
        ];

        // 1. First priority: designated sweet native voice matching language
        let matched = voices.find(
          (v) =>
            v.lang.startsWith(langPrefix) &&
            sweetNames.some((name) => v.name.toLowerCase().includes(name.toLowerCase()))
        );

        // 2. Second priority: any female / natural voice in that language
        if (!matched) {
          matched = voices.find(
            (v) =>
              v.lang.startsWith(langPrefix) &&
              (v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("natural") ||
                v.name.toLowerCase().includes("neural"))
          );
        }

        // 3. Third priority: any voice in that language
        if (!matched) {
          matched = voices.find((v) => v.lang.startsWith(langPrefix));
        }

        if (matched) {
          utterance.voice = matched;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    setIsOpen(true);
    setTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = activeSpeechLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Recognition already active or retrying:", e);
        setIsListening(false);
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

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
  };

  // Process user input via Conversational AI Brain
  const handleProcessUserMessage = (userText: string, forcedLang?: string) => {
    if (!userText.trim()) return;

    setIsListening(false);
    setTranscript("");

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      time: now
    };

    // 2. Generate intelligent response using citizen context
    const citizenContext = {
      name: activeCitizen.full_name,
      uan: activeCitizen.uan,
      balance: activeCitizen.passbook_summary?.total_balance || 342500,
      empShare: activeCitizen.passbook_summary?.employee_share || 182000,
      emprShare: activeCitizen.passbook_summary?.employer_share || 115500,
      epsShare: activeCitizen.passbook_summary?.pension_fund_share || 45000,
      interestCurrentFY: activeCitizen.passbook_summary?.interest_credited_current_fy || 27400,
      employer: activeCitizen.active_employment?.establishment_name || "Precision Auto Components",
      pensionAmount: activeCitizen.pension_details?.monthly_pension_amount,
      edliCoverage: activeCitizen.insurance_details?.edli_coverage_amount || 700000
    };

    const reply: CopilotReply = generateCopilotResponse(
      userText,
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
  };

  const quickTiles = [
    {
      label: "🇮🇳 मेडिकल इमरजेंसी के लिए पैसे निकालें",
      query: "मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं",
      lang: "hi-IN"
    },
    {
      label: "🇮🇳 నా PF బ్యాలెన్స్ & వడ్డీ చూపించండి",
      query: "నా పాస్‌బుక్ బ్యాలెన్స్ మరియు వడ్డీ ఎంత?",
      lang: "te-IN"
    },
    {
      label: "🔄 1-Click Multi-Job PF Transfer",
      query: "How to transfer previous company PF balance?",
      lang: "en-IN"
    },
    {
      label: "✍️ Fix Aadhaar Name Mismatch (≥85%)",
      query: "Fix my name mismatch with Aadhaar and run Penny Drop",
      lang: "en-IN"
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full sm:w-[420px] px-3">
      {/* Expanded Modern Glassmorphism Voice & Chat Drawer */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-sovereign-navy p-4 mb-3 transition-all animate-in slide-in-from-bottom-5 space-y-3 flex flex-col max-h-[560px]">
          {/* Top Header */}
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-saffron flex items-center justify-center text-sovereign-darkest shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-sovereign-navy">Jan-EPF AI Voice Companion</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold">
                  <Languages className="w-3 h-3" />
                  <span>Multilingual Native AI Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  title="Stop audio speech"
                  className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              )}
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversational Chat Thread (Scrollable) */}
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
                        ? "bg-sovereign-navy text-white"
                        : "bg-saffron text-sovereign-darkest"
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] space-y-1.5 shadow-2xs ${
                      isUser
                        ? "bg-sovereign-navy text-white rounded-tr-none font-medium"
                        : "bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-xs">{m.text}</p>

                    {/* Copilot Action Controls */}
                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                        {m.spokenText && (
                          <button
                            type="button"
                            onClick={() => speak(m.spokenText || m.text, m.langCode)}
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sovereign-navy hover:text-saffron bg-white px-2 py-0.5 rounded-md border border-slate-300 transition-all shadow-2xs"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Voice (🔊)</span>
                          </button>
                        )}

                        {m.targetRoute && (
                          <button
                            type="button"
                            onClick={() => {
                              stopSpeaking();
                              setIsOpen(false);
                              router.push(m.targetRoute!);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 px-2 py-0.5 rounded-md transition-all shadow-2xs"
                          >
                            <span>Open Portal</span>
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

          {/* Waveform Animation when listening */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200 shrink-0">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-7 bg-emerald-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-8 bg-saffron rounded-full animate-bounce" />
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 ml-2">
                Listening in {activeSpeechLang.split("-")[0].toUpperCase()}... Speak now
              </span>
            </div>
          )}

          {/* Type / Text Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (typedInput.trim()) {
                handleProcessUserMessage(typedInput);
                setTypedInput("");
              }
            }}
            className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Or type a question in any language..."
              className="w-full text-xs font-medium px-2 py-1 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="p-1.5 rounded-lg bg-sovereign-navy text-white hover:bg-sovereign-light disabled:opacity-40 transition-all shrink-0"
              title="Send text query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Action Suggested Prompts */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              1-Tap Instant Voice Actions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleProcessUserMessage(tile.query, tile.lang);
                  }}
                  className="text-left text-[11px] font-semibold bg-slate-50 hover:bg-sovereign-navy hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between group"
                >
                  <span className="truncate max-w-[170px]">{tile.label}</span>
                  <CornerDownLeft className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
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
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl font-bold text-sm transition-all transform hover:scale-105 border-2 ${
            isListening
              ? "bg-red-500 text-white border-white animate-pulse"
              : "bg-sovereign-navy text-white border-saffron hover:bg-sovereign-light"
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-saffron" />}
          <span>{isListening ? "Listening... Tap to Stop" : t.speakToVoice}</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-300" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>
    </div>
  );
};


