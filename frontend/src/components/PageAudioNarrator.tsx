"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { playNeuralSpeech, stopNeuralSpeech } from "@/lib/edgeTtsPlayer";

interface PageAudioNarratorProps {
  hub: "money" | "career" | "savings" | "fix";
}

const NARRATIONS: Record<
  "money" | "career" | "savings" | "fix",
  { en: string; hi: string; te: string; ta: string }
> = {
  money: {
    en: "Welcome to the Advance Hub. Here you can withdraw non-refundable PF advances under Para 68 for medical emergencies, house construction, or education with zero employer attestation and instant pre-flight cheque verification.",
    hi: "नमस्ते! अग्रिम निकासी केंद्र में आपका स्वागत है। यहाँ आप बीमारी, मकान या शिक्षा के लिए बिना किसी कागजी देरी के पीएफ अग्रिम निकाल सकते हैं। बस कारण चुनें और अपना चेक अपलोड करें।",
    te: "నమస్కారం! పీఎఫ్ అడ్వాన్స్ విత్‌డ్రా హబ్‌కు స్వాగతం. ఇక్కడ మీరు మెడికల్ ఎమర్జెన్సీ లేదా ఇంటి నిర్మాణం కోసం 1-క్లిక్‌తో అడ్వాన్స్ డబ్బులను నేరుగా మీ బ్యాంక్ ఖాతాకు పొందవచ్చు.",
    ta: "வணக்கம்! பிஎஃப் அட்வான்ஸ் மையத்திற்கு வரவேற்கிறோம். அவசர மருத்துவ சிகிச்சை அல்லது கல்விக்காக நிறுவனம் ஒப்புதல் இன்றி உடனடியாக உங்கள் பணத்தை பெறலாம்."
  },
  career: {
    en: "Welcome to the Career Transfer Hub. When you switch companies, you can consolidate all past Member IDs into your current active PF account in one click. If your previous employer forgot to mark your Date of Exit, our AI deduces it automatically.",
    hi: "नमस्ते! करियर ट्रांसफर हब में आपका स्वागत है। जब आप कंपनी बदलते हैं, तो आप अपनी पिछली सभी कंपनियों के पीएफ को 1-क्लिक में जोड़ सकते हैं। यदि पुरानी कंपनी ने एग्जिट डेट नहीं डाली है, तो हमारा एआई उसे स्वतः निकाल लेगा।",
    te: "నమస్కారం! జాబ్ ట్రాన్స్‌ఫర్ హబ్‌కు స్వాగతం. మీరు కంపెనీ మారినప్పుడు, మీ పాత పీఎఫ్ ఖాతాలను 1-క్లిక్‌తో కొత్త ఖాతాకు బదిలీ చేసుకోవచ్చు.",
    ta: "வணக்கம்! பணி மாற்ற மையத்திற்கு வரவேற்கிறோம். உங்கள் முந்தைய நிறுவன பிஎஃப் இருப்பை ஒரே கிளிக்கில் புதிய நிறுவனத்திற்கு எளிதாக மாற்றலாம்."
  },
  savings: {
    en: "Welcome to your Sovereign Passbook. Track your real-time balance with complete triple-split transparency: 12% Employee share, 3.67% Employer EPF, and 8.33% EPS Pension compounding at the government 8.25% sovereign interest rate.",
    hi: "नमस्ते! आपकी पासबुक में आपका स्वागत है। यहाँ आप अपने पीएफ बैलेंस का 12% कर्मचारी अंश, 3.67% नियोक्ता अंश, और 8.33% पेंशन अंश 8.25% सरकारी ब्याज दर के साथ देख सकते हैं।",
    te: "నమస్కారం! మీ డిజిటల్ పాస్‌బుక్‌కు స్వాగతం. 8.25% ప్రభుత్వ వడ్డీ రేటుతో మీ రిటైర్మెంట్ బ్యాలెన్స్ ఎలా పెరుగుతుందో ఇక్కడ స్పష్టంగా చూడవచ్చు.",
    ta: "வணக்கம்! உங்கள் டிஜிட்டல் பாஸ்புக்கிற்கு வரவேற்கிறோம். 8.25% அரசு வட்டி விகிதத்துடன் உங்கள் பிஎஃப் இருப்பை துல்லியமாக கண்காணிக்கலாம்."
  },
  fix: {
    en: "Welcome to the Self-Correction Hub. Fix name spelling discrepancies with sub-5ms Levenshtein matching, verify your bank account instantly with NPCI Penny Drop, and file 3-way digital Joint Declarations with zero paperwork.",
    hi: "नमस्ते! विवरण सुधार केंद्र में आपका स्वागत है। आधार नाम में वर्तनी की गलतियों को तुरंत सुधारें, बैंक खाते को ₹1 पेनी ड्रॉप से सत्यापित करें, और डिजिटल संयुक्त घोषणा पत्र जमा करें।",
    te: "నమస్కారం! వివరాల సవరణ హబ్‌కు స్వాగతం. పేరు స్పెల్లింగ్ తప్పులను వెంటనే సరిదిద్దండి మరియు ఎన్‌పీసీఐ పెన్నీ డ్రాప్‌తో బ్యాంక్ ఖాతాను క్షణాల్లో ధృవీకరించుకోండి.",
    ta: "வணக்கம்! விவர திருத்த மையத்திற்கு வரவேற்கிறோம். உங்கள் பெயர் மற்றும் வங்கி விவரங்களை உடனடியாக சரிபார்த்து திருத்தலாம்."
  }
};

export function PageAudioNarrator({ hub }: PageAudioNarratorProps) {
  const { language } = useCitizen();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const texts = NARRATIONS[hub];
  const langKey = language?.startsWith("hi")
    ? "hi"
    : language?.startsWith("te")
    ? "te"
    : language?.startsWith("ta")
    ? "ta"
    : "en";

  const narrationText = texts[langKey] || texts.en;
  const langCode = language || "en-IN";

  const handleToggle = async () => {
    if (isPlaying) {
      stopNeuralSpeech();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await playNeuralSpeech(
        narrationText,
        langCode,
        undefined,
        () => {
          setIsLoading(false);
          setIsPlaying(true);
        },
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        }
      );
    } catch {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
        isPlaying
          ? "bg-amber-500 text-slate-950 ring-2 ring-amber-300 animate-pulse"
          : "bg-sovereign-navy/10 dark:bg-amber-500/10 text-sovereign-navy dark:text-amber-300 border border-sovereign-navy/20 dark:border-amber-500/30 hover:bg-sovereign-navy/20"
      }`}
      title={isPlaying ? "Stop audio narration" : "Listen to audio narration"}
      aria-label="Listen to page audio narration"
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-saffron" />
      )}
      <span>{isPlaying ? "Stop Audio" : langKey === "hi" ? "सुनिए 🔊" : langKey === "te" ? "వినండి 🔊" : langKey === "ta" ? "கேளுங்கள் 🔊" : "Listen 🔊"}</span>
    </button>
  );
}
