import re
import os

typo_map = {
    r'\baccrose\b': 'across',
    r'\bcomfertable\b': 'comfortable',
    r'\bunconsistencys\b': 'inconsistencies',
    r'\bligth\b': 'light',
    r'\bsenir\b': 'senior',
    r'\bcloude\b': 'cloud',
    r'\bbeachmarks\b': 'benchmarks',
    r'\breceits\b': 'receipts',
    r'\btransactons\b': 'transactions',
    r'\bstatutary\b': 'statutory',
    r'\bspecking\b': 'speaking',
    r'\bfluently\b': 'fluently',
    r'\bprivouc\b': 'previous',
    r'\bprivoce\b': 'previous',
    r'\bthe the\b': 'the',
    r'\bis is\b': 'is',
    r'\bin in\b': 'in',
    r'\bto to\b': 'to'
}

found = []
for root, dirs, files in os.walk("/Users/damikreddy/Desktop/Hackaton/frontend/src"):
    for file in files:
        if file.endswith((".tsx", ".ts", ".jsx", ".js")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            for pattern, fix in typo_map.items():
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for m in matches:
                    found.append((path, m.group(0), fix, content[max(0, m.start()-30):min(len(content), m.end()+30)]))

print(f"Total typos detected across frontend: {len(found)}")
for p, bad, fix, ctx in found:
    print(f"File: {p}\n  Typo: '{bad}' -> Suggestion: '{fix}'\n  Context: {ctx}\n")

