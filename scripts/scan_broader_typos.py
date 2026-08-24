import re
import os

patterns = [
    r'\brecieved\b', r'\bseperated\b', r'\boccured\b', r'\buntill\b',
    r'\bdefinately\b', r'\bguarentee\b', r'\btransfter\b', r'\bcalulated\b',
    r'\beligiblity\b', r'\bnomiation\b', r'\bestablishmnet\b', r'\bpassbok\b',
    r'\bgrivance\b', r'\bidentitiy\b', r'\bcomplaince\b', r'\barchitecure\b'
]

found = []
for root, dirs, files in os.walk("/Users/damikreddy/Desktop/Hackaton/frontend/src"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            for pat in patterns:
                matches = re.finditer(pat, content, re.IGNORECASE)
                for m in matches:
                    found.append((path, m.group(0)))

print(f"Broader typo hits: {len(found)}")
for p, bad in found:
    print(f"File: {p}, Found: {bad}")
