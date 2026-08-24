import re
import os

replacements = {
    r'&amp;': '&',
    r'&quot;': '"',
}

files_to_clean = [
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/fix/page.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/components/ChaosSimulatorModal.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/components/EvaluatorGate.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/components/GrievanceLegalLetterModal.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/components/LiveSreNetworkPulse.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/components/PresidioPlayground.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/components/SettlementReceiptModal.tsx",
    "/Users/damikreddy/Desktop/Hackaton/frontend/src/components/SreTelemetryPanel.tsx",
]

for file_path in files_to_clean:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        for k, v in replacements.items():
            content = re.sub(k, v, content)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Cleaned entities in {file_path}")

