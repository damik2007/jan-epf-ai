"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCitizen } from "@/context/CitizenContext";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
  Wallet,
  Building2,
  Lock,
  ExternalLink,
  Bot,
  HeartHandshake,
  Clock,
  Coins
} from "lucide-react";

interface CitizenAccountOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot?: () => void;
}

export function CitizenAccountOnboardingModal({
  isOpen,
  onClose,
  onOpenCopilot
}: CitizenAccountOnboardingModalProps) {
  const { activeCitizen, language } = useCitizen();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset to step 0 whenever modal opens or citizen changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen, activeCitizen.uan]);

  const fullName = activeCitizen.full_name;
  const firstName = fullName.split(" ")[0];
  const uan = activeCitizen.uan;
  const totalBalance = activeCitizen.passbook_summary?.total_balance?.toLocaleString("en-IN") || "3,42,500";
  const empShare = (activeCitizen.passbook_summary?.employee_share || 181525).toLocaleString("en-IN");
  const emprShare = (activeCitizen.passbook_summary?.employer_share || 116450).toLocaleString("en-IN");
  const epsShare = (activeCitizen.passbook_summary?.pension_fund_share || 44525).toLocaleString("en-IN");
  const activeEmployer = activeCitizen.active_employment?.establishment_name || "Precision Auto Components Pvt Ltd";

  const isRamesh = uan.includes("100982348712") || fullName.includes("Ramesh");
  const isPriya = uan.includes("101294817203") || fullName.includes("Priya");
  const isGurmeet = uan.includes("100112233445") || fullName.includes("Gurmeet");
  const isSunita = uan.includes("101889977665") || fullName.includes("Sunita");

  const langCode = (language || "en-IN").split("-")[0];

  const localizedText = useMemo(() => {
    switch (langCode) {
      case "hi":
        return {
          stepCount: "चरण",
          of: "का",
          back: "वापस",
          skip: "डैशबोर्ड पर जाएं",
          continueBtn: "आगे बढ़ें ➔",
          doneBtn: "समझ गया! डैशबोर्ड पर जाएं ➔",
          openAgent: "⚡ सॉवरेन एआई एजेंट खोलें",
          step1Badge: "चरण 1 / 4 • खाता आधारशिला",
          step1Title: `👤 नमस्ते ${firstName}! आपकी ईपीएफ पहचान और 3-तरफा शेष`,
          step1Sub: `सार्वभौमिक खाता संख्या (UAN): ${uan}`,
          step1P1: `सक्रिय प्रतिष्ठान: ${activeEmployer} (100% सत्यापित केवाईसी)`,
          step1P2: `3-तरफा पासबुक: ₹${empShare} (कर्मचारी 12%) + ₹${emprShare} (नियोक्ता 3.67%) + ₹${epsShare} (EPS-95 पेंशन)`,
          step1P3: `8.25% वार्षिक चक्रवृद्धि ब्याज: ब्याज मासिक रूप से गणना होकर सीधे जमा होता है।`,
          step1P4: `शून्य नियोक्ता बाधा: पूरे भारत में नौकरी बदलने पर आपका UAN हमेशा सक्रिय रहता है।`,
          step1BoxLabel: "कुल सॉवरेन निधि",
          step1BoxSub: "3 विभाजित फंड सक्रिय • 8.25% चक्रवृद्धि ब्याज",

          step2Badge: "चरण 2 / 4 • वैधानिक वित्तीय अधिकार",
          step2Title: "🏥 आपातकालीन अग्रिम (पैरा 68J/B/K) व 0% TDS टैक्स शील्ड",
          step2Sub: isRamesh
            ? "14.5 वर्ष सेवा • ₹1,56,000 की 100% कर-मुक्त आपातकालीन सीमा"
            : "धारा 192A फॉर्म 15G के साथ वैधानिक अग्रिम सीमाएं",
          step2P1: isRamesh
            ? `पूर्व-स्वीकृत आपातकालीन सीमा: पैरा 68J में बिना डॉक्टर हस्ताक्षर 0.04ms में ₹1,56,000 उपलब्ध।`
            : `1-क्लिक अग्रिम स्वीकृति: पैरा 68J (चिकित्सा), 68B (आवास), और 68K (विवाह/शिक्षा)।`,
          step2P2: `धारा 192A 0% TDS शील्ड: 5 वर्ष से अधिक सेवा होने पर निकासी पर ₹0 कर कटता है।`,
          step2P3: `स्वचालित फॉर्म 15G: 5 वर्ष से कम सेवा पर 20% टीडीएस रोकने हेतु फॉर्म 15G स्वतः संलग्न होता है।`,
          step2P4: `सीधा DBT बैंक भुगतान: स्वीकृत राशि <24 घंटों में आपके बैंक खाते में जमा होती है।`,
          step2BoxLabel: "वैधानिक कर छूट",
          step2BoxVal: "0% TDS (धारा 192A)",
          step2BoxSub: "फॉर्म 15G स्वतः संलग्न • 0.04ms गणितीय स्वीकृति",

          step3Badge: "चरण 3 / 4 • बैंक केवाईसी व सुरक्षा",
          step3Title: "🏦 बैंक पेनी ड्रॉप व ₹7,00,000 निःशुल्क जीवन बीमा (EDLI)",
          step3Sub: "सब-200ms सीधा NPCI सत्यापन + नाम सुधारक",
          step3P1: `त्वरित NPCI पेनी ड्रॉप: <200ms में खाता सक्रियता जांचने हेतु ₹1 बैंक में जमा होता है।`,
          step3P2: `वैगनर-फिशर नाम सुधारक: आधार व बैंक पासबुक के मामूली अंतर को स्वतः ठीक करता है।`,
          step3P3: `दावा तैयारी स्कोर: आपकी स्वीकृति तैयारी को 78% से बढ़ाकर 98% करता है।`,
          step3P4: `₹7,00,000 निःशुल्क EDLI बीमा: प्रत्येक सक्रिय सदस्य के नॉमिनी को मुफ्त जीवन सुरक्षा मिलती है।`,
          step3BoxLabel: "मुफ्त वैधानिक जीवन सुरक्षा",
          step3BoxVal: "₹7,00,000 मुफ़्त EDLI कवर",
          step3BoxSub: "सक्रिय नॉमिनी सुरक्षित • 0% प्रीमियम लागत",

          step4Badge: "चरण 4 / 4 • 24/7 स्वायत्त एआई एजेंट",
          step4Title: "⚡ स्वायत्त समाधान व 13 भारतीय भाषाओं में एआई सहायता",
          step4Sub: "कागजी कार्रवाई खत्म • त्वरित आवाज सहायता",
          step4P1: `फॉर्म 13 ऑटो-ट्रांसफर: पिछली कंपनी की निकास तिथि (Exit Date) को ECR वेतन से स्वतः निकालता है।`,
          step4P2: `13 भारतीय भाषाएं व आवाज: हिंदी, तमिल, तेलुगु, कन्नड़, बांग्ला आदि में 24/7 बात करें।`,
          step4P3: `गोपनीयता और DPDP 2023: आपका डेटा डिवाइस पर सुरक्षित रहता है, शून्य क्लाउड लीकेज।`,
          step4P4: `सॉवरेन रीएक्ट लूप: तुरंत गणना, दावा जांच व 1-क्लिक समाधान।`,
          step4BoxLabel: "सॉवरेन एआई क्षमता",
          step4BoxVal: "99.4% स्वायत्त समाधान",
          step4BoxSub: "0ms इन-ब्राउज़र गणित • 13 प्रांतीय भाषाएं"
        };
      case "te":
        return {
          stepCount: "దశ",
          of: "లో",
          back: "వెనుకకు",
          skip: "డాష్‌బోర్డ్‌కి వెళ్లండి",
          continueBtn: "కొనసాగించండి ➔",
          doneBtn: "అర్థమైంది! డాష్‌బోర్డ్‌కి వెళ్లండి ➔",
          openAgent: "⚡ సావరిన్ AI ఏజెంట్‌ను తెరవండి",
          step1Badge: "దశ 1 / 4 • ఖాతా పునాది",
          step1Title: `👤 స్వాగతం ${firstName}! మీ ఈపీఎఫ్ గుర్తింపు & 3-విధాల బ్యాలెన్స్`,
          step1Sub: `యూనివర్సల్ అకౌంట్ నంబర్ (UAN): ${uan}`,
          step1P1: `క్రియాశీల సంస్థ: ${activeEmployer} (100% ధృవీకరించబడిన KYC)`,
          step1P2: `3-విధాల పాస్‌బుక్: ₹${empShare} (ఉద్యోగి 12%) + ₹${emprShare} (యజమాని 3.67%) + ₹${epsShare} (EPS-95 పెన్షన్)`,
          step1P3: `8.25% వార్షిక చక్రవడ్డీ: వడ్డీ నెలవారీగా లెక్కించబడి నేరుగా మీ లెడ్జర్‌కు జమ చేయబడుతుంది.`,
          step1P4: `సున్నా యజమాని అడ్డంకులు: ఉద్యోగం మారినప్పుడు మీ UAN భారతదేశమంతటా చురుకుగా ఉంటుంది.`,
          step1BoxLabel: "మొత్తం సావరిన్ నిధి",
          step1BoxSub: "3 నిధులు సక్రియం • 8.25% చక్రవడ్డీ",

          step2Badge: "దశ 2 / 4 • చట్టపరమైన ఆర్థిక హక్కులు",
          step2Title: "🏥 అత్యవసర అడ్వాన్స్‌లు (పారా 68J/B/K) & 0% TDS పన్ను రక్షణ",
          step2Sub: isRamesh
            ? "14.5 సం. సర్వీస్ • ₹1,56,000 పన్ను రహిత అత్యవసర పరిమితి"
            : "సెక్షన్ 192A ఫారం 15Gతో చట్టబద్ధమైన అడ్వాన్స్ పరిమితులు",
          step2P1: isRamesh
            ? `ముందస్తు మంజూరు పరిమితి: పారా 68J క్రింద డాక్టర్ సంతకం లేకుండా 0.04ms లో ₹1,56,000 లభ్యం.`
            : `1-క్లిక్ అడ్వాన్స్ మంజూరు: పారా 68J (వైద్యం), 68B (ఇల్లు), మరియు 68K (వివాహం/విద్య).`,
          step2P2: `సెక్షన్ 192A 0% TDS రక్షణ: 5 సంవత్సరాల కంటే ఎక్కువ సర్వీస్ ఉంటే సున్నా పన్ను మినహాయింపు.`,
          step2P3: `స్వయంచాలక ఫారం 15G: 20% TDS నివారించడానికి ఫారం 15G ఆటోమేటిక్‌గా జతచేయబడుతుంది.`,
          step2P4: `నేరుగా DBT బ్యాంక్ జమ: మంజూరైన మొత్తం <24 గంటల్లో మీ బ్యాంకు ఖాతాకు చేరుతుంది.`,
          step2BoxLabel: "చట్టబద్ధమైన పన్ను మినహాయింపు",
          step2BoxVal: "0% TDS (సెక్షన్ 192A)",
          step2BoxSub: "ఫారం 15G ఆటోమేటిక్ • 0.04ms గణిత మంజూరు",

          step3Badge: "దశ 3 / 4 • బ్యాంక్ KYC & భద్రత",
          step3Title: "🏦 బ్యాంక్ పెన్నీ డ్రాప్ & ₹7,00,000 ఉచిత జీవిత బీమా (EDLI)",
          step3Sub: "సబ్-200ms నేరుగా NPCI ధృవీకరణ + పేరు సవరణ",
          step3P1: `తక్షణ NPCI పెన్నీ డ్రాప్: ఖాతా స్థితిని ధృవీకరించడానికి ₹1 తక్షణమే జమ అవుతుంది.`,
          step3P2: `వాగ్నర్-ఫిషర్ పేరు సరిపోలిక: ఆధార్ మరియు బ్యాంక్ పాస్‌బుక్ మధ్య అక్షర దోషాలను సరిచేస్తుంది.`,
          step3P3: `క్లెయిమ్ సంసిద్ధత స్కోర్: మీ ఖాతా ఆమోద సంసిద్ధతను 78% నుండి 98% కి పెంచుతుంది.`,
          step3P4: `₹7,00,000 ఉచిత EDLI బీమా: ప్రతి సభ్యునికి రిజిస్టర్డ్ నామినీకి ఉచిత జీవిత బీమా రక్షణ.`,
          step3BoxLabel: "ఉచిత జీవిత బీమా రక్షణ",
          step3BoxVal: "₹7,00,000 ఉచిత EDLI కవర్",
          step3BoxSub: "నామినీ సురక్షితం • ₹0 ప్రీమియం ఖర్చు",

          step4Badge: "దశ 4 / 4 • 24/7 AI అసిస్టెంట్",
          step4Title: "⚡ స్వయంప్రతిపత్తి పరిష్కారాలు & 13 భారతీయ భాషలలో AI",
          step4Sub: "జీరో పేపర్‌వర్క్ • తక్షణ వాయిస్ మద్దతు",
          step4P1: `ఫారం 13 ఆటో-బదిలీ: ECR వేతనాల నుండి మునుపటి నిష్క్రమణ తేదీని స్వయంచాలకంగా లెక్కిస్తుంది.`,
          step4P2: `13 భారతీయ భాషలు: తెలుగు, హిందీ, తమిళం, కన్నడ మొదలైన భాషలలో మాట్లాడండి.`,
          step4P3: `గోప్యత & DPDP 2023: మీ సమాచారం బ్రౌజర్‌లోనే భద్రంగా ఉంటుంది.`,
          step4P4: `సావరిన్ రీయాక్ట్ లూప్: తక్షణ గణన & 1-క్లిక్ క్లెయిమ్ పరిష్కారం.`,
          step4BoxLabel: "సావరిన్ AI సామర్థ్యం",
          step4BoxVal: "99.4% స్వయంప్రతిపత్తి పరిష్కారం",
          step4BoxSub: "0ms బ్రౌజర్ లెక్కలు • 13 భారతీయ భాషలు"
        };
      case "ta":
        return {
          stepCount: "படி",
          of: "இல்",
          back: "பின்செல்",
          skip: "முகப்புக்கு செல்",
          continueBtn: "தொடரவும் ➔",
          doneBtn: "புரிந்தது! முகப்புக்கு செல் ➔",
          openAgent: "⚡ இறையாண்மை AI ஏஜென்டை திறக்கவும்",
          step1Badge: "படி 1 / 4 • கணக்கு அடித்தளம்",
          step1Title: `👤 வணக்கம் ${firstName}! உங்கள் இபிஎஃப் அடையாளம் & 3-பிரிவு இருப்பு`,
          step1Sub: `யுனிவர்சல் கணக்கு எண் (UAN): ${uan}`,
          step1P1: `செயலில் உள்ள நிறுவனம்: ${activeEmployer} (100% சரிபார்க்கப்பட்ட KYC)`,
          step1P2: `3-பிரிவு பாஸ்புக்: ₹${empShare} (பணியாளர் 12%) + ₹${emprShare} (நிறுவனம் 3.67%) + ₹${epsShare} (EPS-95 ஓய்வூதியம்)`,
          step1P3: `8.25% ஆண்டு கூட்டு வட்டி: வட்டி மாதாந்திர கணக்கீட்டில் நேரடியாக வரவு வைக்கப்படுகிறது.`,
          step1P4: `பூஜ்ஜிய நிறுவன சிக்கல்: இந்தியா முழுவதும் உங்கள் UAN செயலில் இருக்கும்.`,
          step1BoxLabel: "மொத்த இருப்பு நிதி",
          step1BoxSub: "3 நிதிகள் செயலில் • 8.25% கூட்டு வட்டி",

          step2Badge: "படி 2 / 4 • நிதி உரிமைகள்",
          step2Title: "🏥 அவசர முன்பணம் (பாரா 68J/B/K) & 0% TDS வரி விலக்கு",
          step2Sub: isRamesh
            ? "14.5 ஆண்டுகள் பணி • ₹1,56,000 வரிவிலக்கு அவசர வரம்பு"
            : "பிரிவு 192A படிவம் 15G உடன் சட்டப்பூர்வ முன்பண வரம்புகள்",
          step2P1: isRamesh
            ? `முன்-அங்கீகரிக்கப்பட்ட வரம்பு: பாரா 68J இல் மருத்துவர் கையொப்பம் இன்றி 0.04ms இல் ₹1,56,000.`
            : `1-கிளிக் முன்பணம்: பாரா 68J (மருத்துவம்), 68B (வீடு), மற்றும் 68K (திருமணம்/கல்வி).`,
          step2P2: `பிரிவு 192A 0% TDS: 5 ஆண்டுகளுக்கு மேல் பணிபுரிந்தவர்களுக்கு பூஜ்ஜிய வரி.`,
          step2P3: `தானியங்கி படிவம் 15G: 20% TDS பிடித்தத்தை தடுக்க படிவம் 15G தானாக இணைகிறது.`,
          step2P4: `நேரடி DBT வங்கி வரவு: <24 மணிநேரத்தில் வங்கி கணக்கில் பணம் சேரும்.`,
          step2BoxLabel: "சட்டப்பூர்வ வரி விலக்கு",
          step2BoxVal: "0% TDS (பிரிவு 192A)",
          step2BoxSub: "படிவம் 15G தானாக இணைக்கப்பட்டது • 0.04ms ஒப்புதல்",

          step3Badge: "படி 3 / 4 • வங்கி KYC & பாதுகாப்பு",
          step3Title: "🏦 வங்கி பென்னி டிராப் & ₹7,00,000 இலவச ஆயுள் காப்பீடு (EDLI)",
          step3Sub: "சப்-200ms நேரடி NPCI சரிபார்ப்பு + பெயர் திருத்தம்",
          step3P1: `உடனடி NPCI பென்னி டிராப்: வங்கி கணக்கு நிலையை சரிபார்க்க ₹1 வரவு வைக்கப்படுகிறது.`,
          step3P2: `வாக்னர்-பிஷர் பெயர் சரிபார்ப்பு: ஆதார் மற்றும் பாஸ்புக் பெயர் எழுத்துப்பிழைகளை சரிசெய்கிறது.`,
          step3P3: `கோரிக்கை தயார்நிலை ஸ்கோர்: உங்கள் கணக்கு ஒப்புதல் தயார்நிலையை 78% இலிருந்து 98% ஆக உயர்த்துகிறது.`,
          step3P4: `₹7,00,000 இலவச EDLI காப்பீடு: செயலில் உள்ள உறுப்பினரின் நியமனதாரருக்கு இலவச பாதுகாப்பு.`,
          step3BoxLabel: "இலவச ஆயுள் காப்பீடு",
          step3BoxVal: "₹7,00,000 இலவச EDLI கவர்",
          step3BoxSub: "நாமினி பாதுகாப்பானது • ₹0 பிரீமியம்",

          step4Badge: "படி 4 / 4 • 24/7 AI உதவியாளர்",
          step4Title: "⚡ தன்னாட்சி தீர்வுகள் & 13 இந்திய மொழிகளில் AI ஆதரவு",
          step4Sub: "காகிதமில்லா சேவை • உடனடி குரல் ஆதரவு",
          step4P1: `படிவம் 13 ஆட்டோ-பரிமாற்றம்: முந்தைய நிறுவன வெளியேறும் தேதியை ECR மூலம் தானாகக் கணக்கிடுகிறது.`,
          step4P2: `13 இந்திய மொழிகள்: தமிழ், இந்தி, தெலுங்கு, கன்னடம் உள்ளிட்ட மொழிகளில் பேசலாம்.`,
          step4P3: `தனியுரிமை & DPDP 2023: உங்கள் தரவு உலாவியிலேயே பாதுகாப்பாக உள்ளது.`,
          step4P4: `இறையாண்மை ReAct லூப்: உடனடி கணக்கீடு & 1-கிளிக் தீர்வு.`,
          step4BoxLabel: "இறையாண்மை AI திறன்",
          step4BoxVal: "99.4% தன்னாட்சி தீர்வு",
          step4BoxSub: "0ms உலாவிக் கணக்கீடுகள் • 13 இந்திய மொழிகள்"
        };
      default:
        return {
          stepCount: "Step",
          of: "of",
          back: "Back",
          skip: "Skip to Dashboard",
          continueBtn: "Continue ➔",
          doneBtn: "Got it! Go to Dashboard ➔",
          openAgent: "⚡ Open AI Agent",
          step1Badge: "Step 1 of 4 • Account Foundation",
          step1Title: `👤 Welcome ${firstName}! Your EPF Identity & Balance Split`,
          step1Sub: `Universal Account Number (UAN): ${uan}`,
          step1P1: `Active Establishment: ${activeEmployer} with 100% verified KYC.`,
          step1P2: `Triple-Split Passbook: ₹${empShare} (Employee 12%) + ₹${emprShare} (Employer 3.67%) + ₹${epsShare} (EPS-95 Pension).`,
          step1P3: `8.25% FY Annual Compounding: Interest calculates monthly and credits directly into your sovereign ledger.`,
          step1P4: `Zero Employer Friction: Your UAN remains portable throughout your entire working career across India.`,
          step1BoxLabel: "Total Sovereign Corpus",
          step1BoxSub: "3 Split Funds Active • 8.25% Interest Compounding",

          step2Badge: "Step 2 of 4 • Financial Rights",
          step2Title: "🏥 Emergency Advances (Para 68J/B/K) & 0% TDS Tax Shield",
          step2Sub: isRamesh
            ? "14.5 Years Service • 100% Tax-Exempt Emergency Limit of ₹1,56,000"
            : "Statutory Advance Caps with Automated Section 192A Form 15G",
          step2P1: isRamesh
            ? `Pre-Sanctioned Emergency Limit: ₹1,56,000 available in 0.04ms under Para 68J without doctor signature.`
            : `1-Click Advance Sanctions: Para 68J (Medical), 68B (Housing), and 68K (Marriage/Education).`,
          step2P2: `Section 192A 0% TDS Shield: If you have >5 years of service, zero tax is deducted on withdrawals.`,
          step2P3: `Automated Form 15G Attachment: If service is <5 years, Form 15G is automatically drafted to prevent 20% TDS deduction.`,
          step2P4: `Direct DBT Bank Settlement: Sanctioned claims disburse directly to your NPCI verified bank in <24 hours.`,
          step2BoxLabel: "Statutory Tax Exemption",
          step2BoxVal: "0% TDS (Section 192A)",
          step2BoxSub: "Form 15G Auto-Attached • 0.04ms Mathematical Sanction",

          step3Badge: "Step 3 of 4 • Bank KYC & Security",
          step3Title: "🏦 Bank Penny Drop & ₹7,00,000 Free Life Cover (EDLI)",
          step3Sub: "Sub-200ms Direct NPCI Integration + Phonetic Name Reconciler",
          step3P1: `Instant NPCI Penny Drop: ₹1 is credited to your bank account to verify active account status in <200ms.`,
          step3P2: `Wagner-Fischer Name Matcher: Automatically bridges minor spelling differences between Aadhaar and Bank passbook.`,
          step3P3: `Claim Readiness Score: Automatically boosts your account approval readiness from 78% up to 98%.`,
          step3P4: `₹7,00,000 Free EDLI Life Insurance: Every active EPF member gets free statutory life cover for their registered nominee.`,
          step3BoxLabel: "Statutory Free Life Cover",
          step3BoxVal: "₹7,00,000 Free EDLI Cover",
          step3BoxSub: "Registered Nominee Protected • ₹0 Premium Cost",

          step4Badge: "Step 4 of 4 • 24/7 Autonomous AI Agent",
          step4Title: "⚡ Autonomous Solutions & 24/7 AI Copilot in 13 Languages",
          step4Sub: "Zero Bureaucratic Delay • Natural Voice Assistance",
          step4P1: `Form 13 Auto-Transfer: Derives missing Date of Exit (DOE) from last monthly ECR wage deposit without HR paperwork.`,
          step4P2: `13 Native Indic Languages: Talk or type naturally in Hindi, Tamil, Telugu, Kannada, Bengali, and English.`,
          step4P3: `Zero PII Cloud Leakage: Presidio PII vault masks all identity numbers on-device before any AI processing.`,
          step4P4: `Sovereign ReAct Loop: Execute instant calculations, claim audits, and 1-click legal remedies.`,
          step4BoxLabel: "Sovereign AI Capability",
          step4BoxVal: "99.4% Autonomous Resolution",
          step4BoxSub: "0ms In-Browser Calculations • 13 Indic Languages"
        };
    }
  }, [langCode, firstName, uan, activeEmployer, empShare, emprShare, epsShare, totalBalance, isRamesh]);

  const STEPS = useMemo(() => [
    {
      step: 1,
      badge: localizedText.step1Badge,
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      title: localizedText.step1Title,
      subtitle: localizedText.step1Sub,
      icon: Wallet,
      accentColor: "from-blue-500 to-indigo-600",
      points: [
        localizedText.step1P1,
        localizedText.step1P2,
        localizedText.step1P3,
        localizedText.step1P4
      ],
      highlightBox: {
        label: localizedText.step1BoxLabel,
        val: `₹${totalBalance}`,
        sub: localizedText.step1BoxSub
      }
    },
    {
      step: 2,
      badge: localizedText.step2Badge,
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      title: localizedText.step2Title,
      subtitle: localizedText.step2Sub,
      icon: Coins,
      accentColor: "from-emerald-500 to-teal-600",
      points: [
        localizedText.step2P1,
        localizedText.step2P2,
        localizedText.step2P3,
        localizedText.step2P4
      ],
      highlightBox: {
        label: localizedText.step2BoxLabel,
        val: localizedText.step2BoxVal,
        sub: localizedText.step2BoxSub
      }
    },
    {
      step: 3,
      badge: localizedText.step3Badge,
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      title: localizedText.step3Title,
      subtitle: localizedText.step3Sub,
      icon: ShieldCheck,
      accentColor: "from-cyan-500 to-blue-600",
      points: [
        localizedText.step3P1,
        localizedText.step3P2,
        localizedText.step3P3,
        localizedText.step3P4
      ],
      highlightBox: {
        label: localizedText.step3BoxLabel,
        val: localizedText.step3BoxVal,
        sub: localizedText.step3BoxSub
      }
    },
    {
      step: 4,
      badge: localizedText.step4Badge,
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      title: localizedText.step4Title,
      subtitle: localizedText.step4Sub,
      icon: Sparkles,
      accentColor: "from-purple-500 to-pink-600",
      points: [
        localizedText.step4P1,
        localizedText.step4P2,
        localizedText.step4P3,
        localizedText.step4P4
      ],
      highlightBox: {
        label: localizedText.step4BoxLabel,
        val: localizedText.step4BoxVal,
        sub: localizedText.step4BoxSub
      }
    }
  ], [localizedText, totalBalance]);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];
  const Icon = currentStep.icon;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#050B14] border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.9)] text-white space-y-6 relative overflow-hidden ring-1 ring-white/10 max-h-[92vh] flex flex-col justify-between">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800 shrink-0 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentStep.badgeColor}`}>
                {currentStep.badge}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {localizedText.stepCount} {currentStepIndex + 1} {localizedText.of} {STEPS.length}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>{currentStep.title}</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">{currentStep.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle Step Content */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 relative z-10">
          {/* Key Bullet Points */}
          <div className="space-y-2.5">
            {currentStep.points.map((pt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-200 bg-[#09121E] border border-slate-800/80 p-3 rounded-xl hover:border-slate-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>

          {/* Highlight Stat Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0d1b2e] to-[#0a1829] border border-slate-700/80 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentStep.accentColor} text-white flex items-center justify-center font-bold shadow-md shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  {currentStep.highlightBox.label}
                </span>
                <span className="text-base font-black text-saffron tracking-tight">
                  {currentStep.highlightBox.val}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono text-right max-w-[180px] hidden sm:inline">
              {currentStep.highlightBox.sub}
            </span>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2 shrink-0">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentStepIndex === idx ? "w-8 bg-saffron" : "w-2 bg-slate-700 hover:bg-slate-600"
              }`}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 shrink-0 relative z-10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{localizedText.back}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-all"
            >
              {localizedText.skip}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenCopilot && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCopilot();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-saffron" />
                <span>{localizedText.openAgent}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-saffron hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            >
              <span>{isLastStep ? localizedText.doneBtn : localizedText.continueBtn}</span>
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
