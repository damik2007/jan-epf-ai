import re

new_keys_definition = """  // Claim Readiness Island & Dashboard Badges
  claimReadinessTitle: string;
  claimReadinessLiveRecord: string;
  claimReadinessHighDesc: string;
  claimReadinessPendingDesc: string;
  readinessBankKYC: string;
  readinessAadhaarSeeded: string;
  readinessPanLinked: string;
  readinessEmploymentActive: string;
  readinessNominationActive: string;
  readinessNominationPending: string;
  citizenRedesignBadge: string;
  dpdpProtectedBadge: string;
  switchProfileBtn: string;
  sovereignRateBadge: string;
  employeeShareLabel: string;
  fyInterestLabel: string;
"""

translations_data = {
    "en-IN": {
        "claimReadinessTitle": "Claim Readiness Score",
        "claimReadinessLiveRecord": "Live Record",
        "claimReadinessHighDesc": "All critical statutory criteria verified. 99% instant automated DBT approval probability.",
        "claimReadinessPendingDesc": "A few non-critical items pending. High probability of fast clearance.",
        "readinessBankKYC": "Bank KYC",
        "readinessAadhaarSeeded": "Aadhaar Seeded",
        "readinessPanLinked": "PAN Linked",
        "readinessEmploymentActive": "Employment Active",
        "readinessNominationActive": "e-Nomination (₹7L Active)",
        "readinessNominationPending": "e-Nomination (Pending) ↗",
        "citizenRedesignBadge": "CITIZEN REDESIGN PROTOTYPE",
        "dpdpProtectedBadge": "🛡️ DPDP Protected Account ID",
        "switchProfileBtn": "Switch Profile",
        "sovereignRateBadge": "8.25% Sovereign Rate Active",
        "employeeShareLabel": "Employee Share (12%):",
        "fyInterestLabel": "FY Interest (8.25%):",
    },
    "te-IN": {
        "claimReadinessTitle": "క్లెయిమ్ సంసిద్ధత స్కోరు",
        "claimReadinessLiveRecord": "లైవ్ రికార్డ్",
        "claimReadinessHighDesc": "అన్ని చట్టబద్ధమైన ప్రమాణాలు ధృవీకరించబడ్డాయి. 99% తక్షణ డీబీటీ ఆమోదం.",
        "claimReadinessPendingDesc": "కొన్ని అంశాలు పెండింగ్‌లో ఉన్నాయి. వేగవంతమైన పరిష్కార అవకాశం.",
        "readinessBankKYC": "బ్యాంక్ కేవైసీ",
        "readinessAadhaarSeeded": "ఆధార్ అనుసంధానించబడింది",
        "readinessPanLinked": "పాన్ లింక్ చేయబడింది",
        "readinessEmploymentActive": "ఉద్యోగం యాక్టివ్",
        "readinessNominationActive": "ఇ-నామినేషన్ (₹7 లక్షలు యాక్టివ్)",
        "readinessNominationPending": "ఇ-నామినేషన్ (పెండింగ్) ↗",
        "citizenRedesignBadge": "సిటిజన్ రీడిజైన్ నమూనా",
        "dpdpProtectedBadge": "🛡️ డీపీడీపీ రక్షిత ఖాతా",
        "switchProfileBtn": "ప్రొఫైల్ మార్చండి",
        "sovereignRateBadge": "8.25% వార్షిక వడ్డీ రేటు యాక్టివ్",
        "employeeShareLabel": "ఉద్యోగి వాటా (12%):",
        "fyInterestLabel": "ఆర్థిక సంవత్సర వడ్డీ (8.25%):",
    },
    "hi-IN": {
        "claimReadinessTitle": "दावा तत्परता स्कोर",
        "claimReadinessLiveRecord": "लाइव रिकॉर्ड",
        "claimReadinessHighDesc": "सभी वैधानिक मानदंड सत्यापित। 99% तत्काल स्वचालित डीबीटी स्वीकृति संभावना।",
        "claimReadinessPendingDesc": "कुछ गैर-महत्वपूर्ण मदें लंबित हैं। त्वरित निकासी की उच्च संभावना।",
        "readinessBankKYC": "बैंक केवाईसी",
        "readinessAadhaarSeeded": "आधार लिंक है",
        "readinessPanLinked": "पैन लिंक है",
        "readinessEmploymentActive": "रोजगार सक्रिय",
        "readinessNominationActive": "ई-नामांकन (₹7 लाख सक्रिय)",
        "readinessNominationPending": "ई-नामांकन (लंबित) ↗",
        "citizenRedesignBadge": "नागरिक पुनर्डिजाइन प्रोटोटाइप",
        "dpdpProtectedBadge": "🛡️ डीपीडीपी सुरक्षित खाता आईडी",
        "switchProfileBtn": "प्रोफाइल बदलें",
        "sovereignRateBadge": "8.25% वार्षिक ब्याज दर सक्रिय",
        "employeeShareLabel": "कर्मचारी अंशदान (12%):",
        "fyInterestLabel": "वित्तीय वर्ष ब्याज (8.25%):",
    },
    "ta-IN": {
        "claimReadinessTitle": "கோரிக்கை தயார்நிலை மதிப்பெண்",
        "claimReadinessLiveRecord": "நேரலை பதிவு",
        "claimReadinessHighDesc": "அனைத்து முக்கிய விதிகளும் சரிபார்க்கப்பட்டன. 99% உடனடி டிபிடி ஒப்புதல் வாய்ப்பு.",
        "claimReadinessPendingDesc": "சில சிறிய விவரங்கள் நிலுவையில் உள்ளன. விரைவான அனுமதி வாய்ப்பு.",
        "readinessBankKYC": "வங்கி கேஒய்சி",
        "readinessAadhaarSeeded": "ஆதார் இணைக்கப்பட்டது",
        "readinessPanLinked": "பான் இணைக்கப்பட்டது",
        "readinessEmploymentActive": "பணி செயலில் உள்ளது",
        "readinessNominationActive": "மின்-நியமனம் (₹7 லட்சம் செயலில்)",
        "readinessNominationPending": "மின்-நியமனம் (நிலுவை) ↗",
        "citizenRedesignBadge": "குடிமக்கள் மறுவடிவமைப்பு முன்மாதிரி",
        "dpdpProtectedBadge": "🛡️ டிபிடிபி பாதுகாக்கப்பட்ட கணக்கு",
        "switchProfileBtn": "சுயவிவரத்தை மாற்றவும்",
        "sovereignRateBadge": "8.25% வட்டி விகிதம் செயலில் உள்ளது",
        "employeeShareLabel": "பணியாளர் பங்கு (12%):",
        "fyInterestLabel": "நிதியாண்டு வட்டி (8.25%):",
    },
    "kn-IN": {
        "claimReadinessTitle": "ಕ್ಲೈಮ್ ಸನ್ನದ್ಧತೆಯ ಸ್ಕೋರ್",
        "claimReadinessLiveRecord": "ಲೈವ್ ದಾಖಲೆ",
        "claimReadinessHighDesc": "ಎಲ್ಲಾ ಶಾಸನಬದ್ಧ ಮಾನದಂಡಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. 99% ತ್ವರಿತ ಡಿಬಿಟಿ ಅನುಮೋದನೆ.",
        "claimReadinessPendingDesc": "ಕೆಲವು ಬಾಕಿಗಳಿವೆ. ಶೀಘ್ರ ವಿಲೇವಾರಿ ಸಾಧ್ಯತೆ.",
        "readinessBankKYC": "ಬ್ಯಾಂಕ್ ಕೆವೈಸಿ",
        "readinessAadhaarSeeded": "ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿದೆ",
        "readinessPanLinked": "ಪ್ಯಾನ್ ಲಿಂಕ್ ಆಗಿದೆ",
        "readinessEmploymentActive": "ಉದ್ಯೋಗ ಸಕ್ರಿಯವಾಗಿದೆ",
        "readinessNominationActive": "ಇ-ನಾಮನಿರ್ದೇಶನ (₹7 ಲಕ್ಷ ಸಕ್ರಿಯ)",
        "readinessNominationPending": "ಇ-ನಾಮನಿರ್ದೇಶನ (ಬಾಕಿ) ↗",
        "citizenRedesignBadge": "ನಾಗರಿಕ ಮರುವಿನ್ಯಾಸ ಮಾದರಿ",
        "dpdpProtectedBadge": "🛡️ ಡಿಪಿಡಿಪಿ ಸಂರಕ್ಷಿತ ಖಾತೆ",
        "switchProfileBtn": "ಪ್ರೊಫೈಲ್ ಬದಲಾಯಿಸಿ",
        "sovereignRateBadge": "8.25% ಸಾರ್ವಭೌಮ ಬಡ್ಡಿ ದರ ಸಕ್ರಿಯ",
        "employeeShareLabel": "ಉದ್ಯೋಗಿ ಪಾಲು (12%):",
        "fyInterestLabel": "ವಾರ್ಷಿಕ ಬಡ್ಡಿ (8.25%):",
    },
    "ml-IN": {
        "claimReadinessTitle": "ക്ലെയിം സന്നദ്ധതാ സ്കോർ",
        "claimReadinessLiveRecord": "തത്സമയ രേഖ",
        "claimReadinessHighDesc": "എല്ലാ നിയമപരമായ മാനദണ്ഡങ്ങളും പരിശോധിച്ചു. 99% തൽക്ഷണ ഡിബിടി അംഗീകാരം.",
        "claimReadinessPendingDesc": "ചില ഇനങ്ങൾ ശേഷിക്കുന്നു. വേഗത്തിലുള്ള അനുമതി സാധ്യത.",
        "readinessBankKYC": "ബാങ്ക് കെവൈസി",
        "readinessAadhaarSeeded": "ആധാർ ബന്ധിപ്പിച്ചു",
        "readinessPanLinked": "പാൻ ബന്ധിപ്പിച്ചു",
        "readinessEmploymentActive": "തൊഴിൽ സജീവം",
        "readinessNominationActive": "ഇ-നോമിനേഷൻ (₹7 ലക്ഷം സജീവം)",
        "readinessNominationPending": "ഇ-നോമിനേഷൻ (ബാക്കി) ↗",
        "citizenRedesignBadge": "പൗര പുനർരൂപകൽപ്പന മാതൃക",
        "dpdpProtectedBadge": "🛡️ ഡിപിഡിപി സംരക്ഷിത അക്കൗണ്ട്",
        "switchProfileBtn": "പ്രൊഫൈൽ മാറ്റുക",
        "sovereignRateBadge": "8.25% പലിശ നിരക്ക് സജീവം",
        "employeeShareLabel": "തൊഴിലാളി വിഹിതം (12%):",
        "fyInterestLabel": "സാമ്പത്തിക വർഷ പലിശ (8.25%):",
    },
    "mr-IN": {
        "claimReadinessTitle": "दावा तत्परता स्कोअर",
        "claimReadinessLiveRecord": "थेट नोंद",
        "claimReadinessHighDesc": "सर्व वैधानिक निकष सत्यापित. 99% त्वरित डीबीटी मंजुरी शक्यता.",
        "claimReadinessPendingDesc": "काही किरकोळ बाबी प्रलंबित आहेत. जलद मंजुरीची उच्च शक्यता.",
        "readinessBankKYC": "बँक केवायसी",
        "readinessAadhaarSeeded": "आधार जोडलेले आहे",
        "readinessPanLinked": "पॅन जोडलेले आहे",
        "readinessEmploymentActive": "रोजगार सक्रिय",
        "readinessNominationActive": "ई-नामांकन (₹7 लाख सक्रिय)",
        "readinessNominationPending": "ई-नामांकन (प्रलंबित) ↗",
        "citizenRedesignBadge": "नागरिक पुनर्रचना प्रोटोटाइप",
        "dpdpProtectedBadge": "🛡️ डीपीडीपी सुरक्षित खाते",
        "switchProfileBtn": "प्रोफाइल बदला",
        "sovereignRateBadge": "8.25% वार्षिक व्याजदर सक्रिय",
        "employeeShareLabel": "कर्मचारी हिस्सा (12%):",
        "fyInterestLabel": "वार्षिक व्याज (8.25%):",
    },
    "bn-IN": {
        "claimReadinessTitle": "দাবি প্রস্তুতি স্কোর",
        "claimReadinessLiveRecord": "লাইভ রেকর্ড",
        "claimReadinessHighDesc": "সমস্ত সংবিধিবদ্ধ মানদণ্ড যাচাই করা হয়েছে। 99% তাত্ক্ষণিক ডিবিটি অনুমোদনের সম্ভাবনা।",
        "claimReadinessPendingDesc": "কিছু ছোটখাটো বিষয় বাকি রয়েছে। দ্রুত নিষ্পত্তির উচ্চ সম্ভাবনা।",
        "readinessBankKYC": "ব্যাঙ্ক কেওয়াইসি",
        "readinessAadhaarSeeded": "আধার লিঙ্কযুক্ত",
        "readinessPanLinked": "প্যান লিঙ্কযুক্ত",
        "readinessEmploymentActive": "কর্মসংস্থান সক্রিয়",
        "readinessNominationActive": "ই-মনোনয়ন (₹7 লক্ষ সক্রিয়)",
        "readinessNominationPending": "ই-মনোনয়ন (বাকি) ↗",
        "citizenRedesignBadge": "নাগরিক রিডিজাইন প্রোটোটাইপ",
        "dpdpProtectedBadge": "🛡️ ডিপিডিপি সুরক্ষিত অ্যাকাউন্ট",
        "switchProfileBtn": "প্রোফাইল পরিবর্তন করুন",
        "sovereignRateBadge": "8.25% সার্বভৌম সুদের হার সক্রিয়",
        "employeeShareLabel": "কর্মচারীর অংশ (12%):",
        "fyInterestLabel": "অর্থবর্ষের সুদ (8.25%):",
    },
    "gu-IN": {
        "claimReadinessTitle": "ક્લેઇમ સજ્જતા સ્કોર",
        "claimReadinessLiveRecord": "લાઇવ રેકોર્ડ",
        "claimReadinessHighDesc": "તમામ વૈધાનિક માપદંડો ચકાસાયેલા છે. 99% ત્વરિત ડીબીટી મંજૂરીની સંભાવના.",
        "claimReadinessPendingDesc": "કેટલીક વિગતો બાકી છે. ઝડપી નિકાલની સંભાવના.",
        "readinessBankKYC": "બેંક કેવાયસી",
        "readinessAadhaarSeeded": "આધાર લિંક છે",
        "readinessPanLinked": "પાન લિંક છે",
        "readinessEmploymentActive": "રોજગાર સક્રિય",
        "readinessNominationActive": "ઇ-નોમિનેશન (₹7 લાખ સક્રિય)",
        "readinessNominationPending": "ઇ-નોમિનેશન (બાકી) ↗",
        "citizenRedesignBadge": "નાગરિક રિડિઝાઇન પ્રોટોટાઇપ",
        "dpdpProtectedBadge": "🛡️ ડીપીડીપી સુરક્ષિત એકાઉન્ટ",
        "switchProfileBtn": "પ્રોફાઇલ બદલો",
        "sovereignRateBadge": "8.25% વ્યાજ દર સક્રિય",
        "employeeShareLabel": "કર્મચારી હિસ્સો (12%):",
        "fyInterestLabel": "વાર્ષિક વ્યાજ (8.25%):",
    },
    "pa-IN": {
        "claimReadinessTitle": "ਦਾਅਵਾ ਤਿਆਰੀ ਸਕੋਰ",
        "claimReadinessLiveRecord": "ਲਾਈਵ ਰਿਕਾਰਡ",
        "claimReadinessHighDesc": "ਸਾਰੇ ਕਾਨੂੰਨੀ ਮਾਪਦੰਡ ਪ੍ਰਮਾਣਿਤ ਹਨ। 99% ਤੁਰੰਤ ਡੀਬੀਟੀ ਮਨਜ਼ੂਰੀ ਦੀ ਸੰਭਾਵਨਾ।",
        "claimReadinessPendingDesc": "ਕੁਝ ਮਾਮੂਲੀ ਵੇਰਵੇ ਬਕਾਇਆ ਹਨ। ਜਲਦੀ ਨਿਪਟਾਰੇ ਦੀ ਸੰਭਾਵਨਾ।",
        "readinessBankKYC": "ਬੈਂਕ ਕੇਵਾਈਸੀ",
        "readinessAadhaarSeeded": "ਆਧਾਰ ਲਿੰਕ ਹੈ",
        "readinessPanLinked": "ਪੈਨ ਲਿੰਕ ਹੈ",
        "readinessEmploymentActive": "ਰੋਜ਼ਗਾਰ ਸਰਗਰਮ",
        "readinessNominationActive": "ਈ-ਨਾਮਜ਼ਦਗੀ (₹7 ਲੱਖ ਸਰਗਰਮ)",
        "readinessNominationPending": "ਈ-ਨਾਮਜ਼ਦਗੀ (ਬਕਾਇਆ) ↗",
        "citizenRedesignBadge": "ਨਾਗਰਿਕ ਮੁੜ-ਡਿਜ਼ਾਈਨ ਪ੍ਰੋਟੋਟਾਈਪ",
        "dpdpProtectedBadge": "🛡️ ਡੀਪੀਡੀਪੀ ਸੁਰੱਖਿਅਤ ਖਾਤਾ",
        "switchProfileBtn": "ਪ੍ਰੋਫਾਈਲ ਬਦਲੋ",
        "sovereignRateBadge": "8.25% ਵਿਆਜ ਦਰ ਸਰਗਰਮ",
        "employeeShareLabel": "ਕਰਮਚਾਰੀ ਹਿੱਸਾ (12%):",
        "fyInterestLabel": "ਸਾਲਾਨਾ ਵਿਆਜ (8.25%):",
    },
    "or-IN": {
        "claimReadinessTitle": "ଦାବି ପ୍ରସ୍ତୁତି ସ୍କୋର",
        "claimReadinessLiveRecord": "ଲାଇଭ୍ ରେକର୍ଡ",
        "claimReadinessHighDesc": "ସମସ୍ତ ଆଇନଗତ ମାନଦଣ୍ଡ ଯାଞ୍ଚ ହୋଇଛି। 99% ତୁରନ୍ତ ଡିବିଟି ଅନୁମୋଦନ ସମ୍ଭାବନା।",
        "claimReadinessPendingDesc": "କିଛି ତଥ୍ୟ ବାକି ରହିଛି। ଶୀଘ୍ର ସମାଧାନର ସମ୍ଭାବନା।",
        "readinessBankKYC": "ବ୍ୟାଙ୍କ କେୱାଇସି",
        "readinessAadhaarSeeded": "ଆଧାର ସଂଯୁକ୍ତ",
        "readinessPanLinked": "ପ୍ୟାନ୍ ସଂଯୁକ୍ତ",
        "readinessEmploymentActive": "ନିଯୁକ୍ତି ସକ୍ରିୟ",
        "readinessNominationActive": "ଇ-ନାମାଙ୍କନ (₹7 ଲକ୍ଷ ସକ୍ରିୟ)",
        "readinessNominationPending": "ଇ-ନାମାଙ୍କନ (ବାକି) ↗",
        "citizenRedesignBadge": "ନାଗରିକ ପୁନଃଡିଜାଇନ ପ୍ରୋଟୋଟାଇପ",
        "dpdpProtectedBadge": "🛡️ ଡିପିଡିପି ସୁରକ୍ଷିତ ଖାତା",
        "switchProfileBtn": "ପ୍ରୋଫାଇଲ ପରିବର୍ତ୍ତନ କରନ୍ତୁ",
        "sovereignRateBadge": "8.25% ସୁଧ ହାର ସକ୍ରିୟ",
        "employeeShareLabel": "କର୍ମଚାରୀ ଅଂଶ (12%):",
        "fyInterestLabel": "ବାର୍ଷିକ ସୁଧ (8.25%):",
    },
    "as-IN": {
        "claimReadinessTitle": "দাবী প্ৰস্তুতি স্ক'ৰ",
        "claimReadinessLiveRecord": "লাইভ ৰেকৰ্ড",
        "claimReadinessHighDesc": "সকলো সংবিধিবদ্ধ মাপকাঠী সত্যাপন কৰা হৈছে। 99% তাৎক্ষণিক ডিবিটি অনুমোদনৰ সম্ভাৱনা।",
        "claimReadinessPendingDesc": "কিছু সৰু তথ্য বাকী আছে। দ্ৰুত নিষ্পত্তিৰ সম্ভাৱনা।",
        "readinessBankKYC": "বেংক কেৱাইচি",
        "readinessAadhaarSeeded": "আধাৰ সংযোগ কৰা হৈছে",
        "readinessPanLinked": "পান সংযোগ কৰা হৈছে",
        "readinessEmploymentActive": "নিয়োগ সক্ৰিয়",
        "readinessNominationActive": "ই-মনোনয়ন (₹7 লাখ সক্ৰিয়)",
        "readinessNominationPending": "ই-মনোনয়ন (বাকী) ↗",
        "citizenRedesignBadge": "নাগৰিক পুনৰ্গঠন প্ৰটোটাইপ",
        "dpdpProtectedBadge": "🛡️ ডিপিডিপি সুৰক্ষিত একাউণ্ট",
        "switchProfileBtn": "প্ৰফাইল সলনি কৰক",
        "sovereignRateBadge": "8.25% সুতৰ হাৰ সক্ৰিয়",
        "employeeShareLabel": "কৰ্মচাৰীৰ অংশ (12%):",
        "fyInterestLabel": "বিত্তীয় বৰ্ষৰ সুত (8.25%):",
    },
    "ur-IN": {
        "claimReadinessTitle": "کلیم کی تیاری کا اسکور",
        "claimReadinessLiveRecord": "لائیو ریکارڈ",
        "claimReadinessHighDesc": "تمام قانونی معیارات کی تصدیق ہو چکی ہے۔ 99% فوری ڈی بی ٹی منظوری کا امکان۔",
        "claimReadinessPendingDesc": "کچھ غیر اہم تفصیلات زیر التواء ہیں۔ جلد منظوری کا قوی امکان۔",
        "readinessBankKYC": "بینک کے وائی سی",
        "readinessAadhaarSeeded": "آدھار منسلک ہے",
        "readinessPanLinked": "پین منسلک ہے",
        "readinessEmploymentActive": "ملازمت فعال ہے",
        "readinessNominationActive": "ای-نامزدگی (₹7 لاکھ فعال)",
        "readinessNominationPending": "ای-نامزدگی (زیر التواء) ↗",
        "citizenRedesignBadge": "شہری ری ڈیزائن پروٹو ٹائپ",
        "dpdpProtectedBadge": "🛡️ ڈی پی ڈی پی محفوظ اکاؤنٹ",
        "switchProfileBtn": "پروفائل تبدیل کریں",
        "sovereignRateBadge": "8.25% سود کی شرح فعال",
        "employeeShareLabel": "ملازم کا حصہ (12%):",
        "fyInterestLabel": "مالی سال کا سود (8.25%):",
    },
}

with open("frontend/src/lib/translations.ts", "r") as f:
    content = f.read()

# 1. Update interface Translations
if "claimReadinessTitle: string;" not in content:
    content = content.replace(
        "export interface Translations {",
        "export interface Translations {\n" + new_keys_definition
    )
    print("Added new keys to Translations interface")

# 2. Inject dictionary entries for each language
for lang_code, keys_dict in translations_data.items():
    formatted_entries = ""
    for k, v in keys_dict.items():
        # Escape quotes in value if needed
        clean_v = v.replace('"', '\\"')
        formatted_entries += f'    {k}: "{clean_v}",\n'
    
    # Locate dictionary for this language: e.g. '"en-IN": {' or '"te-IN": {'
    lang_pattern = rf'("{lang_code}"\s*:\s*\{{)'
    if re.search(lang_pattern, content):
        content = re.sub(lang_pattern, rf'\1\n{formatted_entries}', content, count=1)
        print(f"Injected translations for {lang_code}")
    else:
        print(f"Could not find pattern for {lang_code}")

with open("frontend/src/lib/translations.ts", "w") as f:
    f.write(content)

print("translations.ts successfully updated with all 13 languages!")
