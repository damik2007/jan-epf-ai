/**
 * Jan-EPF AI: Edge-TTS Neural Audio Streaming & Playback Engine
 * Uses Microsoft Edge Neural Voice endpoints for 100% human-like, soft, comforting regional Indian voices.
 * Zero token cost, zero API keys required, sub-200ms streaming latency.
 */

export interface VoiceOption {
  code: string;
  name: string;
  gender: "female" | "male";
  tone: string;
}

export const INDIAN_NEURAL_VOICES: Record<string, VoiceOption[]> = {
  "hi-IN": [
    { code: "hi-IN-SwaraNeural", name: "Swara (स्वरा)", gender: "female", tone: "Soft, comforting, natural" },
    { code: "hi-IN-MadhurNeural", name: "Madhur (मधुर)", gender: "male", tone: "Calm, respectful, clear" }
  ],
  "te-IN": [
    { code: "te-IN-ShrutiNeural", name: "Shruti (శ్రుతి)", gender: "female", tone: "Natural, melodic, soft" },
    { code: "te-IN-MohanNeural", name: "Mohan (మోహన్)", gender: "male", tone: "Clear, authoritative, respectful" }
  ],
  "ta-IN": [
    { code: "ta-IN-PallaviNeural", name: "Pallavi (பல்லவி)", gender: "female", tone: "Soft, empathetic" },
    { code: "ta-IN-ValluvarNeural", name: "Valluvar (வள்ளுவர்)", gender: "male", tone: "Warm, clear" }
  ],
  "kn-IN": [
    { code: "kn-IN-SapnaNeural", name: "Sapna (ಸಪ್ನಾ)", gender: "female", tone: "Gentle, natural" },
    { code: "kn-IN-GaganNeural", name: "Gagan (ಗಗನ್)", gender: "male", tone: "Calm, steady" }
  ],
  "ml-IN": [
    { code: "ml-IN-SobhanaNeural", name: "Sobhana (ശോഭന)", gender: "female", tone: "Comforting, soft" },
    { code: "ml-IN-MidhunNeural", name: "Midhun (മിഥുൻ)", gender: "male", tone: "Clear, reassuring" }
  ],
  "mr-IN": [
    { code: "mr-IN-AarohiNeural", name: "Aarohi (आरोही)", gender: "female", tone: "Polite, melodic" },
    { code: "mr-IN-ManoharNeural", name: "Manohar (मनोहर)", gender: "male", tone: "Warm, respectful" }
  ],
  "bn-IN": [
    { code: "bn-IN-TanishaaNeural", name: "Tanishaa (তানিশা)", gender: "female", tone: "Soft, friendly" },
    { code: "bn-IN-BashkarNeural", name: "Bashkar (ভাস্কর)", gender: "male", tone: "Resonant, clear" }
  ],
  "gu-IN": [
    { code: "gu-IN-DhwaniNeural", name: "Dhwani (ધ્વનિ)", gender: "female", tone: "Bright, comforting" },
    { code: "gu-IN-NiranjanNeural", name: "Niranjan (નિરંજન)", gender: "male", tone: "Gentle, reassuring" }
  ],
  "pa-IN": [
    { code: "pa-IN-GurpreetNeural", name: "Gurpreet (ਗੁਰਪ੍ਰੀਤ)", gender: "female", tone: "Respectful, warm" },
    { code: "pa-IN-HarmohanNeural", name: "Harmohan (ਹਰਮੋਹਨ)", gender: "male", tone: "Calm, dignified" }
  ],
  "or-IN": [
    { code: "or-IN-SubhasiniNeural", name: "Subhasini (ଶୁଭାସିନୀ)", gender: "female", tone: "Natural, gentle" }
  ],
  "as-IN": [
    { code: "as-IN-YashicaNeural", name: "Yashica (যশিকা)", gender: "female", tone: "Clear, comforting" }
  ],
  "ur-IN": [
    { code: "ur-IN-GulNeural", name: "Gul (گل)", gender: "female", tone: "Soft, polite, clear" },
    { code: "ur-IN-SalmanNeural", name: "Salman (سلمان)", gender: "male", tone: "Warm, respectful" }
  ],
  "en-IN": [
    { code: "en-IN-NeerjaNeural", name: "Neerja (Indian Accent)", gender: "female", tone: "Soft, professional, comforting" },
    { code: "en-IN-PrabhatNeural", name: "Prabhat (Indian Accent)", gender: "male", tone: "Clear, friendly, modern" }
  ]
};

let currentAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voices cache immediately
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function stopNeuralSpeech() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Sanitizes plain text for natural spoken playback tailored to Indic regional languages.
 */
export function cleanSpokenText(raw: string, lang: string = "en-IN"): string {
  let cleaned = raw
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[*_#`~[\]()<>|]/g, "")
    .replace(/•/g, ", ")
    .replace(/\n+/g, ". ");

  // Localize currency word to prevent English code-switching stutter in Indic speech
  if (lang.startsWith("te")) {
    cleaned = cleaned.replace(/₹\s*/g, "రూపాయలు ");
  } else if (lang.startsWith("hi") || lang.startsWith("mr")) {
    cleaned = cleaned.replace(/₹\s*/g, "रुपये ");
  } else if (lang.startsWith("ta")) {
    cleaned = cleaned.replace(/₹\s*/g, "ரூபாய் ");
  } else if (lang.startsWith("kn")) {
    cleaned = cleaned.replace(/₹\s*/g, "ರೂಪಾಯಿ ");
  } else if (lang.startsWith("ml")) {
    cleaned = cleaned.replace(/₹\s*/g, "രൂപ ");
  } else if (lang.startsWith("bn") || lang.startsWith("as")) {
    cleaned = cleaned.replace(/₹\s*/g, "টাকা ");
  } else if (lang.startsWith("gu")) {
    cleaned = cleaned.replace(/₹\s*/g, "રૂપિયા ");
  } else if (lang.startsWith("pa")) {
    cleaned = cleaned.replace(/₹\s*/g, "ਰੁਪਏ ");
  } else if (lang.startsWith("ur")) {
    cleaned = cleaned.replace(/₹\s*/g, "روپے ");
  } else {
    cleaned = cleaned.replace(/₹\s*/g, "Rupees ");
  }

  return cleaned.replace(/\s+/g, " ").trim();
}

/**
 * Plays human-like neural audio via Edge-TTS streaming endpoint with fallback to browser SpeechSynthesis.
 */
export async function playNeuralSpeech(
  rawText: string,
  lang: string = "en-IN",
  voiceCode?: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  stopNeuralSpeech();

  const langKey = lang.includes("-") ? lang : `${lang}-IN`;
  const text = cleanSpokenText(rawText, langKey);
  if (!text) {
    if (onEnd) onEnd();
    return;
  }

  const defaultVoice = INDIAN_NEURAL_VOICES[langKey]?.[0]?.code || "en-IN-NeerjaNeural";
  const selectedVoice = voiceCode || defaultVoice;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const isLocalhost = apiBase.includes("localhost") || apiBase.includes("127.0.0.1");

  // On HTTPS production deployments without remote backend, directly use optimized SpeechSynthesis
  if (isHttps && isLocalhost) {
    fallbackBrowserSpeech(text, langKey, onStart, onEnd);
    return;
  }

  const audioUrl = `${apiBase}/api/v1/voice/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(langKey)}&voice=${encodeURIComponent(selectedVoice)}`;

  let hasTriggeredFallback = false;
  const triggerFallbackOnce = () => {
    if (!hasTriggeredFallback) {
      hasTriggeredFallback = true;
      fallbackBrowserSpeech(text, langKey, onStart, onEnd);
    }
  };

  try {
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      triggerFallbackOnce();
    };

    await audio.play();
  } catch {
    triggerFallbackOnce();
  }
}

function fallbackBrowserSpeech(
  text: string,
  lang: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Indic languages sound most natural and comforting at ~0.90 - 0.92 rate
    utterance.rate = lang.startsWith("en") ? 0.96 : 0.92;
    utterance.pitch = 1.0;

    let voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const prefix = lang.slice(0, 2).toLowerCase();
      const match =
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix) && (v.name.toLowerCase().includes("natural") || v.name.toLowerCase().includes("neural") || v.name.toLowerCase().includes("online"))) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix) && v.name.toLowerCase().includes("google")) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix));

      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }
}
