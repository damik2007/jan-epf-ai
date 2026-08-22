"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  CornerDownLeft,
  X,
  RotateCcw,
  Send
} from "lucide-react";
import { getTranslation } from "@/lib/translations";

export const VoiceAssistant: React.FC = () => {
  const router = useRouter();
  const { activeCitizen, language } = useCitizen();
  const t = getTranslation(language);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [typedInput, setTypedInput] = useState<string>("");
  const [assistantResponse, setAssistantResponse] = useState<string>(
    "Hello! I am your Jan-EPF AI Voice Companion. Tap the microphone or select a prompt below to hear my answer."
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

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
          recognition.lang = language || "en-IN";

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            if (event.results[current].isFinal) {
              handleProcessCommand(text);
            }
          };

          recognition.onerror = (err: any) => {
            console.warn("Speech recognition error / permission denied:", err);
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
  }, [language]);

  // Robust Text-To-Speech function
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language || "en-IN";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = (language || "en").slice(0, 2);
        const matchedVoice = voices.find((v) => v.lang.startsWith(langPrefix));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (err) => {
        console.warn("Speech synthesis playback event error:", err);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    setIsOpen(true);
    setTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language || "en-IN";
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Recognition already active or blocked:", e);
        setIsListening(false);
      }
    } else {
      // Fallback message if browser lacks SpeechRecognition
      const fallbackMsg = "Microphone access is not supported in this browser. Please tap any quick command or type your query below.";
      setAssistantResponse(fallbackMsg);
      speak(fallbackMsg);
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

  // Instant Sovereign Intent Parser (Sub-1ms, Zero-Latency, Works 100% Offline)
  const handleProcessCommand = (userText: string) => {
    setIsListening(false);
    const textLower = userText.toLowerCase();

    let replyText = "";
    let targetRoute = "";

    if (
      textLower.includes("money") ||
      textLower.includes("medical") ||
      textLower.includes("advance") ||
      textLower.includes("withdraw") ||
      textLower.includes("पैसे") ||
      textLower.includes("निकाल") ||
      textLower.includes("డబ్బులు") ||
      textLower.includes("பணம்")
    ) {
      replyText = "Opening Emergency Medical Advance under Para 68J. Your eligible balance is pre-calculated for instant auto-approval.";
      targetRoute = "/money";
    } else if (
      textLower.includes("job") ||
      textLower.includes("transfer") ||
      textLower.includes("company") ||
      textLower.includes("exit") ||
      textLower.includes("switch") ||
      textLower.includes("बदली") ||
      textLower.includes("ట్రాన్స్ఫర్") ||
      textLower.includes("மாற்ற")
    ) {
      replyText = "Opening Job Switch Hub. Checking your previous member IDs and auto-deducing missing Date of Exit.";
      targetRoute = "/career";
    } else if (
      textLower.includes("passbook") ||
      textLower.includes("balance") ||
      textLower.includes("interest") ||
      textLower.includes("saving") ||
      textLower.includes("pension") ||
      textLower.includes("बचत") ||
      textLower.includes("ब्याज") ||
      textLower.includes("వడ్డీ") ||
      textLower.includes("வட்டி")
    ) {
      replyText = `Opening Visual Passbook. Your current balance is ₹${activeCitizen.passbook_summary.total_balance.toLocaleString("en-IN")} at 8.25% sovereign interest.`;
      targetRoute = "/savings";
    } else if (
      textLower.includes("fix") ||
      textLower.includes("name") ||
      textLower.includes("kyc") ||
      textLower.includes("correction") ||
      textLower.includes("penny") ||
      textLower.includes("सुधार") ||
      textLower.includes("పేరు") ||
      textLower.includes("பெயர்")
    ) {
      replyText = "Opening Fix Details Hub for instant Aadhaar fuzzy verification, 1-click Penny Drop, and Joint Declaration.";
      targetRoute = "/fix";
    } else {
      replyText = "I understood your request. Guiding you to the Jan-EPF AI Life Event Portals.";
      targetRoute = "/";
    }

    setAssistantResponse(replyText);
    speak(replyText);

    if (targetRoute) {
      setTimeout(() => {
        router.push(targetRoute);
      }, 1500);
    }
  };

  const quickTiles = [
    { label: "🇮🇳 मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं", query: "मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं" },
    { label: "🇮🇳 నా పాత కంపెనీ PF బ్యాలెన్స్ ట్రాన్స్ఫర్ చేయండి", query: "నా పాత కంపెనీ PF బ్యాలెన్స్ ట్రాన్స్ఫర్ చేయండి" },
    { label: "📊 Show my interest earned this financial year", query: "Show my interest earned and passbook balance" },
    { label: "✨ Fix my name mismatch with Aadhaar", query: "Fix my name mismatch and bank details" }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md w-full sm:w-96 px-3">
      {/* Expanded Voice Drawer */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-sovereign-navy p-5 mb-3 transition-all animate-in slide-in-from-bottom-5 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-saffron flex items-center justify-center text-sovereign-darkest shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-sovereign-navy">Jan-EPF AI Voice Companion</h4>
                <p className="text-[10px] text-emerald-700 font-bold">● Sovereign Zero-Latency Active</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Spoken Response Bubble */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 space-y-2">
            <div className="flex items-start gap-2.5">
              <Volume2 className={`w-4 h-4 text-sovereign-navy mt-0.5 shrink-0 ${isSpeaking ? "animate-bounce text-saffron" : ""}`} />
              <div className="flex-1">
                <p className="font-semibold leading-relaxed text-slate-900">{assistantResponse}</p>
                {transcript && (
                  <p className="mt-1.5 text-[11px] text-slate-500 italic border-t border-slate-200/80 pt-1">
                    You asked: "{transcript}"
                  </p>
                )}
              </div>
            </div>

            {/* Replay Audio Button */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => speak(assistantResponse)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-sovereign-navy hover:text-saffron bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay Voice (🔊)</span>
              </button>
            </div>
          </div>

          {/* Waveform Animation when listening */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-8 bg-emerald-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-9 bg-saffron rounded-full animate-bounce" />
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 ml-2">Listening... Speak now</span>
            </div>
          )}

          {/* Type / Text Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (typedInput.trim()) {
                setTranscript(typedInput);
                handleProcessCommand(typedInput);
                setTypedInput("");
              }
            }}
            className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Or type a question here..."
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
              Instant 1-Tap Voice Actions
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {quickTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(tile.query);
                    handleProcessCommand(tile.query);
                  }}
                  className="text-left text-xs font-medium bg-slate-50 hover:bg-sovereign-navy hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between group"
                >
                  <span className="truncate max-w-[280px]">{tile.label}</span>
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
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronUp className="w-4 h-4 text-slate-300" />}
        </button>
      </div>
    </div>
  );
};

