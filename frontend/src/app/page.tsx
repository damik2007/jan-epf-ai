"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCitizen } from "@/context/CitizenContext";
import { getTranslation } from "@/lib/translations";
import {
  Wallet,
  Briefcase,
  PiggyBank,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  Building2,
  Coins,
  HeartHandshake,
  UserCheck,
  Shield,
  LogOut,
  ChevronDown,
  Activity,
  Eye,
  EyeOff,
  Copy
} from "lucide-react";
import { ClaimReadinessScore } from "@/components/ClaimReadinessScore";
import { ChaosSimulatorModal } from "@/components/ChaosSimulatorModal";
import { AIAgentGuideModal } from "@/components/AIAgentGuideModal";
import { CitizenAccountOnboardingModal } from "@/components/CitizenAccountOnboardingModal";
import { BookOpen } from "lucide-react";

export default function CitizenLandingPage() {
  const { activeCitizen, isAuthenticated, login, logout, language, seniorMode, setSeniorMode } = useCitizen();
  const t = getTranslation(language);

  const langCode = (language || "en-IN").split("-")[0];
  const firstName = activeCitizen?.full_name ? activeCitizen.full_name.split(" ")[0] : "Citizen";

  const deckLabels = React.useMemo(() => {
    switch (langCode) {
      case "hi":
        return {
          tag: "⚡ उत्पाद क्षमताएं",
          arch: "80/20 सॉवरेन एआई आर्किटेक्चर",
          heading: `${firstName} के लिए जन-ईपीएफ एआई क्या कर सकता है`,
          guideBtn: "📖 चरण-दर-चरण मार्गदर्शिका",
          agentBtn: "⚡ सॉवरेन एआई एजेंट",
          advTitle: "🏥 पैरा 68J आपातकालीन अग्रिम",
          advDesc: "0.04ms में धारा 192A फॉर्म 15G के साथ अग्रिम सीमाएं स्वीकृत।",
          advLink: "अग्रिम हब जांचें",
          trnTitle: "🔄 फॉर्म 13 नौकरी ट्रांसफर",
          trnDesc: "ECR वेतन चालान से निकास तिथि स्वतः निकालता है।",
          trnLink: "कैरियर हब जांचें",
          savTitle: "📊 3-तरफा पासबुक",
          savDesc: "12% + 3.67% + 8.33% विभाजन व 8.25% चक्रवृद्धि ब्याज ट्रैकर।",
          savLink: "बचत हब जांचें",
          kycTitle: "🏦 NPCI पेनी ड्रॉप व केवाईसी",
          kycDesc: "सब-200ms बैंक सत्यापन + नाम सुधार और ₹7 लाख मुफ्त EDLI।",
          kycLink: "विवरण सुधार जांचें"
        };
      case "te":
        return {
          tag: "⚡ ఉత్పత్తి సామర్థ్యాలు",
          arch: "80/20 సావరిన్ AI ఆర్కిటెక్చర్",
          heading: `${firstName} కోసం జన-ఈపీఎఫ్ ఏఐ ఏమి చేయగలదు`,
          guideBtn: "📖 దశల వారీ మార్గదర్శి",
          agentBtn: "⚡ సావరిన్ AI ఏజెంట్",
          advTitle: "🏥 పారా 68J అత్యవసర అడ్వాన్స్",
          advDesc: "0.04ms లో సెక్షన్ 192A ఫారం 15G తో అడ్వాన్స్ మంజూరు.",
          advLink: "అడ్వాన్స్ హబ్ పరిశీలించండి",
          trnTitle: "🔄 ఫారం 13 జాబ్ బదిలీ",
          trnDesc: "ECR వేతనాల నుండి నిష్క్రమణ తేదీని స్వయంచాలకంగా లెక్కిస్తుంది.",
          trnLink: "కెరీర్ హబ్ పరిశీలించండి",
          savTitle: "📊 3-విధాల పాస్‌బుక్",
          savDesc: "12% + 3.67% + 8.33% విభజన & 8.25% చక్రవడ్డీ ట్రాకర్.",
          savLink: "పొదుపు హబ్ పరిశీలించండి",
          kycTitle: "🏦 NPCI పెన్నీ డ్రాప్ & KYC",
          kycDesc: "సబ్-200ms బ్యాంక్ ధృవీకరణ + పేరు సవరణ & ₹7లక్షల ఉచిత EDLI.",
          kycLink: "వివరాల సవరణ పరిశీలించండి"
        };
      case "ta":
        return {
          tag: "⚡ தயாரிப்பு திறன்கள்",
          arch: "80/20 இறையாண்மை AI கட்டமைப்பு",
          heading: `${firstName}-க்கு ஜன-இபிஎஃப் AI என்ன செய்ய முடியும்`,
          guideBtn: "📖 படிப்படியான வழிகாட்டி",
          agentBtn: "⚡ இறையாண்மை AI ஏஜென்ட்",
          advTitle: "🏥 பாரா 68J அவசர முன்பணம்",
          advDesc: "0.04ms இல் பிரிவு 192A படிவம் 15G உடன் முன்பணம் ஒப்புதல்.",
          advLink: "முன்பணப் பிரிவு",
          trnTitle: "🔄 படிவம் 13 பணி பரிமாற்றம்",
          trnDesc: "ECR ஊதியத்திலிருந்து வெளியேறும் தேதியை தானாகக் கணக்கிடுகிறது.",
          trnLink: "பணிப் பிரிவு",
          savTitle: "📊 3-பிரிவு பாஸ்புக்",
          savDesc: "12% + 3.67% + 8.33% பிரிவு & 8.25% கூட்டு வட்டி கண்காணிப்பு.",
          savLink: "சேமிப்புப் பிரிவு",
          kycTitle: "🏦 NPCI பென்னி டிராப் & KYC",
          kycDesc: "சப்-200ms வங்கி சரிபார்ப்பு + பெயர் திருத்தம் & ₹7L EDLI காப்பீடு.",
          kycLink: "விவர திருத்தப் பிரிவு"
        };
      case "kn":
        return {
          tag: "⚡ ಉತ್ಪನ್ನ ಸಾಮರ್ಥ್ಯಗಳು",
          arch: "80/20 ಸಾರ್ವಭೌಮ AI ಆರ್ಕಿಟೆಕ್ಚರ್",
          heading: `${firstName} ಗಾಗಿ ಜನ-ಇಪಿಎಫ್ AI ಏನು ಮಾಡಬಹುದು`,
          guideBtn: "📖 ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ",
          agentBtn: "⚡ ಸಾರ್ವಭೌಮ AI ಏಜೆಂಟ್",
          advTitle: "🏥 ಪ್ಯಾರಾ 68J ತುರ್ತು ಮುಂಗಡ",
          advDesc: "0.04ms ನಲ್ಲಿ ಸೆಕ್ಷನ್ 192A ಫಾರ್ಮ್ 15G ಯೊಂದಿಗೆ ಮುಂಗಡ ಮಂಜೂರಾತಿ.",
          advLink: "ಮುಂಗಡ ಕೇಂದ್ರ ಪರಿಶೀಲಿಸಿ",
          trnTitle: "🔄 ಫಾರ್ಮ್ 13 ಉದ್ಯೋಗ ವರ್ಗಾವಣೆ",
          trnDesc: "ECR ವೇತನಗಳಿಂದ ನಿರ್ಗಮನ ದಿನಾಂಕವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
          trnLink: "ವೃತ್ತಿಪರ ಕೇಂದ್ರ ಪರಿಶೀಲಿಸಿ",
          savTitle: "📊 3-ವಿಧದ ಪಾಸ್‌ಬುಕ್",
          savDesc: "12% + 3.67% + 8.33% ವಿಭಜನೆ ಮತ್ತು 8.25% ಚಕ್ರಬಡ್ಡಿ ಟ್ರ್ಯಾಕರ್.",
          savLink: "ಉಳಿತಾಯ ಕೇಂದ್ರ ಪರಿಶೀಲಿಸಿ",
          kycTitle: "🏦 NPCI ಪೆನ್ನಿ ಡ್ರಾಪ್ & KYC",
          kycDesc: "ಸಬ್-200ms ಬ್ಯಾಂಕ್ ಪರಿಶೀಲನೆ + ಹೆಸರು ತಿದ್ದುಪಡಿ & ₹7 ಲಕ್ಷ ಉಚಿತ EDLI.",
          kycLink: "ವಿವರ ತಿದ್ದುಪಡಿ ಪರಿಶೀಲಿಸಿ"
        };
      case "ml":
        return {
          tag: "⚡ ഉൽപ്പന്ന സവിശേഷതകൾ",
          arch: "80/20 പരമാധികാര AI ആർക്കിടെക്ചർ",
          heading: `${firstName}-ന് ജൻ-ഇപിഎഫ് AI എന്തെല്ലാം നൽകാം`,
          guideBtn: "📖 ഘട്ടം ഘട്ടമായുള്ള ഗൈഡ്",
          agentBtn: "⚡ പരമാധികാര AI ഏജന്റ്",
          advTitle: "🏥 പാര 68J അടിയന്തര അഡ്വാൻസ്",
          advDesc: "0.04ms-ൽ സെക്ഷൻ 192A ഫോം 15G ഉപയോഗിച്ച് അഡ്വാൻസ് അനുമതി.",
          advLink: "അഡ്വാൻസ് ഹബ് പരിശോധിക്കുക",
          trnTitle: "🔄 ഫോം 13 ജോലി ട്രാൻസ്ഫർ",
          trnDesc: "ECR വേതനത്തിൽ നിന്ന് റിലീവിംഗ് തീയതി സ്വയം കണ്ടെത്തുന്നു.",
          trnLink: "കരിയർ ഹബ് പരിശോധിക്കുക",
          savTitle: "📊 3-ഘടക പാസ്ബുക്ക്",
          savDesc: "12% + 3.67% + 8.33% വിഭജനവും 8.25% കൂട്ടുപലിശ ട്രാക്കറും.",
          savLink: "സേവിംഗ്സ് ഹബ് പരിശോധിക്കുക",
          kycTitle: "🏦 NPCI പെന്നി ഡ്രോപ്പും KYC-യും",
          kycDesc: "സബ്-200ms ബാങ്ക് പരിശോധന + പേര് തിരുത്തലും ₹7 ലക്ഷം EDLI ഇൻഷുറൻസും.",
          kycLink: "വിവര തിരുത്തൽ പരിശോധിക്കുക"
        };
      case "mr":
        return {
          tag: "⚡ उत्पादन क्षमता",
          arch: "80/20 सार्वभौम एआय आर्किटेक्चर",
          heading: `${firstName} साठी जन-ईपीएफ एआय काय करू शकते`,
          guideBtn: "📖 टप्प्याटप्प्याने मार्गदर्शक",
          agentBtn: "⚡ सार्वभौम एआय एजंट",
          advTitle: "🏥 पॅरा 68J आपत्कालीन ॲडव्हान्स",
          advDesc: "0.04ms मध्ये कलम 192A फॉर्म 15G सह ॲडव्हान्स मंजूर.",
          advLink: "ॲडव्हान्स हब तपासा",
          trnTitle: "🔄 फॉर्म 13 नोकरी ट्रान्सफर",
          trnDesc: "ECR वेतन नोंदींवरून बाहेर पडण्याची तारीख स्वयंचलितपणे काढते.",
          trnLink: "करिअर हब तपासा",
          savTitle: "📊 3-स्तरीय पासबुक",
          savDesc: "12% + 3.67% + 8.33% विभाजन व 8.25% चक्रवाढ व्याज ट्रॅकर.",
          savLink: "बचत हब तपासा",
          kycTitle: "🏦 NPCI पेनी ड्रॉप व केवायसी",
          kycDesc: "सब-200ms बँक पडताळणी + नाव सुधारणा व ₹7 लाख मोफत EDLI.",
          kycLink: "तपशील सुधारणा तपासा"
        };
      case "bn":
        return {
          tag: "⚡ পণ্য সক্ষমতা",
          arch: "80/20 সার্বভৌম এআই আর্কিটেকচার",
          heading: `${firstName}-এর জন্য জন-ইপিএফ এআই কী করতে পারে`,
          guideBtn: "📖 ধাপে ধাপে নির্দেশিকা",
          agentBtn: "⚡ সার্বভৌম এআই এজেন্ট",
          advTitle: "🏥 প্যারা 68J জরুরি অগ্রিম",
          advDesc: "0.04ms-এ ধারা 192A ফর্ম 15G সহ অগ্রিম মঞ্জুর।",
          advLink: "অগ্রিম হাব পরীক্ষা করুন",
          trnTitle: "🔄 ফর্ম 13 চাকরি স্থানান্তর",
          trnDesc: "ECR বেতন চালানের মাধ্যমে প্রস্থান তারিখ স্বয়ংক্রিয় গণনা।",
          trnLink: "ক্যারিয়ার হাব পরীক্ষা করুন",
          savTitle: "📊 ৩-অংশের পাসবুক",
          savDesc: "12% + 3.67% + 8.33% বিভাজন ও 8.25% চক্রবৃদ্ধি সুদ ট্র্যাকার।",
          savLink: "সঞ্চয় হাব পরীক্ষা করুন",
          kycTitle: "🏦 NPCI পেনি ড্রপ ও কেওয়াইসি",
          kycDesc: "সাব-200ms ব্যাংক যাচাইকরণ + নাম সংশোধন ও ₹7 লাখ বিনামূল্যে EDLI।",
          kycLink: "বিবরণ সংশোধন পরীক্ষা করুন"
        };
      case "gu":
        return {
          tag: "⚡ પ્રોડક્ટ ક્ષમતાઓ",
          arch: "80/20 સાર્વભૌમ AI આર્કિટેક્ચર",
          heading: `${firstName} માટે જન-ઇપીએફ AI શું કરી શકે છે`,
          guideBtn: "📖 સ્ટેપ-બાય-સ્ટેપ માર્ગદર્શિકા",
          agentBtn: "⚡ સાર્વભૌમ AI એજન્ટ",
          advTitle: "🏥 પેરા 68J ઇમરજન્સી એડવાન્સ",
          advDesc: "0.04ms માં કલમ 192A ફોર્મ 15G સાથે એડવાન્સ મંજૂર.",
          advLink: "એડવાન્સ હબ તપાસો",
          trnTitle: "🔄 ફોર્મ 13 નોકરી ટ્રાન્સફર",
          trnDesc: "ECR પગાર રેકોર્ડ્સ પરથી એક્ઝિટ તારીખ આપમેળે મેળવે છે.",
          trnLink: "કારકિર્દી હબ તપાસો",
          savTitle: "📊 3-વિભાગીય પાસબુક",
          savDesc: "12% + 3.67% + 8.33% વિભાજન અને 8.25% ચક્રવૃદ્ધિ વ્યાજ ટ્રેકર.",
          savLink: "બચત હબ તપાસો",
          kycTitle: "🏦 NPCI પેની ડ્રોપ અને KYC",
          kycDesc: "સબ-200ms બેંક વેરિફિકેશન + નામ સુધારો અને ₹7 લાખ ફ્રી EDLI.",
          kycLink: "વિગતો સુધારો તપાસો"
        };
      case "pa":
        return {
          tag: "⚡ ਉਤਪਾਦ ਸਮਰੱਥਾਵਾਂ",
          arch: "80/20 ਪ੍ਰਭੂਸੱਤਾ AI ਆਰਕੀਟੈਕਚਰ",
          heading: `${firstName} ਲਈ ਜਨ-ਈਪੀਐਫ AI ਕੀ ਕਰ ਸਕਦਾ ਹੈ`,
          guideBtn: "📖 ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ",
          agentBtn: "⚡ ਪ੍ਰਭੂਸੱਤਾ AI ਏਜੰਟ",
          advTitle: "🏥 ਪੈਰਾ 68J ਐਮਰਜੈਂਸੀ ਪੇਸ਼ਗੀ",
          advDesc: "0.04ms ਵਿੱਚ ਧਾਰਾ 192A ਫਾਰਮ 15G ਨਾਲ ਪੇਸ਼ਗੀ ਮਨਜ਼ੂਰ।",
          advLink: "ਪੇਸ਼ਗੀ ਹੱਬ ਚੈੱਕ ਕਰੋ",
          trnTitle: "🔄 ਫਾਰਮ 13 ਨੌਕਰੀ ਟ੍ਰਾਂਸਫਰ",
          trnDesc: "ECR ਤਨਖਾਹ ਰਿਕਾਰਡਾਂ ਤੋਂ ਨਿਕਾਸ ਮਿਤੀ ਆਪਣੇ ਆਪ ਲੱਭਦਾ ਹੈ।",
          trnLink: "ਕਰੀਅਰ ਹੱਬ ਚੈੱਕ ਕਰੋ",
          savTitle: "📊 3-ਹਿੱਸੇ ਵਾਲੀ ਪਾਸਬੁੱਕ",
          savDesc: "12% + 3.67% + 8.33% ਵੰਡ ਅਤੇ 8.25% ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਟ੍ਰੈਕਰ।",
          savLink: "ਬੱਚਤ ਹੱਬ ਚੈੱਕ ਕਰੋ",
          kycTitle: "🏦 NPCI ਪੈਨੀ ਡ੍ਰੌਪ ਅਤੇ KYC",
          kycDesc: "ਸਬ-200ms ਬੈਂਕ ਤਸਦੀਕ + ਨਾਮ ਸੁਧਾਰ ਅਤੇ ₹7 ਲੱਖ ਮੁਫ਼ਤ EDLI ਬੀਮਾ।",
          kycLink: "ਵੇਰਵੇ ਸੁਧਾਰ ਚੈੱਕ ਕਰੋ"
        };
      case "or":
        return {
          tag: "⚡ ଉତ୍ପାଦ କ୍ଷମତା",
          arch: "80/20 ସାର୍ବଭୌମ AI ଆର୍କିଟେକ୍ଚର",
          heading: `${firstName} ପାଇଁ ଜନ-ଇପିଏଫ AI କଣ କରିପାରିବ`,
          guideBtn: "📖 ପଦକ୍ଷେପ-କ୍ରମେ ଗାଇଡ୍",
          agentBtn: "⚡ ସାର୍ବଭୌମ AI ଏଜେଣ୍ଟ",
          advTitle: "🏥 ପାରା 68J ଜରୁରୀକାଳୀନ ଅଗ୍ରିମ",
          advDesc: "0.04ms ରେ ଧାରା 192A ଫର୍ମ 15G ସହିତ ଅଗ୍ରିମ ମଞ୍ଜୁର।",
          advLink: "ଅଗ୍ରିମ ହବ୍ ଯାଞ୍ଚ କରନ୍ତୁ",
          trnTitle: "🔄 ଫର୍ମ 13 ଚାକିରି ସ୍ଥାନାନ୍ତର",
          trnDesc: "ECR ଦରମାରୁ ପ୍ରସ୍ଥାନ ତାରିଖ ସ୍ୱୟଂଚାଳିତ ଭାବେ ଗଣନା କରେ।",
          trnLink: "କ୍ୟାରିଅର ହବ୍ ଯାଞ୍ଚ କରନ୍ତୁ",
          savTitle: "📊 3-ଭାଗ ପାସବୁକ୍",
          savDesc: "12% + 3.67% + 8.33% ବିଭାଜନ ଓ 8.25% ଚକ୍ରବୃଦ୍ଧି ସୁଧ ଟ୍ରାକର୍।",
          savLink: "ସଞ୍ଚୟ ହବ୍ ଯାଞ୍ଚ କରନ୍ତୁ",
          kycTitle: "🏦 NPCI ପେନି ଡ୍ରପ୍ ଓ KYC",
          kycDesc: "ସବ୍-200ms ବ୍ୟାଙ୍କ ଯାଞ୍ଚ + ନାମ ସଂଶୋଧନ ଓ ₹7 ଲକ୍ଷ ମାଗଣା EDLI।",
          kycLink: "ବିବରଣୀ ସଂଶୋଧନ ଯାଞ୍ଚ କରନ୍ତୁ"
        };
      case "as":
        return {
          tag: "⚡ সামগ্ৰীৰ সামৰ্থ্য",
          arch: "80/20 সাৰ্বভৌম AI আৰ্কিটেকচাৰ",
          heading: `${firstName}ৰ বাবে জন-ইপিএফ AI এ কি কৰিব পাৰে`,
          guideBtn: "📖 পৰ্যায়ক্ৰমে নিৰ্দেশিকা",
          agentBtn: "⚡ সাৰ্বভৌম AI এজেন্ট",
          advTitle: "🏥 পেৰা 68J জৰুৰীকালীন অগ্ৰিম",
          advDesc: "0.04msত ধাৰা 192A ফৰ্ম 15G সৈতে অগ্ৰিম অনুমোদন।",
          advLink: "অগ্ৰিম হাব পৰীক্ষা কৰক",
          trnTitle: "🔄 ফৰ্ম 13 চাকৰি স্থানান্তৰ",
          trnDesc: "ECR দৰমহাৰ পৰা প্ৰস্থানৰ তাৰিখ স্বয়ংক্ৰিয়ভাৱে নিৰ্ণয় কৰে।",
          trnLink: "কেৰিয়াৰ হাব পৰীক্ষা কৰক",
          savTitle: "📊 ৩-ভাগৰ পাছবুক",
          savDesc: "12% + 3.67% + 8.33% বিভাজন আৰু 8.25% চক্রবৃদ্ধি সুদ ট্ৰেকাৰ।",
          savLink: "সঞ্চয় হাব পৰীক্ষা কৰক",
          kycTitle: "🏦 NPCI পেনি ড্ৰপ আৰু KYC",
          kycDesc: "ছাব-200ms বেংক পৰীক্ষণ + নাম সংশোধন আৰু ₹7 লাখ বিনামূলীয়া EDLI।",
          kycLink: "বিৱৰণ সংশোধন পৰীক্ষা কৰক"
        };
      case "ur":
        return {
          tag: "⚡ پروڈکٹ کی صلاحیتیں",
          arch: "80/20 خود مختار AI فن تعمیر",
          heading: `${firstName} کے لیے جن ای پی ایف اے آئی کیا کر سکتا ہے`,
          guideBtn: "📖 مرحلہ وار گائیڈ",
          agentBtn: "⚡ خودمختار AI ایجنٹ",
          advTitle: "🏥 پیرا 68J ہنگامی پیشگی",
          advDesc: "0.04ms میں سیکشن 192A فارم 15G کے ساتھ پیشگی منظوری۔",
          advLink: "پیشگی مرکز دیکھیں",
          trnTitle: "🔄 فارم 13 ملازمت کی منتقلی",
          trnDesc: "ECR تنخواہ سے اخراج کی تاریخ خودکار طریقے سے معلوم ہوتی ہے۔",
          trnLink: "کیریئر مرکز دیکھیں",
          savTitle: "📊 3 جہتی پاس بک",
          savDesc: "12% + 3.67% + 8.33% تقسیم اور 8.25% مرکب سود ٹریکر۔",
          savLink: "بچت مرکز دیکھیں",
          kycTitle: "🏦 NPCI پینی ڈراپ اور KYC",
          kycDesc: "سب 200ms بینک تصدیق + نام کی تصحیح اور ₹7 لاکھ مفت EDLI۔",
          kycLink: "تفصیلات کی تصحیح دیکھیں"
        };
      default:
        return {
          tag: "⚡ Product Capabilities Deck",
          arch: "80/20 Sovereign AI Architecture",
          heading: `What Jan-EPF AI Can Do For ${firstName}`,
          guideBtn: "📖 Step-by-Step Guide",
          agentBtn: "⚡ Open AI Agent",
          advTitle: "🏥 Para 68J Emergency Advance",
          advDesc: "Mathematical pre-flight check sanctions advance limits with Section 192A Form 15G in <0.05ms.",
          advLink: "Test Advance Hub",
          trnTitle: "🔄 Form 13 Job Transfer",
          trnDesc: "Auto-deduces missing exit dates from monthly ECR wage timestamps, unlocking trapped balances.",
          trnLink: "Test Career Hub",
          savTitle: "📊 Triple-Split Passbook",
          savDesc: "Splits corpus into 12% + 3.67% + 8.33% with monthly EPS-95 pension tracking & compounding forecaster.",
          savLink: "Test Savings Hub",
          kycTitle: "🏦 NPCI Penny Drop & KYC",
          kycDesc: "Sub-200ms bank KYC verification + Wagner-Fischer fuzzy name correction and ₹7L free EDLI nomination.",
          kycLink: "Test Fix Details Hub"
        };
    }
  }, [langCode, firstName]);

  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState<boolean>(true);
  const [uanCopied, setUanCopied] = useState<boolean>(false);

  // Automatically show the Citizen Onboarding Guide ONLY on fresh login or persona switch into account home page
  useEffect(() => {
    if (isAuthenticated && activeCitizen && activeCitizen.uan) {
      if (typeof window !== "undefined") {
        const justLoggedIn = sessionStorage.getItem("jan_epf_just_logged_in");
        if (justLoggedIn === "true") {
          sessionStorage.removeItem("jan_epf_just_logged_in"); // Consume it so future visits to / don't pop up!
          const timer = setTimeout(() => {
            setOnboardingModalOpen(true);
          }, 200);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isAuthenticated, activeCitizen?.uan]);

  const handleCloseOnboarding = () => {
    setOnboardingModalOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("jan_epf_just_logged_in");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jan_epf_privacy_mode");
      if (saved !== null) { setPrivacyMode(saved === "true"); } else { setPrivacyMode(true); }
    }
  }, []);

  const togglePrivacyMode = () => {
    setPrivacyMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("jan_epf_privacy_mode", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePrivacyMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopyUan = () => {
    navigator.clipboard.writeText(activeCitizen.uan);
    setUanCopied(true);
    setTimeout(() => setUanCopied(false), 2000);
  };

  const totalBalance = activeCitizen.passbook_summary?.total_balance || 0;
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = totalBalance / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalBalance) {
        setDisplayBalance(totalBalance);
        clearInterval(timer);
      } else {
        setDisplayBalance(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [totalBalance]);

  const personaScenarios = [
    {
      uan: "100982348712",
      name: "Ramesh Kumar (Age 48)",
      role: "Factory Machine Operator",
      org: "Precision Auto Components Pvt Ltd (8.2 yrs)",
      balance: "₹3,42,500",
      badge: "Form 31 Advance",
      badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      testScenario: "Tests: Emergency Medical (Para 68J) or Housing (Para 68B) advance with instant Canvas Cheque OCR pre-validation.",
      icon: Coins
    },
    {
      uan: "101294817203",
      name: "Priya Sharma (Age 27)",
      role: "Software Engineer",
      org: "Apex AI Systems India (Prev: CloudNine)",
      balance: "₹4,75,000",
      badge: "Form 13 Job Switch",
      badgeColor: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      testScenario: "Tests: Multi-job PF transfer (₹1.85L) + Auto-deduction of missing Date of Exit (DOE) from last ECR timestamp.",
      icon: Building2
    },
    {
      uan: "100112233445",
      name: "Gurmeet Singh (Age 66)",
      role: "Senior Pensioner",
      org: "Retired (EPS-95 Pensioner)",
      balance: "₹4,250 / mo (Pension)",
      badge: "Senior Pensioner",
      badgeColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      testScenario: "Tests: High-contrast Senior Citizen Mode (130% scaling, black/yellow palette) and EPS-95 monthly pension ledgers.",
      icon: HeartHandshake
    },
    {
      uan: "101889977665",
      name: "Sunita Devi (Age 34)",
      role: "Gig Healthcare Worker",
      org: "QuickBite Logistics & Courier Services",
      balance: "₹86,400",
      badge: "e-Nomination & KYC",
      badgeColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800",
      testScenario: "Tests: Mobile 1-click e-Nomination with Aadhaar e-Sign, Levenshtein fuzzy name match, and ₹7L EDLI insurance.",
      icon: UserCheck
    }
  ];

  // If visitor is NOT authenticated, display the 1-Click Persona Login Gateway
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out">
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>HACKATHON EVALUATOR & CITIZEN LOGIN GATEWAY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sovereign-navy dark:text-white tracking-tight">
            Select a Mock Citizen Persona to Begin
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instant 1-Click Evaluator & Citizen Gateway. Select any persona scenario below to immediately test the rebuilt life-event hubs with zero SMS OTP friction.
          </p>
        </div>

        {/* 4 Persona Scenario Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personaScenarios.map((persona) => {
            const Icon = persona.icon;
            const isCurrent = activeCitizen.uan === persona.uan;
            return (
              <div
                key={persona.uan}
                onClick={() => login(persona.uan)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 ${
                  isCurrent
                    ? "border-saffron bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-saffron/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-sovereign-navy text-white flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-sovereign-navy dark:text-white flex items-center gap-1.5">
                          <span>{persona.name}</span>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{persona.role}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${persona.badgeColor}`}>
                      {persona.badge}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700 font-mono">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Establishment:</span>
                      <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[180px] font-sans">{persona.org}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Simulated UAN:</span>
                      <strong className="text-slate-900 dark:text-white">{persona.uan}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Current Corpus:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{persona.balance}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-blue-50/50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-100/50 dark:border-blue-900/40">
                    💡 {persona.testScenario}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    login(persona.uan);
                  }}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-sovereign-navy text-white hover:bg-sovereign-light flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>1-Click Instant Login as {persona.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Evaluator Security & Zero-Trust Notice */}
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-center max-w-xl mx-auto space-y-1">
          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Sovereign Sandbox Protocol • 100% Deterministic & Safe</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Engineered with Zero-Trust local execution. Select any persona above to instantly test all 8 end-to-end statutory workflows.
          </p>
        </div>
      </div>
    );
  }

  // If visitor IS authenticated, display the full Citizen Dashboard
  const employeeShare = activeCitizen.passbook_summary?.employee_share || 0;
  const interestEarned = activeCitizen.passbook_summary?.interest_credited_current_fy || 0;

  const topicHubs = [
    {
      title: t.navMoney,
      desc: t.homeMoneyDesc,
      href: "/money",
      icon: Wallet,
      tag: "Para 68",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      stat: "Instant DBT Sanction"
    },
    {
      title: t.navCareer,
      desc: t.homeCareerDesc,
      href: "/career",
      icon: Briefcase,
      tag: "Form 13",
      tagColor: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
      stat: "Auto-Exit Deduction"
    },
    {
      title: t.navSavings,
      desc: t.homeSavingsDesc,
      href: "/savings",
      icon: PiggyBank,
      tag: "8.25%",
      tagColor: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      stat: "₹7 Lakh Free Insurance"
    },
    {
      title: t.navFix,
      desc: t.homeFixDesc,
      href: "/fix",
      icon: Wrench,
      tag: "Self-Healing KYC",
      tagColor: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
      stat: "Para 72(5) Legal Shield"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out">
      {/* 🌟 SENIOR CITIZEN ACCESSIBILITY & PENSION HERO BANNER */}
      {(seniorMode || activeCitizen.uan === "100112233445" || Boolean(activeCitizen.pension_details)) && (
        <section className={`border-2 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md transition-all ${
          seniorMode
            ? "bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-600/20 border-amber-400 dark:border-amber-500"
            : "bg-gradient-to-r from-slate-800/40 to-slate-900/60 border-slate-700/60"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${
                  seniorMode ? "bg-amber-400 text-slate-950" : "bg-slate-700 text-slate-200"
                }`}>
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>{seniorMode ? "SENIOR CITIZEN MODE ACTIVE" : "SENIOR CITIZEN ASSISTANCE AVAILABLE"}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-300 border border-amber-600/50">
                  {seniorMode ? "WCAG AAA High Contrast (7:1) • 125% Comfortable Scaling" : "High-Contrast & Large Touch Targets Ready"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-amber-100 flex items-center gap-2">
                <span>Digital Pension Assistance for {activeCitizen.full_name}</span>
                {activeCitizen.pension_details && (
                  <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    PPO: {activeCitizen.pension_details.ppo_number}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-700 dark:text-amber-200/80 font-medium">
                {seniorMode
                  ? "High-contrast typography, large touch targets, Jeevan Pramaan digital life certificate verification, and voice assistance are enabled for your convenience."
                  : "Senior Citizen Mode is currently OFF. Click Enable to switch to 125% high-contrast accessibility mode."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSeniorMode((prev) => !prev)}
              className={`px-4 py-2 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 ${
                seniorMode
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300"
                  : "bg-amber-500/80 hover:bg-amber-400 text-slate-950 border border-amber-400"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{seniorMode ? "Disable Senior Mode" : "Enable Senior Mode"}</span>
            </button>
          </div>
        </section>
      )}

      {/* 1. CITIZEN WELCOME HERO BANNER */}
      <section className="bg-gradient-to-br from-[#001738] via-[#0A2540] to-[#001f3f] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-900/60 relative overflow-hidden mt-2 sm:mt-3 card-hover-lift">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-samriddhi-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron text-sovereign-darkest">
                {t.citizenRedesignBadge || "CITIZEN REDESIGN PROTOTYPE"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1.5 shadow-sm">
                {t.dpdpProtectedBadge || "🛡️ DPDP Protected Account ID"}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-fit backdrop-blur-sm">
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                UAN:
              </span>
              <strong className="font-mono text-white text-base sm:text-lg tracking-wider min-w-[140px]">
                {privacyMode 
                  ? `${activeCitizen.uan.substring(0, 4)} •••• ${activeCitizen.uan.substring(8)}` 
                  : `${activeCitizen.uan.substring(0, 4)} ${activeCitizen.uan.substring(4, 8)} ${activeCitizen.uan.substring(8)}`}
              </strong>
              <div className="flex items-center gap-1 border-l border-white/10 pl-2.5 ml-1">
                <button
                  type="button"
                  onClick={togglePrivacyMode}
                  className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title={privacyMode ? "Show full details (⌘P)" : "Hide sensitive details (⌘P)"}
                >
                  {privacyMode ? <EyeOff className="w-4 h-4 text-saffron" /> : <Eye className="w-4 h-4 text-slate-300" />}
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopyUan}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Copy UAN to clipboard"
                  >
                    {uanCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  </button>
                  {uanCopied && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {activeCitizen.full_name}
              </h1>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 flex items-center gap-1.5 transition-colors h-fit"
                title="Switch persona or logout"
              >
                <LogOut className="w-3 h-3 text-saffron" />
                <span>{t.switchProfileBtn || "Switch Profile"}</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeCitizen.active_employment
                ? `${t.activeEstablishmentLabel}: ${activeCitizen.active_employment.establishment_name} (${activeCitizen.active_employment.total_service_years} years)`
                : activeCitizen.pension_details
                ? `Senior Pensioner • PPO: ${activeCitizen.pension_details.ppo_number} • ${activeCitizen.pension_details.scheme}`
                : "Gig Platform / Unorganized Contributor"}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.verifiedKYCLabel}: {activeCitizen.bank_kyc.bank_name} ({t.verified})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-amber-300 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.sovereignRateBadge || "8.25% Sovereign Rate Active"}</span>
              </div>
              <button
                type="button"
                onClick={() => setOnboardingModalOpen(true)}
                className="flex items-center gap-1.5 text-xs bg-saffron/20 hover:bg-saffron/30 px-3 py-1 rounded-lg backdrop-blur-sm border border-saffron/50 text-saffron font-bold transition-all shadow-sm hover:scale-105"
              >
                <span>💡 What You Need To Know</span>
              </button>
            </div>
          </div>

          {/* Quick Balance Card with Discreet Privacy Mode */}
          <div className="bg-white/5 backdrop-blur-md border border-white/15 p-5 rounded-2xl w-full lg:w-80 shadow-2xl space-y-3 shrink-0">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span>{t.totalBalanceLabel}</span>
                <button
                  type="button"
                  onClick={togglePrivacyMode}
                  className="p-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title={privacyMode ? "Show balances (Discreet Mode Active)" : "Hide balances (Privacy Mode)"}
                >
                  {privacyMode ? <EyeOff className="w-3.5 h-3.5 text-saffron" /> : <Eye className="w-3.5 h-3.5 text-slate-300" />}
                </button>
              </div>
              <span className="text-emerald-400 font-bold">● {t.verified}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white flex items-center">
              {privacyMode ? (
                <span className="tracking-widest text-slate-300 font-sans select-none">₹ ••••••••</span>
              ) : (
                <span>₹{displayBalance.toLocaleString("en-IN")}</span>
              )}
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-200 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">{t.employeeShareLabel || "Employee Share (12%):"}</span>
                <span className="font-bold text-white">
                  {privacyMode ? "₹ ••••••" : `₹${employeeShare.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">{t.fyInterestLabel || "FY Interest (8.25%):"}</span>
                <span className="font-bold text-amber-300">
                  {privacyMode ? "₹ •••••" : `₹${interestEarned.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLAIM READINESS SCORE CARD */}
      <ClaimReadinessScore />

      {/* 2.5 INTERACTIVE BIG-TECH CAPABILITIES HERO (WHAT OUR PRODUCT CAN DO) */}
      <div className="bg-gradient-to-r from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-5 sm:p-6 text-white border border-slate-700/80 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-saffron text-slate-950 font-black text-[10px] uppercase font-mono tracking-wider">
                {deckLabels.tag}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {deckLabels.arch}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              {deckLabels.heading}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuideModalOpen(true)}
              className="px-3.5 py-2 bg-[#1e293b] hover:bg-[#334155] text-amber-300 hover:text-amber-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{deckLabels.guideBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-sovereign-agent"));
              }}
              className="px-3.5 py-2 bg-saffron hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <span>{deckLabels.agentBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/money"
            className="p-4 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700/80 hover:border-emerald-500/60 transition-all space-y-2 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                {deckLabels.advTitle}
              </span>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                0% TDS
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {deckLabels.advDesc}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold pt-1">
              <span>{deckLabels.advLink}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/career"
            className="p-4 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700/80 hover:border-blue-500/60 transition-all space-y-2 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                {deckLabels.trnTitle}
              </span>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                ECR Auto-Exit
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {deckLabels.trnDesc}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold pt-1">
              <span>{deckLabels.trnLink}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/savings"
            className="p-4 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700/80 hover:border-purple-500/60 transition-all space-y-2 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                {deckLabels.savTitle}
              </span>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                8.25% FY Growth
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {deckLabels.savDesc}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-purple-400 font-bold pt-1">
              <span>{deckLabels.savLink}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/fix"
            className="p-4 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700/80 hover:border-amber-500/60 transition-all space-y-2 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                {deckLabels.kycTitle}
              </span>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Wagner-Fischer
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {deckLabels.kycDesc}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold pt-1">
              <span>{deckLabels.kycLink}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 3. 4 TOPIC-CENTRIC ACTION HUBS */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-sovereign-navy dark:text-white tracking-tight">
              Human Life Event Portals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.homeSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/benchmarks"
              className="text-xs font-bold px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-600 text-emerald-800 hover:text-white dark:text-emerald-300 dark:hover:text-white border border-emerald-500/40 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Inspect 1,000-run live microsecond benchmarks and 3-way evals"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>⚡ Live Benchmarks (&lt;0.05ms)</span>
            </Link>
            <button
              onClick={() => setChaosSimulatorOpen(true)}
              className="text-xs font-bold px-3 py-1.5 bg-saffron/15 hover:bg-saffron text-sovereign-darkest dark:text-amber-300 dark:hover:text-slate-950 border border-saffron/40 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Launch Chaos Sandbox to inject mismatches and test self-healing"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Stress-Test Chaos Sandbox</span>
            </button>
            <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl">
              80/20 On-Site Sovereign Core
            </span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topicHubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-sovereign-navy text-white flex items-center justify-center group-hover:bg-saffron group-hover:text-sovereign-darkest transition-colors shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${hub.tagColor}`}>
                      {hub.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-sovereign-navy dark:text-white group-hover:text-saffron transition-colors">
                      {hub.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
                      {hub.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{hub.stat}</span>
                  <div className="flex items-center gap-1 text-sovereign-navy dark:text-white group-hover:text-saffron group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. SOVEREIGN 80/20 BENCHMARK & PROOF ASSET GATEWAY */}
      <div className="pt-2">
        <Link
          href="/benchmarks"
          className="group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-sovereign-darkest to-sovereign-navy border border-slate-700/80 hover:border-saffron/80 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl group-hover:bg-saffron/20 transition-all pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-saffron/20 text-saffron flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-white group-hover:text-saffron transition-colors">
                  Sovereign 80/20 Core Benchmark & Evidence Laboratory
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800">
                  &lt;0.05ms Latency
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-mono font-bold border border-blue-800">
                  3-Way Evals Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Inspect the 1,000-run live in-browser latency runner, raw execution traces, 76.4% token pruning receipts, and DPDP Act 2023 compliance audit.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold bg-saffron text-sovereign-darkest group-hover:bg-amber-400 flex items-center justify-center gap-2 transition-all shadow-md shrink-0 relative z-10">
            <span>Explore Proof Assets Hub</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Chaos Simulator Sandbox Modal */}
      <ChaosSimulatorModal
        isOpen={chaosSimulatorOpen}
        onClose={() => setChaosSimulatorOpen(false)}
      />

      {/* Step-by-Step Sovereign AI Agent User Guide Modal */}
      <AIAgentGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        onSelectPrompt={(prompt) => {
          setGuideModalOpen(false);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("open-jan-epf-agent", { detail: { mode: "chat", prompt } }));
          }
        }}
      />

      {/* Citizen Account Onboarding & Key Things to Know Modal */}
      {isAuthenticated && (
        <CitizenAccountOnboardingModal
          isOpen={onboardingModalOpen}
          onClose={handleCloseOnboarding}
          onOpenCopilot={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("open-jan-epf-agent", { detail: { mode: "chat" } }));
            }
          }}
        />
      )}
    </div>
  );
}
