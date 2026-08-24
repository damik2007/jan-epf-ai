import re

filepath = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Clean up unused imports from page.tsx
code = re.sub(r'import { BenchmarkComparison } from "@/components/BenchmarkComparison";\n', '', code)
code = re.sub(r'import { CitizenFeatureMatrix } from "@/components/CitizenFeatureMatrix";\n', '', code)
code = re.sub(r'import { AudienceSegmentReport } from "@/components/AudienceSegmentReport";\n', '', code)
code = re.sub(r'import { SreTelemetryPanel } from "@/components/SreTelemetryPanel";\n', '', code)
code = re.sub(r'import { SovereignDpiPillars } from "@/components/SovereignDpiPillars";\n', '', code)

# 2. Clean up unused state
code = re.sub(r'  const \[activeSectionTab, setActiveSectionTab\] = useState<[^>]+>\("benchmark"\);\n', '', code)
code = re.sub(r'  const \[showArchitectureMatrix, setShowArchitectureMatrix\] = useState\(false\);\n', '', code)

# 3. Replace collapsible matrix with the luxury gateway card
gateway_card = """      {/* 4. SOVEREIGN 80/20 BENCHMARK & PROOF ASSET GATEWAY */}
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
      </div>"""

code = re.sub(r'{\/\* 4\. COLLAPSIBLE ARCHITECTURAL INTELLIGENCE & BENCHMARK MATRIX \*\/}[\s\S]*?<\/div>\s*<\/div>\s*\)\s*;\s*\}', gateway_card + "\n\n      {/* Chaos Simulator Sandbox Modal */}\n      <ChaosSimulatorModal\n        isOpen={chaosSimulatorOpen}\n        onClose={() => setChaosSimulatorOpen(false)}\n      />\n    </div>\n  );\n}", code)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("page.tsx updated with clean Sovereign Benchmark Gateway Card!")
