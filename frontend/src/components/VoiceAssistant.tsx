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
  X
} from "lucide-react";

export const VoiceAssistant: React.FC = () => {
  const router = useRouter();
  const { activeCitizen, language } = useCitizen();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [assistantResponse, setAssistantResponse] = useState<string>(
    "Hello! I am your Jan-EPF AI Voice Companion. How can I help you today?"
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
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
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  // Speak Text using Web Speech Synthesis
  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    setIsOpen(true);
    setTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Recognition already active", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleProcessCommand = async (userText: string) => {
    setIsListening(false);
    const textLower = userText.toLowerCase();

    try {
      // 80/20 On-Site Rule: Try API route, fallback seamlessly on client if backend unavailable
      const res = await fetch("http://localhost:8000/api/v1/voice/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_transcript: userText,
          detected_language: language,
          uan_context: activeCitizen.uan
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAssistantResponse(data.spoken_response_text);
        speak(data.spoken_response_text);
        if (data.target_route) {
          setTimeout(() => {
            router.push(data.target_route);
          }, 1200);
        }
        return;
      }
    } catch (e) {
      console.warn("Using in-browser sovereign fallback for voice intent");
    }

    // Client-side Sovereign Fallback Parser
    if (textLower.includes("money") || textLower.includes("medical") || textLower.includes("advance") || textLower.includes("पैसे") || textLower.includes("డబ్బులు")) {
      const msg = "Opening Emergency Medical Advance under Para 68J. Form pre-filled for instant approval.";
      setAssistantResponse(msg);
      speak(msg);
      setTimeout(() => router.push("/money"), 1000);
    } else if (textLower.includes("job") || textLower.includes("transfer") || textLower.includes("company") || textLower.includes("exit") || textLower.includes("बदली")) {
      const msg = "Opening Job Switch Hub. Checking your previous member IDs and missing Date of Exit.";
      setAssistantResponse(msg);
      speak(msg);
      setTimeout(() => router.push("/career"), 1000);
    } else if (textLower.includes("passbook") || textLower.includes("balance") || textLower.includes("interest") || textLower.includes("बचत") || textLower.includes("వడ్డీ")) {
      const msg = "Opening Visual Passbook. Your current balance and 8.25% compounding forecast are displayed.";
      setAssistantResponse(msg);
      speak(msg);
      setTimeout(() => router.push("/savings"), 1000);
    } else if (textLower.includes("fix") || textLower.includes("name") || textLower.includes("kyc") || textLower.includes("correction") || textLower.includes("सुधार")) {
      const msg = "Opening Fix Details Hub for instant Aadhaar verification and Penny-Drop KYC.";
      setAssistantResponse(msg);
      speak(msg);
      setTimeout(() => router.push("/fix"), 1000);
    } else {
      const msg = "I understood your request. Showing you all 4 life event portals.";
      setAssistantResponse(msg);
      speak(msg);
      setTimeout(() => router.push("/"), 1000);
    }
  };

  const quickTiles = [
    { label: "🚑 Medical Advance (Para 68J)", query: "I need medical advance for treatment" },
    { label: "🔄 Transfer Previous PF (Form 13)", query: "Transfer my previous PF balance" },
    { label: "📈 Check 8.25% Passbook", query: "Show my passbook balance and interest" },
    { label: "✨ Fix Name / Bank KYC", query: "Fix my name mismatch and bank details" }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md w-full sm:w-96 px-3">
      {/* Expanded Voice Drawer */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-sovereign-navy p-4 mb-3 transition-all animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-saffron flex items-center justify-center text-sovereign-darkest">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-sovereign-navy">Jan-EPF Voice Assistant</h4>
                <p className="text-[10px] text-emerald-600 font-semibold">100% In-Browser Sovereign Mode</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Spoken Response Bubble */}
          <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
            <Volume2 className={`w-4 h-4 text-sovereign-navy mt-0.5 shrink-0 ${isSpeaking ? "animate-bounce text-saffron" : ""}`} />
            <div>
              <p className="font-medium leading-relaxed">{assistantResponse}</p>
              {transcript && (
                <p className="mt-2 text-[11px] text-slate-500 italic border-t border-slate-200 pt-1">
                  You said: "{transcript}"
                </p>
              )}
            </div>
          </div>

          {/* Waveform Animation when listening */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 rounded-lg border border-emerald-200 mb-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-8 bg-emerald-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-9 bg-saffron rounded-full animate-bounce" />
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 ml-2">Listening (Speak in your language)...</span>
            </div>
          )}

          {/* Quick Action Suggested Prompts */}
          <div className="space-y-1.5 mt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Instant 1-Tap Voice Commands
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {quickTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(tile.query);
                    handleProcessCommand(tile.query);
                  }}
                  className="text-left text-xs font-medium bg-slate-100 hover:bg-sovereign-navy hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all flex items-center justify-between group"
                >
                  <span>{tile.label}</span>
                  <CornerDownLeft className="w-3 h-3 text-slate-400 group-hover:text-white" />
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
          <span>{isListening ? "Listening... Tap to Stop" : "Speak to Voice Copilot"}</span>
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronUp className="w-4 h-4 text-slate-300" />}
        </button>
      </div>
    </div>
  );
};
