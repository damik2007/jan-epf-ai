import re

# 1. Update frontend/src/app/page.tsx
page_path = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx"
with open(page_path, "r", encoding="utf-8") as f:
    page_code = f.read()

if 'import { BenchmarkComparison }' not in page_code:
    page_code = page_code.replace(
        'import { ClaimReadinessScore } from "@/components/ClaimReadinessScore";',
        'import { ClaimReadinessScore } from "@/components/ClaimReadinessScore";\nimport { BenchmarkComparison } from "@/components/BenchmarkComparison";'
    )

if '<BenchmarkComparison />' not in page_code:
    page_code = page_code.replace(
        '{/* 4. SOVEREIGN 80/20 BENCHMARK & PROOF ASSET GATEWAY */}',
        '{/* Live In-Situ Benchmark Comparison */}\n      <BenchmarkComparison />\n\n      {/* 4. SOVEREIGN 80/20 BENCHMARK & PROOF ASSET GATEWAY */}'
    )

with open(page_path, "w", encoding="utf-8") as f:
    f.write(page_code)
print("Updated page.tsx with BenchmarkComparison!")

# 2. Update frontend/src/app/benchmarks/page.tsx to have all 9 subsystems as neat tabs
bench_path = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx"
with open(bench_path, "r", encoding="utf-8") as f:
    bench_code = f.read()

# Add AudienceSegmentReport import if missing
if 'import { AudienceSegmentReport }' not in bench_code:
    bench_code = bench_code.replace(
        'import { CitizenFeatureMatrix } from "@/components/CitizenFeatureMatrix";',
        'import { CitizenFeatureMatrix } from "@/components/CitizenFeatureMatrix";\nimport { AudienceSegmentReport } from "@/components/AudienceSegmentReport";'
    )

# Update activeTab state type
bench_code = re.sub(
    r'const \[activeTab, setActiveTab\] = useState<[^>]+>\("evals"\);',
    'const [activeTab, setActiveTab] = useState<"evals" | "latency" | "traces" | "economics" | "security" | "personas" | "feature_matrix" | "sre_telemetry" | "dpi_pillars">("evals");',
    bench_code
)

# Replace the tabs list
old_tabs_pattern = r'const navTabs: Array<\{ id: [^;]+;[\s\S]*?\}\] = \['
new_tabs_def = """  const navTabs: Array<{
    id: "evals" | "latency" | "traces" | "economics" | "security" | "personas" | "feature_matrix" | "sre_telemetry" | "dpi_pillars";
    label: string;
    icon: any;
    badge?: string;
  }> = [
    { id: "evals", label: t.tab3WayEvals || "🧪 3-Way Evals Matrix", icon: Layers, badge: "Statutory SLA" },
    { id: "latency", label: t.tab1000RunLatency || "⚡ 1,000-Run Latency Runner", icon: Play, badge: "<0.05ms" },
    { id: "personas", label: "👥 Demographic Personas", icon: Sparkles, badge: "4 Cohorts" },
    { id: "feature_matrix", label: "🏛️ Statutory Feature Matrix", icon: Server, badge: "18 Forms" },
    { id: "traces", label: t.tabRawTraces || "📜 Raw Trace & Token Receipts", icon: Terminal, badge: "76.4% Saved" },
    { id: "economics", label: t.tabExchequerRoi || "💰 National Exchequer ROI", icon: TrendingDown, badge: "$0 Cloud Bill" },
    { id: "sre_telemetry", label: "⚡ SRE Telemetry & Circuit Breakers", icon: Activity, badge: "Zero Fallback" },
    { id: "dpi_pillars", label: "🇮🇳 Sovereign DPI Pillars", icon: ShieldCheck, badge: "DPDP 2023" },
    { id: "security", label: t.tabSecurityAudit || "🛡️ Security & DPDP Audit", icon: ShieldCheck, badge: "Grade S+" }
  ];"""

bench_code = re.sub(r'const navTabs: Array<\{[\s\S]*?\}\] = \[[\s\S]*?\];', new_tabs_def, bench_code)

# Remove the unconditionally rendered components at the bottom if present
bench_code = bench_code.replace(
    """          {/* Live SRE Subsystems & DPI Architecture */}
          <SreTelemetryPanel />
          <SovereignDpiPillars />
          <CitizenFeatureMatrix />""",
    ""
)

# Add conditional rendering blocks for the 4 extra tabs
tab_blocks = """
      {/* TAB 6: DEMOGRAPHIC PERSONAS */}
      {activeTab === "personas" && (
        <div className="animate-in fade-in duration-200">
          <AudienceSegmentReport />
        </div>
      )}

      {/* TAB 7: STATUTORY FEATURE MATRIX */}
      {activeTab === "feature_matrix" && (
        <div className="animate-in fade-in duration-200">
          <CitizenFeatureMatrix />
        </div>
      )}

      {/* TAB 8: SRE TELEMETRY & CIRCUIT BREAKERS */}
      {activeTab === "sre_telemetry" && (
        <div className="animate-in fade-in duration-200">
          <SreTelemetryPanel />
        </div>
      )}

      {/* TAB 9: SOVEREIGN DPI PILLARS */}
      {activeTab === "dpi_pillars" && (
        <div className="animate-in fade-in duration-200">
          <SovereignDpiPillars />
        </div>
      )}
"""

if '{/* TAB 6: DEMOGRAPHIC PERSONAS */}' not in bench_code:
    bench_code = bench_code.replace(
        '{/* Formal Statutory & Legal Disclaimers Card */}',
        tab_blocks + '\n      {/* Formal Statutory & Legal Disclaimers Card */}'
    )

with open(bench_path, "w", encoding="utf-8") as f:
    f.write(bench_code)

print("Updated benchmarks/page.tsx with all 9 neat subsystem tabs!")
