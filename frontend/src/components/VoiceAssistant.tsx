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
  Send,
  Languages
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
  const [activeSpeechLang, setActiveSpeechLang] = useState<string>(language || "en-IN");
  const [assistantResponse, setAssistantResponse] = useState<string>(
    language.startsWith("hi")
      ? "नमस्ते! मैं आपका जन-ईपीएफ वॉयस साथी हूँ। अपनी भाषा में बोलें या नीचे दिए गए विकल्प चुनें।"
      : language.startsWith("te")
      ? "నమస్కారం! నేను మీ జన-ఈపీఎఫ్ వాయిస్ సహాయకుడిని. మాట్లాడటానికి మైక్ నొక్కండి."
      : "Hello! I am your Jan-EPF AI Voice Companion. Speak naturally or select a 1-tap action below."
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Synchronize language when citizen language changes
  useEffect(() => {
    setActiveSpeechLang(language || "en-IN");
    if (language.startsWith("hi")) {
      setAssistantResponse("नमस्ते! मैं आपका जन-ईपीएफ वॉयस साथी हूँ। अपनी भाषा में बोलें या नीचे दिए गए विकल्प चुनें।");
    } else if (language.startsWith("te")) {
      setAssistantResponse("నమస్కారం! నేను మీ జన-ఈపీఎఫ్ వాయిస్ సహాయకుడిని. మాట్లాడటానికి మైక్ నొక్కండి.");
    } else if (language.startsWith("ta")) {
      setAssistantResponse("வணக்கம்! நான் உங்கள் ஜன்-இபிஎஃப் குரல் வழிகாட்டி. பேச மைக் பொத்தானை அழுத்தவும்.");
    } else {
      setAssistantResponse("Hello! I am your Jan-EPF AI Voice Companion. Speak naturally or select a 1-tap action below.");
    }
  }, [language]);

  // Initialize Speech Recognition
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
              handleProcessCommand(text);
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
        ? "माइक समर्थित नहीं है। कृपया नीचे दिए गए विकल्पों पर टैप करें।"
        : "Microphone access is not supported in this browser. Please tap any 1-click option below.";
      setAssistantResponse(fallbackMsg);
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

  // Multilingual Intent Processor with Native-Language Audio Replies
  const handleProcessCommand = (userText: string) => {
    setIsListening(false);
    const q = userText.toLowerCase();
    const balance = activeCitizen.passbook_summary?.total_balance || 342500;

    // Detect language of the input query
    const isHindi = /[\u0900-\u097F]/.test(userText) || activeSpeechLang.startsWith("hi");
    const isTelugu = /[\u0C00-\u0C7F]/.test(userText) || activeSpeechLang.startsWith("te");
    const isTamil = /[\u0B80-\u0BFF]/.test(userText) || activeSpeechLang.startsWith("ta");

    let replyText = "";
    let targetRoute = "";
    let replyLang = "en-IN";

    // 1. Money / Emergency Medical / Advance
    if (
      q.includes("money") ||
      q.includes("medical") ||
      q.includes("advance") ||
      q.includes("withdraw") ||
      q.includes("hospital") ||
      q.includes("पैसे") ||
      q.includes("निकाल") ||
      q.includes("इलाज") ||
      q.includes("अग्रिम") ||
      q.includes("డబ్బులు") ||
      q.includes("వైద్యం") ||
      q.includes("பணம்") ||
      q.includes("மருத்துவ")
    ) {
      targetRoute = "/money";
      if (isHindi) {
        replyLang = "hi-IN";
        replyText = "आपातकालीन चिकित्सा अग्रिम (पैरा 68J) खोला जा रहा है। आपकी राशि तुरंत आपके बैंक में स्वीकृत कर दी जाएगी।";
      } else if (isTelugu) {
        replyLang = "te-IN";
        replyText = "మెడికల్ ఎమర్జెన్సీ అడ్వాన్స్ (పారా 68J) ఓపెన్ చేయబడుతోంది. మీ మొత్తం తక్షణమే ఆటో-మంజూరు చేయబడుతుంది.";
      } else if (isTamil) {
        replyLang = "ta-IN";
        replyText = "மருத்துவ அவசர முன்பணம் திறக்கப்படுகிறது. உங்கள் தொகை உடனடியாக அங்கீகரிக்கப்படும்.";
      } else {
        replyLang = "en-IN";
        replyText = "Opening Emergency Medical Advance under Para 68J. Your eligible balance is pre-calculated for instant auto-approval.";
      }
    }
    // 2. Job Switch / Transfer / Exit Date
    else if (
      q.includes("job") ||
      q.includes("transfer") ||
      q.includes("company") ||
      q.includes("exit") ||
      q.includes("switch") ||
      q.includes("बदली") ||
      q.includes("कंपनी") ||
      q.includes("नौकरी") ||
      q.includes("ట్రాన్స్ఫర్") ||
      q.includes("కంపెనీ") ||
      q.includes("ఉద్యోగం") ||
      q.includes("மாற்ற")
    ) {
      targetRoute = "/career";
      if (isHindi) {
        replyLang = "hi-IN";
        replyText = "जॉब ट्रांसफर हब खोला जा रहा है। आपकी पुरानी कंपनी का पीएफ बैलेंस नए खाते में तुरंत मर्ज किया जाएगा।";
      } else if (isTelugu) {
        replyLang = "te-IN";
        replyText = "జాబ్ స్విచ్ హబ్ ఓపెన్ చేయబడుతోంది. మీ పాత కంపెనీ PF బ్యాలెన్స్ విలీనం చేయబడుతోంది.";
      } else if (isTamil) {
        replyLang = "ta-IN";
        replyText = "வேலை மாற்ற பக்கம் திறக்கப்படுகிறது. உங்கள் பழைய பிஎஃப் இருப்பு இணைக்கப்படுகிறது.";
      } else {
        replyLang = "en-IN";
        replyText = "Opening Job Switch Hub. Checking your previous member IDs and auto-deducing missing Date of Exit.";
      }
    }
    // 3. Passbook / Balance / Interest / Pension
    else if (
      q.includes("passbook") ||
      q.includes("balance") ||
      q.includes("interest") ||
      q.includes("saving") ||
      q.includes("pension") ||
      q.includes("बचत") ||
      q.includes("ब्याज") ||
      q.includes("पासबुक") ||
      q.includes("पेंशन") ||
      q.includes("వడ్డీ") ||
      q.includes("పాస్‌బుక్") ||
      q.includes("పెన్షన్") ||
      q.includes("வட்டி") ||
      q.includes("ஓய்வூதிய")
    ) {
      targetRoute = "/savings";
      if (isHindi) {
        replyLang = "hi-IN";
        replyText = `आपकी पासबुक खोली जा रही है। आपका कुल बैलेंस ₹${balance.toLocaleString("en-IN")} है और 8.25% ब्याज दर लागू है।`;
      } else if (isTelugu) {
        replyLang = "te-IN";
        replyText = `మీ పాస్‌బుక్ ఓపెన్ చేయబడుతోంది. మీ మొత్తం బ్యాలెన్స్ ₹${balance.toLocaleString("en-IN")} మరియు 8.25% వడ్డీ లభిస్తుంది.`;
      } else if (isTamil) {
        replyLang = "ta-IN";
        replyText = `உங்கள் சேமிப்பு புத்தகம் திறக்கப்படுகிறது. உங்கள் மொத்த இருப்பு ₹${balance.toLocaleString("en-IN")}.`;
      } else {
        replyLang = "en-IN";
        replyText = `Opening Visual Passbook. Your current balance is ₹${balance.toLocaleString("en-IN")} at 8.25% sovereign interest.`;
      }
    }
    // 4. Fix Details / Name Correction / KYC / Penny Drop
    else if (
      q.includes("fix") ||
      q.includes("name") ||
      q.includes("kyc") ||
      q.includes("correction") ||
      q.includes("penny") ||
      q.includes("सुधार") ||
      q.includes("नाम") ||
      q.includes("बैंक") ||
      q.includes("పేరు") ||
      q.includes("సరిదిద్దు") ||
      q.includes("బ్యాంక్") ||
      q.includes("பெயர்")
    ) {
      targetRoute = "/fix";
      if (isHindi) {
        replyLang = "hi-IN";
        replyText = "विवरण सुधार हब खोला जा रहा है। आधार नाम मिलान और 1-क्लिक बैंक पेनी ड्रॉप सत्यापन सक्रिय है।";
      } else if (isTelugu) {
        replyLang = "te-IN";
        replyText = "వివరాల సవరణ హబ్ ఓపెన్ చేయబడుతోంది. ఆధార్ పేరు సరిపోలిక మరియు బ్యాంక్ పెన్నీ డ్రాప్ సిద్ధంగా ఉన్నాయి.";
      } else if (isTamil) {
        replyLang = "ta-IN";
        replyText = "விவரங்கள் திருத்த பக்கம் திறக்கப்படுகிறது. ஆதார் பெயர் சரிபார்ப்பு தயாராக உள்ளது.";
      } else {
        replyLang = "en-IN";
        replyText = "Opening Fix Details Hub for instant Aadhaar fuzzy verification, 1-click Penny Drop, and Joint Declaration.";
      }
    }
    // Default fallback
    else {
      targetRoute = "/";
      if (isHindi) {
        replyLang = "hi-IN";
        replyText = "नमस्ते! मैंने आपका अनुरोध समझ लिया है। आपके लिए जन-ईपीएफ के मुख्य पोर्टल खोले जा रहे हैं।";
      } else if (isTelugu) {
        replyLang = "te-IN";
        replyText = "నమస్కారం! మీ అభ్యర్థనను అర్థం చేసుకున్నాను. జన-ఈపీఎఫ్ పోర్టల్స్ తెరవబడుతున్నాయి.";
      } else {
        replyLang = "en-IN";
        replyText = "I understood your request. Guiding you to the Jan-EPF AI Life Event Portals.";
      }
    }

    setActiveSpeechLang(replyLang);
    setAssistantResponse(replyText);
    speak(replyText, replyLang);

    if (targetRoute) {
      setTimeout(() => {
        router.push(targetRoute);
      }, 1600);
    }
  };

  const quickTiles = [
    {
      label: "🇮🇳 मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं",
      query: "मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं",
      lang: "hi-IN"
    },
    {
      label: "🇮🇳 నా పాత కంపెనీ PF బ్యాలెన్స్ ట్రాన్స్ఫర్ చేయండి",
      query: "నా పాత కంపెనీ PF బ్యాలెన్స్ ట్రాన్స్ఫర్ చేయండి",
      lang: "te-IN"
    },
    {
      label: "📊 Show my interest earned & passbook balance",
      query: "Show my interest earned and passbook balance",
      lang: "en-IN"
    },
    {
      label: "✨ Fix my name mismatch with Aadhaar",
      query: "Fix my name mismatch and bank details",
      lang: "en-IN"
    }
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
                <h4 className="text-xs font-black text-sovereign-navy">Jan-EPF Sweet Voice AI</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                  <Languages className="w-3 h-3" />
                  <span>Multilingual Native Reply Active</span>
                </div>
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
              <Volume2
                className={`w-4 h-4 text-sovereign-navy mt-0.5 shrink-0 ${
                  isSpeaking ? "animate-bounce text-saffron" : ""
                }`}
              />
              <div className="flex-1">
                <p className="font-bold leading-relaxed text-slate-900">{assistantResponse}</p>
                {transcript && (
                  <p className="mt-1.5 text-[11px] text-slate-500 italic border-t border-slate-200/80 pt-1">
                    You said: "{transcript}"
                  </p>
                )}
              </div>
            </div>

            {/* Replay Audio Button */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => speak(assistantResponse, activeSpeechLang)}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sovereign-navy hover:text-saffron bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-2xs transition-all"
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
            <div className="grid grid-cols-1 gap-1.5">
              {quickTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(tile.query);
                    if (tile.lang) {
                      setActiveSpeechLang(tile.lang);
                    }
                    handleProcessCommand(tile.query);
                  }}
                  className="text-left text-xs font-semibold bg-slate-50 hover:bg-sovereign-navy hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between group"
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


