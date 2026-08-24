import re

filepath = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update imports
import_block = """import { useCitizen } from "@/context/CitizenContext";
import { getTranslation } from "@/lib/translations";
import { Breadcrumb } from "@/components/Breadcrumb";
import { runBenchmarkSuite, BenchmarkSuiteResult } from "@/lib/benchmarkRunner";
import { SreTelemetryPanel } from "@/components/SreTelemetryPanel";
import { SovereignDpiPillars } from "@/components/SovereignDpiPillars";
import { CitizenFeatureMatrix } from "@/components/CitizenFeatureMatrix";
"""

code = re.sub(r'import { Breadcrumb } from "@/components/Breadcrumb";[\s\S]*?import {', import_block + "import {", code)

# 2. Update benchmark runner execution function
old_runner = """  // Live in-browser 1,000-iteration execution runner
  const runInBrowserBenchmarks = () => {
    setIsRunningBench(true);
    setBenchResults(null);

    setTimeout(() => {
      const results: BenchmarkResult[] = [];
      const N = iterationsCount;

      // 1. Levenshtein Fuzzy Match"""

new_runner = """  // Live in-browser execution runner using shared deterministic benchmark engine
  const runInBrowserBenchmarks = () => {
    setIsRunningBench(true);
    setBenchResults(null);

    setTimeout(() => {
      const results = runBenchmarkSuite(iterationsCount);
      setBenchResults(results as any);
      setIsRunningBench(false);
    }, 250);
  };
"""

# Replace from runInBrowserBenchmarks down to setBenchResults
code = re.sub(r'const runInBrowserBenchmarks = \(\) => \{[\s\S]*?setIsRunningBench\(false\);\s*\}, 250\);\s*\};', new_runner.strip(), code)

# 3. Add SreTelemetryPanel & SovereignDpiPillars to Tab 5
tab5_extra = """
          {/* Live SRE Subsystems & DPI Architecture */}
          <SreTelemetryPanel />
          <SovereignDpiPillars />
          <CitizenFeatureMatrix />
"""

code = code.replace('{/* Formal Statutory & Legal Disclaimers Card */}', tab5_extra + '\n      {/* Formal Statutory & Legal Disclaimers Card */}')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("benchmarks/page.tsx updated with unified runner and SRE panels!")
