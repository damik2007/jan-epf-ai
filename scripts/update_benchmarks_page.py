import re

filepath_tsx = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx"
with open(filepath_tsx, "r", encoding="utf-8") as f:
    content_tsx = f.read()

# 1. Add imports if missing
if 'import { useCitizen } from "@/context/CitizenContext";' not in content_tsx:
    content_tsx = content_tsx.replace(
        'import Link from "next/link";',
        'import Link from "next/link";\nimport { useCitizen } from "@/context/CitizenContext";\nimport { getTranslation } from "@/lib/translations";'
    )

# 2. Add language hook in component
if 'const { language } = useCitizen();' not in content_tsx:
    content_tsx = re.sub(
        r'(export default function BenchmarksPage\(\) \{\n)',
        r'\1  const { language } = useCitizen();\n  const t = getTranslation(language);\n',
        content_tsx
    )

# 3. Replace static texts with translated variables
replacements = [
    (r'currentPage="Evals & Proof Benchmarks"', r'currentPage={t.benchmarksTitle || "Evals & Proof Benchmarks"}'),
    (r'>\s*Evals, Evidence & Benchmarks\s*</h1>', r'>{t.benchmarksTitle || "Evals, Evidence & Benchmarks"}</h1>'),
    (r'>\s*Transparent, quantitative, and reproducible proof assets evaluating our 80/20 Sovereign Core[^\<]*</p>', r'>{t.benchmarksSubtitle}</p>'),
    (r'>Form 31 Math Latency</span>', r'>{t.mathLatencyLabel || "Form 31 Math Latency"}</span>'),
    (r'>PyTest Compliance Suite</span>', r'>{t.complianceSuiteLabel || "PyTest Compliance Suite"}</span>'),
    (r'>Tiktoken Context Pruning</span>', r'>{t.tokenContextSavedLabel || "Tiktoken Context Pruning"}</span>'),
    (r'>National Cloud Bill</span>', r'>{t.cloudBillLabel || "National Cloud Bill"}</span>'),
    (r'label:\s*"🧪 3-Way Evals Matrix"', r'label: t.tab3WayEvals || "🧪 3-Way Evals Matrix"'),
    (r'label:\s*"⚡ 1,000-Run Latency Benchmark"', r'label: t.tab1000RunLatency || "⚡ 1,000-Run Latency Benchmark"'),
    (r'label:\s*"📜 Raw Trace & Token Receipts"', r'label: t.tabRawTraces || "📜 Raw Trace & Token Receipts"'),
    (r'label:\s*"💰 National Exchequer ROI"', r'label: t.tabExchequerRoi || "💰 National Exchequer ROI"'),
    (r'label:\s*"🛡️ Security & SRE Audit"', r'label: t.tabSecurityAudit || "🛡️ Security & SRE Audit"'),
    (r'>\s*Statutory, Legal & Algorithmic Compliance Certification\s*</span>', r'>{t.statutoryComplianceTitle || "Statutory, Legal & Algorithmic Compliance Certification"}</span>'),
    (r'>\s*DPDP ACT 2023 COMPLIANT\s*</span>', r'>{t.dpdpComplianceText || "DPDP ACT 2023 COMPLIANT"}</span>'),
    (r'>\s*PUBLIC DOMAIN STATUTORY RULES\s*</span>', r'>{t.statutoryPublicLawText || "PUBLIC DOMAIN STATUTORY RULES"}</span>')
]

for old, new in replacements:
    content_tsx = re.sub(old, new, content_tsx)

with open(filepath_tsx, "w", encoding="utf-8") as f:
    f.write(content_tsx)

print("benchmarks/page.tsx localized successfully!")
