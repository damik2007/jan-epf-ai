"""
Jan-EPF AI: Voice Assistant & Multilingual Intent Classifier Route (Agent 2).
Supports Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), and English with sovereign on-device token rules.
"""
from fastapi import APIRouter
from src.core.data_store import mock_store
from src.core.schemas import VoiceCommandRequest, VoiceCommandResponse

router = APIRouter(prefix="/voice", tags=["Voice Assistant"])


@router.post("/intent", response_model=VoiceCommandResponse)
async def parse_voice_intent(req: VoiceCommandRequest):
    raw_text = (req.audio_transcript or "").strip()
    text = raw_text.lower()
    lang = req.detected_language or "en-IN"

    citizen = None
    if req.uan_context:
        citizen = mock_store.get_citizen(req.uan_context)

    # 1. Money Intent (Medical, Advance, Cash, Emergency, Illness, Hospital, Bimaari, Dabbulu, Panam)
    money_keywords = [
        "money", "advance", "medical", "hospital", "illness", "treatment", "paisa",
        "paise", "bimar", "bimaari", "dabbulu", "aavashyakathe", "panam", "need money",
        "withdraw", "emergency", "इमरजेंसी", "मेडिकल", "पैसे", "बीमार", "अस्पताल", "पैसे निकालने",
        "డబ్బులు", "ఎమర్జెన్సీ", "ఆరోగ్యం", "హాస్పిటల్", "பணம்", "மருத்துவம்"
    ]
    if any(w in text or w in raw_text for w in money_keywords):
        spoken_map = {
            "hi-IN": "मैंने आपके लिए इमरजेंसी मेडिकल एडवांस फॉर्म तैयार कर दिया है। कृपया क्लेम राशि चेक करें।",
            "te-IN": "మీ కోసం ఎమర్జెన్సీ మెడికల్ అడ్వాన్స్ ఫారమ్ సిద్ధం చేసాము. దయచేసి వివరాలు ధృవీకరించండి.",
            "ta-IN": "உங்களுக்கான அவசர மருத்துவ முன்பண படிவம் தயாராக உள்ளது.",
            "en-IN": "I have prepared your Emergency Medical Advance form under Para 68J. Please review the prefilled details."
        }
        return VoiceCommandResponse(
            recognized_intent="EMERGENCY_MEDICAL_ADVANCE",
            target_route="/money",
            spoken_response_text=spoken_map.get(lang, spoken_map["en-IN"]),
            prefilled_form_data={
                "claim_type": "FORM_31_MEDICAL",
                "reason_code": "PARA_68J_ILLNESS",
                "amount_requested": 50000.0
            },
            confidence_score=0.98
        )

    # 2. Career / Transfer Intent (Transfer, Job change, Old company, Date of exit, Naukri badli, Maarpulu)
    career_keywords = [
        "transfer", "job", "company", "switch", "exit", "date of exit",
        "badli", "purana", "leave", "resigned", "marpu", "maatruthal",
        "ट्रांसफर", "नौकरी", "पुरानी कंपनी", "कंपनियां", "बदली", "డేట్ అఫ్ ఎగ్జిట్", "బదిలీ", "நிறுவனம்", "பணி மாற்றம்"
    ]
    if any(w in text or w in raw_text for w in career_keywords):
        spoken_map = {
            "hi-IN": "मैंने आपकी पिछली कंपनियों के बैलेंस ट्रांसफर की प्रक्रिया शुरू कर दी है।",
            "te-IN": "మీ మునుపటి కంపెనీ PF బ్యాలెన్స్ బదిలీ చేయడానికి పేజీ తెరుస్తున్నాను.",
            "ta-IN": "உங்கள் முந்தைய நிறுவன பிஎஃப் தொகையை மாற்ற பக்கத்திற்கு செல்கிறோம்.",
            "en-IN": "Navigating to Job Switch Hub. We will merge your previous PF balances into your current active account."
        }
        return VoiceCommandResponse(
            recognized_intent="TRANSFER_PF_BALANCE",
            target_route="/career",
            spoken_response_text=spoken_map.get(lang, spoken_map["en-IN"]),
            prefilled_form_data={
                "claim_type": "FORM_13_TRANSFER",
                "action": "AUTO_MERGE_MEMBER_IDS"
            },
            confidence_score=0.96
        )

    # 3. Savings / Passbook Intent (Passbook, Balance, Interest, Pension, Bachat, Khata, Labham)
    savings_keywords = [
        "passbook", "balance", "interest", "pension", "savings", "kitna",
        "bachat", "byaj", "vaddi", "vaddi entha", "iruppu", "amount",
        "पासबुक", "बैलेंस", "ब्याज", "पेंशन", "बचत", "ఖాతా", "పాస్ బుక్", "వడ్డీ", "சேமிப்பு", "வட்டி"
    ]
    if any(w in text or w in raw_text for w in savings_keywords):
        spoken_map = {
            "hi-IN": "आपकी कुल PF बचत और 8.25% ब्याज की स्थिति यहाँ देख सकते हैं।",
            "te-IN": "మీ మొత్తం PF బ్యాలెన్స్ మరియు 8.25% వార్షిక వడ్డీ వివరాలు ఇక్కడ ఉన్నాయి.",
            "ta-IN": "உங்கள் மொத்த சேமிப்பு மற்றும் 8.25% வட்டி விவரங்கள் திரையில் காட்டப்பட்டுள்ளன.",
            "en-IN": "Opening your Interactive Visual Passbook with triple-split and 8.25% compounding forecast."
        }
        return VoiceCommandResponse(
            recognized_intent="VIEW_PASSBOOK_GROWTH",
            target_route="/savings",
            spoken_response_text=spoken_map.get(lang, spoken_map["en-IN"]),
            prefilled_form_data={"action": "OPEN_PASSBOOK_VISUALIZER"},
            confidence_score=0.99
        )

    # 4. Fix Details Intent (Fix, Correction, Name, DOB, KYC, Bank, Aadhaar, Thappu, Sari cheyyandi, Nominee)
    fix_keywords = [
        "fix", "name", "dob", "correction", "bank", "kyc", "aadhaar", "nominee",
        "sudhar", "nam", "galat", "thappu", "sari", "maatra", "saripodhu",
        "नाम", "जन्म तिथि", "सुधार", "गलत", "आधार", "నామినీ", "సరిచేయండి", "పేరు", "திருத்தம்", "ஆதார்"
    ]
    if any(w in text or w in raw_text for w in fix_keywords):
        spoken_map = {
            "hi-IN": "नाम या बैंक विवरण ठीक करने के लिए डिजिटल 3-वे जॉइंट डिक्लेरेशन खोला गया है।",
            "te-IN": "మీ పేరు లేదా బ్యాంక్ వివరాలు సరిదిద్దడానికి డిజిటల్ జాయింట్ డిక్లరేషన్ సిద్ధం చేసాము.",
            "ta-IN": "பெயர் அல்லது வங்கி கணக்கு திருத்தத்திற்கு டிஜிட்டல் முறை தயாராக உள்ளது.",
            "en-IN": "Opening Fix Details Hub for instant Aadhaar fuzzy validation and 1-Click Penny Drop verification."
        }
        return VoiceCommandResponse(
            recognized_intent="FIX_MEMBER_DETAILS",
            target_route="/fix",
            spoken_response_text=spoken_map.get(lang, spoken_map["en-IN"]),
            prefilled_form_data={"action": "OPEN_DIGITAL_JOINT_DECLARATION"},
            confidence_score=0.97
        )

    # Default fallback to Money Hub
    return VoiceCommandResponse(
        recognized_intent="GENERAL_EPFO_ASSISTANCE",
        target_route="/money",
        spoken_response_text="How may I assist you with your Provident Fund today? You can say 'I need money', 'Transfer PF', 'Check Passbook', or 'Fix my details'.",
        prefilled_form_data={},
        confidence_score=0.90
    )
