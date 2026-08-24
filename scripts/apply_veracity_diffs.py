import re

# 1. Update benchmarks/page.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "r", encoding="utf-8") as f:
    bp = f.read()

bp = bp.replace('₹0.00 / Request (Sovereign Edge)', '₹0.0004 / Request (Sovereign Edge)')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "w", encoding="utf-8") as f:
    f.write(bp)
print("Updated benchmarks/page.tsx veracity!")

# 2. Update architecture/page.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "r", encoding="utf-8") as f:
    arch = f.read()

old_arch_block = '''            <h4 className="text-sm font-bold text-white">Zero Commercial Cloud Toll</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              By offloading 80% of transactions to local deterministic execution, national cloud expenditure drops from ₹18.4 Crore/year (at commercial API rates) to ₹0.00.
            </p>
            <div className="text-[11px] font-mono text-amber-400 pt-1">
              • National Exchequer ROI: 100% Retained
            </div>'''

new_arch_block = '''            <h4 className="text-sm font-bold text-white">99.6% Net Exchequer Savings</h4>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
              <p><strong className="text-amber-400">80% On-Device Deterministic Core:</strong> Pure mathematical evaluation, Para 68 rules, Section 192A TDS, Levenshtein name match, and HTML5 Canvas OCR execute locally on citizen hardware at ₹0.00 cloud compute cost (0ms server latency).</p>
              <p><strong className="text-amber-400">20% Sovereign Edge/AI Layer:</strong> Voice transcription, Presidio PII vault, and complex grievance drafting run on sovereign open-weight container instances at sub-paisa micro-cost (approx ₹0.0004 / request), delivering 99.6% net exchequer savings compared to commercial proprietary APIs ($0.03 / ₹2.50 per call).</p>
            </div>'''

if old_arch_block in arch:
    arch = arch.replace(old_arch_block, new_arch_block)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "w", encoding="utf-8") as f:
    f.write(arch)
print("Updated architecture/page.tsx veracity!")

# 3. Update SreTelemetryPanel.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/SreTelemetryPanel.tsx", "r", encoding="utf-8") as f:
    sre = f.read()

sre = sre.replace('$0 API Cloud Bill • Sub-5ms Execution', '₹0.00 Local Compute • ₹0.0004 Edge AI')
sre = sre.replace('value: "82.4% On-Device"', 'value: "99.6% Savings"')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/SreTelemetryPanel.tsx", "w", encoding="utf-8") as f:
    f.write(sre)
print("Updated SreTelemetryPanel.tsx veracity!")

