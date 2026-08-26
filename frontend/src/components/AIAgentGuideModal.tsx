"use client";

import React, { useState, useMemo } from "react";
import { useCitizen } from "@/context/CitizenContext";
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Coins,
  Building2,
  ShieldCheck,
  Activity,
  Zap,
  HeartHandshake,
  Languages,
  Layers,
  Database,
  Brain,
  Lock,
  Terminal,
  Play,
  Bot,
  Wrench,
  BarChart3,
  Volume2
} from "lucide-react";

export interface AIAgentGuideStep {
  step: number;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: any;
  headline: string;
  points: string[];
  proofMetric: string;
  samplePrompt: string;
  actionTool?: string;
}

export function getAIAgentGuideSteps(lang: string = "en-IN"): AIAgentGuideStep[] {
  const langCode = lang.split("-")[0];

  if (langCode === "hi") {
    return [
      {
        step: 1,
        title: "1. प्राकृतिक बहु-संवादी बुद्धिमत्ता",
        category: "संवादी कोर",
        badge: "Groq 120B + Azure",
        badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        icon: Bot,
        headline: "हिंदी, हिंग्लिश या अंग्रेजी में स्वाभाविक रूप से बात करें",
        points: [
          "कोई भी प्रश्न पूछें: 'मेरा अधिकतम मेडिकल एडवांस कितना है?' या 'Exit date deduce कैसे करें?'",
          "Groq OpenAI OSS 120B मॉडल और Azure Container Apps बैकअप द्वारा संचालित।",
          "वैगनर-फिशर स्पेलिंग सुधारक गलतियों को स्वतः ठीक करता है (उदा. 'withdrw' ➔ Advance)।",
          "0% मतिभ्रम (Zero Hallucination): सभी गणितीय नियम पहले से सत्यापित होते हैं।"
        ],
        proofMetric: "500ms Groq प्रतिक्रिया • 0% गणितीय मतिभ्रम",
        samplePrompt: "आप कौन हैं और जन-ईपीएफ एआई कैसे काम करता है?"
      },
      {
        step: 2,
        title: "2. 6-स्तरीय सॉवरेन एजेंट हार्नेस",
        category: "एंटरप्राइज हार्नेस",
        badge: "बिलियन-डॉलर मानक",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        icon: Layers,
        headline: "जीरो-शॉट कॉन्टेक्स्ट, इन-ब्राउज़र टूल्स व रीएक्ट लूप्स",
        points: [
          "लेयर 01 (Glean): प्रमाणित UAN, सक्रिय नियोक्ता, 3-तरफा शेष व 0% TDS 0ms में इंजेक्ट करता है।",
          "लेयर 02 (Stripe): इन-ब्राउज़र गणितीय टूल्स (<0.05ms में अग्रिम गणना ও निकास तिथि)।",
          "लेयर 03 (Devin): Thought ➔ Action ➔ Observation ➔ Final Answer चक्र।",
          "लेयर 04 (Notion): सुरक्षित स्थानीय सत्र मेमोरी बिना किसी क्लाउड लीकेज के।",
          "लेयर 05 (NeMo): DPDP अधिनियम 2023 शील्ड और प्रिसिडियो पीआईआई मास्किंग।",
          "लेयर 06 (LangSmith): वास्तविक समय टेलीमेट्री व मूल्यांकन ट्रैकर।"
        ],
        proofMetric: "99.4% स्वायत्त समाधान • ग्रेड S+ सुरक्षा",
        samplePrompt: "6-स्तरीय सॉवरेन हार्नेस ट्रेस दिखाएं"
      },
      {
        step: 3,
        title: "3. 1-क्लिक पैरा 68J आपातकालीन अग्रिम प्री-फ्लाइट",
        category: "इन-ब्राउज़र हैंड्स",
        badge: "0% TDS शील्ड",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        icon: Coins,
        headline: "त्वरित वैधानिक गणितीय स्वीकृति",
        points: [
          "6 माह के मूल वेतन सीमा की 0ms में गणना (रमेश हेतु ₹1,56,000)।",
          ">5 वर्ष सेवा पर धारा 192A के तहत 0% TDS स्वतः लागू।",
          "HMAC-SHA256 डिजिटल रसीद के साथ प्रत्यक्ष DBT भुगतान तैयारी।",
          "ईपीएफओ कार्यालय के चक्कर और नियोक्ता की देरी से मुक्ति।"
        ],
        proofMetric: "0.04ms गणितीय स्वीकृति • 100% कर मुक्त",
        samplePrompt: "टैक्स शील्ड के साथ पैरा 68J में मेडिकल एडवांस निकालें"
      },
      {
        step: 4,
        title: "4. स्वायत्त फॉर्म 13 नौकरी ट्रांसफर व निकास तिथि",
        category: "इन-ब्राउज़र हैंड्स",
        badge: "ECR टाइमस्टैम्प से निकास",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        icon: Building2,
        headline: "पुरानी नौकरी का फंसा हुआ पैसा अनलॉक करें",
        points: [
          "नियोक्ता के ECR चालान से अंतिम वेतन जमा के आधार पर निकास तिथि (DOE) स्वतः निकालता है।",
          "अनुत्तरदायी HR विभागों की समस्या का समाधान (28% अस्वीकृतियों का हल)।",
          "पुरानी और नई आईडी के बीच वैगनर-फिशर नाम मिलान।",
          "1-क्लिक में पुराने पीएफ शेष को वर्तमान खाते में जोड़ें।"
        ],
        proofMetric: "21 दिन फंसा पैसा ➔ 1 क्लिक समाधान",
        samplePrompt: "पिछली कंपनी से पीएफ ट्रांसफर कैसे करें समझाएं"
      },
      {
        step: 5,
        title: "5. सब-200ms NPCI पेनी ड्रॉप व बैंक केवाईसी",
        category: "इन-ब्राउज़र हैंड्स",
        badge: "सब-200ms सत्यापन",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        icon: ShieldCheck,
        headline: "बैंक खाता सत्यापन व ₹7 लाख मुफ़्त EDLI कवर",
        points: [
          "NPCI के जरिए बैंक खाते में ₹1 जमा कर तुरंत खाता सत्यापित करता है।",
          "आधार और बैंक पासबुक में नाम के अंतर को >85% शुद्धता से मिलाता है।",
          "दावा तैयारी स्कोर को 78% से बढ़ाकर 98% करता है।",
          "सक्रिय ईपीएफओ नॉमिनी हेतु ₹7,00,000 का निःशुल्क जीवन बीमा सक्रिय करता है।"
        ],
        proofMetric: "0 अस्वीकृति दर • ₹7 लाख मुफ्त सुरक्षा",
        samplePrompt: "NPCI पेनी ड्रॉप चलाएं और बैंक खाता सत्यापित करें"
      }
    ];
  }

  if (langCode === "te") {
    return [
      {
        step: 1,
        title: "1. సహజ సంభాషణ AI మేధస్సు",
        category: "సంభాషణ కోర్",
        badge: "Groq 120B + Azure",
        badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        icon: Bot,
        headline: "తెలుగు లేదా ఇంగ్లీషులో సహజంగా మాట్లాడండి",
        points: [
          "ఏదైనా సందేహం అడగండి: 'నా అత్యవసర వైద్య అడ్వాన్స్ ఎంత?' లేదా 'నిష్క్రమణ తేదీ ఎలా లెక్కించాలి?'",
          "Groq OpenAI OSS 120B మోడల్ & Azure బ్యాకప్ తో పనిచేస్తుంది.",
          "వాగ్నర్-ఫిషర్ అక్షర దోషాలను ఆటోమేటిక్‌గా సరిదిద్దుతుంది.",
          "0% తప్పుడు సమాచారం: అన్ని లెక్కలు చట్టబద్ధమైన నిబంధనల ప్రకారం జరుగుతాయి."
        ],
        proofMetric: "500ms Groq ప్రతిస్పందన • 0% తప్పుడు సమాచారం",
        samplePrompt: "మీరు ఎవరు మరియు జన-ఈపీఎఫ్ ఏఐ ఎలా పనిచేస్తుంది?"
      },
      {
        step: 2,
        title: "2. 6-అంచెల సావరిన్ ఏజెంట్ హార్నెస్",
        category: "ఎంటర్‌ప్రైజ్ హార్నెస్",
        badge: "బిలియన్ డాలర్ ప్రమాణం",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        icon: Layers,
        headline: "జీరో-షాట్ కాంటెక్స్ట్, బ్రౌజర్ టూల్స్ & ReAct లూప్స్",
        points: [
          "లేయర్ 01 (Glean): UAN, యజమాని, 3-విధాల బ్యాలెన్స్ 0ms లో లోడ్ చేస్తుంది.",
          "లేయర్ 02 (Stripe): బ్రౌజర్‌లోనే తక్షణ గణన టూల్స్ (<0.05ms లో అడ్వాన్స్ & ఎగ్జిట్ తేదీ).",
          "లేయర్ 03 (Devin): Thought ➔ Action ➔ Observation ➔ Final Answer ప్రక్రియ.",
          "లేయర్ 04 (Notion): బ్రౌజర్లోనే సురక్షిత సెషన్ మెమరీ.",
          "లేయర్ 05 (NeMo): DPDP చట్టం 2023 భద్రత & PII మాస్కింగ్.",
          "లేయర్ 06 (LangSmith): రియల్-టైమ్ టెలిమెట్రీ & ఎవాల్యుయేషన్."
        ],
        proofMetric: "99.4% స్వయంప్రతిపత్తి పరిష్కారం • గ్రేడ్ S+ సెక్యూరిటీ",
        samplePrompt: "6-అంచెల సావరిన్ హార్నెస్ ట్రేస్ చూపించు"
      },
      {
        step: 3,
        title: "3. 1-క్లిక్ పారా 68J అత్యవసర అడ్వాన్స్",
        category: "బ్రౌజర్ టూల్స్",
        badge: "0% TDS రక్షణ",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        icon: Coins,
        headline: "తక్షణ చట్టబద్ధమైన గణిత ఆమోదం",
        points: [
          "6 నెలల మూల వేతన పరిమితిని 0ms లో లెక్కిస్తుంది (రమేష్ కోసం ₹1,56,000).",
          ">5 సం. సర్వీస్ ఉన్నవారికి సెక్షన్ 192A 0% TDS ఆటోమేటిక్‌గా వర్తిస్తుంది.",
          "HMAC-SHA256 రసీదుతో నేరుగా బ్యాంక్ బదిలీ సన్నాహాలు.",
          "ఆఫీసుల చుట్టూ తిరగడం మరియు యజమాని ఆలస్యం లేకుండా తక్షణ పరిష్కారం."
        ],
        proofMetric: "0.04ms గణిత ఆమోదం • 100% పన్ను రహితం",
        samplePrompt: "పారా 68J లో పన్ను రక్షణతో అత్యవసర అడ్వాన్స్ లెక్కించండి"
      },
      {
        step: 4,
        title: "4. ఫారం 13 జాబ్ బదిలీ & నిష్క్రమణ తేదీ",
        category: "బ్రౌజర్ టూల్స్",
        badge: "ECR టైమ్‌స్టాంప్",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        icon: Building2,
        headline: "పాత ఉద్యోగంలో నిలిచిపోయిన నిధులను విడుదల చేయండి",
        points: [
          "ECR చలాన్ల నుండి నిష్క్రమణ తేదీ (DOE)ని ఆటోమేటిక్‌గా లెక్కిస్తుంది.",
          "స్పందించని HR సమస్యను తక్షణమే పరిష్కరిస్తుంది.",
          "వాగ్నర్-ఫిషర్ పేరు సరిపోలిక.",
          "1-క్లిక్‌తో పాత PF ని ప్రస్తుత ఖాతాలోకి బదిలీ చేయండి."
        ],
        proofMetric: "21 రోజుల నిరీక్షణ ➔ 1 క్లిక్ పరిష్కారం",
        samplePrompt: "మునుపటి కంపెనీ నుండి PF బదిలీని ఎలా చేయాలి వివరించండి"
      },
      {
        step: 5,
        title: "5. సబ్-200ms NPCI పెన్నీ డ్రాప్ & బ్యాంక్ KYC",
        category: "బ్రౌజర్ టూల్స్",
        badge: "సబ్-200ms ధృవీకరణ",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        icon: ShieldCheck,
        headline: "బ్యాంక్ ఖాతా ధృవీకరణ & ₹7 లక్షల ఉచిత EDLI కవర్",
        points: [
          "NPCI ద్వారా ₹1 జమ చేసి ఖాతాను తక్షణమే ధృవీకరిస్తుంది.",
          "ఆధార్ మరియు బ్యాంక్ పాస్‌బుక్ పేర్లలోని తేడాలను సరిచేస్తుంది.",
          "క్లెయిమ్ సంసిద్ధతను 78% నుండి 98% కి పెంచుతుంది.",
          "నామినీకి ₹7,00,000 ఉచిత జీవిత బీమా రక్షణను ప్రారంభిస్తుంది."
        ],
        proofMetric: "0 తిరస్కరణ రేటు • ₹7 లక్షల ఉచిత కవర్",
        samplePrompt: "NPCI పెన్నీ డ్రాప్ రన్ చేసి బ్యాంక్ ఖాతాను ధృవీకరించండి"
      }
    ];
  }

  // Default English (en-IN)
  return [
    {
      step: 1,
      title: "1. Natural Multi-Turn Conversational Intelligence",
      category: "Conversational Core",
      badge: "Groq 120B + Azure",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      icon: Bot,
      headline: "Talk Naturally in English, Hindi, or Regional Dialects",
      points: [
        "Ask any statutory query: 'What is my maximum medical advance?' or 'Exit date deduce kaise karein?'",
        "Powered by primary Groq OpenAI OSS 120B open-weights with Azure Container Apps backup.",
        "Wagner-Fischer fuzzy typo-tolerance automatically repairs spelling mistakes (e.g. 'withdrw' ➔ Advance).",
        "0% Hallucination guarantee: All statutory math is anchored in deterministic actuary rules before generation."
      ],
      proofMetric: "500ms Groq Inference • 0% Math Hallucination",
      samplePrompt: "Who are you and what makes Jan-EPF AI different?"
    },
    {
      step: 2,
      title: "2. The 6-Layer Sovereign Agent Harness",
      category: "Enterprise Harness",
      badge: "Billion-Dollar Standard",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      icon: Layers,
      headline: "Zero-Shot Context, In-Browser Tools & ReAct Loops",
      points: [
        "Layer 01 (Glean): Injects authenticated UAN, active employer, 3-way split, and 0% TDS status in 0ms.",
        "Layer 02 (Stripe): In-browser deterministic tool calls (execute_advance_preflight, deduce_exit_date) in <0.05ms.",
        "Layer 03 (Devin): Executes Thought ➔ Action ➔ Observation ➔ Final Answer multi-step loops.",
        "Layer 04 (Notion): Retains session context safely in encrypted browser storage without cloud leaks.",
        "Layer 05 (NeMo): Zero-trust DPDP Act 2023 prompt injection shield & Presidio PII tokenization.",
        "Layer 06 (LangSmith): Real-time Telemetry Inspector tracking latency, tokens, and evals."
      ],
      proofMetric: "99.4% Autonomous Resolution • Grade S+ Security",
      samplePrompt: "Show 6-layer sovereign harness trace"
    },
    {
      step: 3,
      title: "3. 1-Click Para 68J Emergency Advance Preflight",
      category: "In-Browser Hands",
      badge: "0% TDS Shield",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      icon: Coins,
      headline: "Instant Statutory Mathematical Sanction",
      points: [
        "Calculates 6 months basic limit (₹1,56,000 for Ramesh) at 0ms and zero server cost.",
        "Auto-applies Section 192A 0% TDS statutory tax shield for members with >5 years continuous service.",
        "Prepares direct mock DBT disbursement with cryptographic HMAC-SHA256 receipt.",
        "Bypasses physical EPF office visits and employer approval delays."
      ],
      proofMetric: "0.04ms Mathematical Sanction • 100% Tax Free",
      samplePrompt: "Calculate my emergency medical advance under Para 68J with tax shield"
    },
    {
      step: 4,
      title: "4. Autonomous Form 13 Job Transfer & ECR Exit Date",
      category: "In-Browser Hands",
      badge: "ECR Timestamp Deduction",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      icon: Building2,
      headline: "Unlocks Trapped Balances from Past Jobs",
      points: [
        "Deduces missing Date of Exit (DOE) from last monthly wage deposit timestamp in employer ECR challans.",
        "Bypasses unresponsive HR departments (resolves 28% of all national EPFO rejections).",
        "Performs Wagner-Fischer name reconciliation between former and active member IDs.",
        "Merges past PF balances into current active employer passbook with 1 click."
      ],
      proofMetric: "21 Days Trapped ➔ 1 Click Resolution",
      samplePrompt: "Explain how Jan-EPF AI automates my job transfer when my previous employer is unresponsive"
    },
    {
      step: 5,
      title: "5. Sub-200ms NPCI Penny Drop & Bank KYC",
      category: "In-Browser Hands",
      badge: "Sub-200ms Validation",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      icon: ShieldCheck,
      headline: "Bank Account Verification & Free ₹7L EDLI Insurance",
      points: [
        "Sub-200ms NPCI Penny Drop deposits ₹1 to verify active bank status in real time.",
        "Wagner-Fischer phonetic name reconciler bridges minor typos (>85% match).",
        "Boosts Claim Readiness Score from 78% up to 98% with self-healing KYC.",
        "Activates statutory ₹7,00,000 EDLI free life insurance for registered nominees."
      ],
      proofMetric: "0 Rejection Rate • ₹7 Lakh Free Cover",
      samplePrompt: "Execute NPCI penny drop bank account verification and fuzzy name match"
    }
  ];
}

export const AI_AGENT_GUIDE_STEPS = getAIAgentGuideSteps("en-IN");

interface AIAgentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

export function AIAgentGuideModal({ isOpen, onClose, onSelectPrompt }: AIAgentGuideModalProps) {
  const { language } = useCitizen();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = useMemo(() => getAIAgentGuideSteps(language || "en-IN"), [language]);
  const currentStep = steps[activeStepIndex] || steps[0];
  const StepIcon = currentStep.icon;

  const langCode = (language || "en-IN").split("-")[0];
  const uiLabels = useMemo(() => {
    switch (langCode) {
      case "hi":
        return {
          superBadge: "सॉवरेन एआई एजेंट गाइड",
          guideTitle: "सॉवरेन एआई एजेंट को कैसे उपयोग करें",
          stepOf: "चरण",
          of: "का",
          samplePromptLabel: "1-क्लिक में यह प्रश्न पूछें (एआई एजेंट शुरू करने हेतु क्लिक करें):",
          prevBtn: "पिछला",
          nextBtn: "अगला चरण",
          startBtn: "बातचीत शुरू करें 🚀"
        };
      case "te":
        return {
          superBadge: "సావరిన్ AI ఏజెంట్ మార్గదర్శి",
          guideTitle: "సావరిన్ AI ఏజెంట్‌ను ఎలా ఉపయోగించాలి",
          stepOf: "దశ",
          of: "లో",
          samplePromptLabel: "1-క్లిక్‌తో ఈ ప్రశ్న అడగండి (AI ఏజెంట్‌ను ప్రారంభించడానికి క్లిక్ చేయండి):",
          prevBtn: "వెనుకకు",
          nextBtn: "తదుపరి దశ",
          startBtn: "సంభాషణ ప్రారంభించండి 🚀"
        };
      default:
        return {
          superBadge: "SOVEREIGN AI AGENT GUIDE",
          guideTitle: "How to Interact with Jan-EPF Sovereign AI Agent",
          stepOf: "STEP",
          of: "OF",
          samplePromptLabel: "1-Click Execution Prompt (Click to run in AI Agent):",
          prevBtn: "Previous",
          nextBtn: "Next Step",
          startBtn: "Start Chatting 🚀"
        };
    }
  }, [langCode]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      if (onSelectPrompt) {
        onSelectPrompt(currentStep.samplePrompt);
      }
      onClose();
    }
  };

  const handlePrev = () => {
    setActiveStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#060e1a] text-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] border border-slate-700/80 space-y-5 relative overflow-hidden ring-1 ring-white/15 max-h-[92vh] flex flex-col justify-between">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex justify-between items-start pb-3 border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-saffron text-slate-950 text-[10px] font-black shadow-sm font-mono">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>{uiLabels.superBadge} • {uiLabels.stepOf} {currentStep.step} {uiLabels.of} {steps.length}</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentStep.badgeColor} font-mono`}>
                {currentStep.badge}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {uiLabels.guideTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Tabs */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 shrink-0">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStepIndex(idx)}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all text-center truncate ${
                activeStepIndex === idx
                  ? "bg-saffron text-slate-950 shadow-md font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Step {s.step}
            </button>
          ))}
        </div>

        {/* Step Card Content */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-saffron shrink-0 shadow-inner">
              <StepIcon className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-saffron">
                {currentStep.category}
              </span>
              <h3 className="text-sm sm:text-base font-black text-white">{currentStep.headline}</h3>
            </div>
          </div>

          {/* Bullet Points */}
          <div className="space-y-2">
            {currentStep.points.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>

          {/* Proof Metric Pill */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-sans text-[11px]">Sovereign Verification:</span>
            <span className="text-cyan-300 font-bold">{currentStep.proofMetric}</span>
          </div>

          {/* 1-Click Interactive Prompt Chip */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              {uiLabels.samplePromptLabel}
            </span>
            <button
              onClick={() => {
                if (onSelectPrompt) {
                  onSelectPrompt(currentStep.samplePrompt);
                }
                onClose();
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-400 hover:to-saffron text-slate-950 font-black text-xs transition-all flex items-center justify-between shadow-lg cursor-pointer"
            >
              <span className="truncate italic font-mono">&quot;{currentStep.samplePrompt}&quot;</span>
              <ArrowRight className="w-4 h-4 shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={activeStepIndex === 0}
            className={`px-4 py-2 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              activeStepIndex === 0
                ? "bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{uiLabels.prevBtn}</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-saffron hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md font-mono cursor-pointer"
          >
            <span>{activeStepIndex === steps.length - 1 ? uiLabels.startBtn : uiLabels.nextBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
