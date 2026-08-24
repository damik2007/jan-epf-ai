import re

filepath = "/Users/damikreddy/Desktop/Hackaton/frontend/src/lib/translations.ts"
with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add to interface
code = code.replace("navFix: string;", "navFix: string;\n  navArchitecture: string;")

# 2. Add to all 13 languages
translations_map = {
    "en-IN": 'navArchitecture: "Architecture & Research",',
    "hi-IN": 'navArchitecture: "आर्किटेक्चर व रिसर्च",',
    "te-IN": 'navArchitecture: "ఆర్కిటెక్చర్ & రీసెర్చ్",',
    "ta-IN": 'navArchitecture: "கட்டமைப்பு & ஆராய்ச்சி",',
    "kn-IN": 'navArchitecture: "ವಿನ್ಯಾಸ & ಸಂಶೋಧನೆ",',
    "ml-IN": 'navArchitecture: "ആർക്കിടെക്ചർ & ഗവേഷണം",',
    "mr-IN": 'navArchitecture: "आर्किटेक्चर आणि संशोधन",',
    "bn-IN": 'navArchitecture: "আর্কিটেকচার ও গবেষণা",',
    "gu-IN": 'navArchitecture: "આર્કિટેક્ચર અને સંશોધન",',
    "pa-IN": 'navArchitecture: "ਆਰਕੀਟੈਕਚਰ ਅਤੇ ਖੋਜ",',
    "or-IN": 'navArchitecture: "ସ୍ଥାପତ୍ୟ ଏବଂ ଗବେଷଣା",',
    "as-IN": 'navArchitecture: "আৰ্কিটেকচাৰ আৰু গৱেষণা",',
    "ur-IN": 'navArchitecture: "طرز تعمیر اور تحقیق",'
}

for lang, nav_str in translations_map.items():
    # Insert after navFix in each lang block
    pattern = rf'("{lang}":\s*\{{[\s\S]*?navFix:\s*"[^"]*",)'
    replacement = rf'\1\n    {nav_str}'
    code = re.sub(pattern, replacement, code, count=1)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("translations.ts updated with navArchitecture for all 13 languages!")
