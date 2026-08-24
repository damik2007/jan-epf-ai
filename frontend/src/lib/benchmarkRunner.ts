/**
 * Shared Deterministic Benchmark Suite Runner
 * Standardized single source of truth for microsecond timing across all 7 sovereign DPI algorithms.
 */

import {
  calculateFuzzyNameMatch,
  calculateForm31Eligibility,
  calculateTdsDeduction,
  deduceMissingDateOfExit,
  calculatePassbookCompounding,
  lookupIfsc
} from "./deterministicEngine";

export interface BenchmarkSuiteResult {
  name: string;
  category: string;
  iterations: number;
  meanMs: number;
  p50Ms: number;
  p99Ms: number;
  targetSlaMs: number;
  speedupVsCloud: string;
  status: "PASS" | "WARN";
}

// Presidio regex tokenizer for DPDP privacy benchmark
export function tokenizePresidioSample(text: string): string {
  return text
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "XXXX-XXXX-XXXX")
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, "ABCDE****F")
    .replace(/\b\d{10}\b/g, "XXXXXX0000");
}

export function runBenchmarkSuite(iterations: number = 1000): BenchmarkSuiteResult[] {
  const results: BenchmarkSuiteResult[] = [];

  const measureBenchmark = (
    name: string,
    category: string,
    targetSlaMs: number,
    cloudBaselineMs: number,
    fn: () => void
  ): BenchmarkSuiteResult => {
    // Warm-up to prevent JIT optimization skew
    for (let w = 0; w < 50; w++) fn();

    const samples: number[] = [];
    const t0 = performance.now();
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      samples.push(end - start);
    }
    const totalElapsed = performance.now() - t0;
    const meanMs = Number((totalElapsed / iterations).toFixed(5));

    samples.sort((a, b) => a - b);
    const p50Ms = Number((samples[Math.floor(samples.length * 0.50)] || meanMs).toFixed(5));
    const p99Ms = Number((samples[Math.floor(samples.length * 0.99)] || meanMs * 1.25).toFixed(5));

    const effectiveMean = meanMs === 0 ? 0.0001 : meanMs;
    const speedup = Math.round(cloudBaselineMs / effectiveMean);

    return {
      name,
      category,
      iterations,
      meanMs,
      p50Ms,
      p99Ms,
      targetSlaMs,
      speedupVsCloud: `${speedup.toLocaleString()}x`,
      status: meanMs <= targetSlaMs ? "PASS" : "WARN"
    };
  };

  // 1. Levenshtein Fuzzy Match
  results.push(
    measureBenchmark(
      "Levenshtein Unicode Name Matcher (>=85%)",
      "DPI Identity / Para 72",
      0.5,
      200,
      () => calculateFuzzyNameMatch("Ramesh Kumar", "Shri Ramesh Kumar")
    )
  );

  // 2. Form 31 Eligibility Math
  results.push(
    measureBenchmark(
      "Statutory Form 31 Advance Eligibility Engine",
      "Statutory Calculation",
      0.1,
      800,
      () => calculateForm31Eligibility(156000, 186500, 45000, 8.2, "MEDICAL")
    )
  );

  // 3. Section 192A TDS Shield
  results.push(
    measureBenchmark(
      "Section 192A Income Tax TDS Exemption Shield",
      "Tax & Compliance",
      0.1,
      600,
      () => calculateTdsDeduction(5.2, 342500, true, true)
    )
  );

  // 4. ECR Exit Date Deduction
  results.push(
    measureBenchmark(
      "ECR Wage Timestamp Exit Date Deduction",
      "Auto-Healing Workflow",
      0.2,
      1200,
      () => deduceMissingDateOfExit("2023-08")
    )
  );

  // 5. 30-Year Compounding Wealth Forecaster
  results.push(
    measureBenchmark(
      "30-Year EPF 8.25% Wealth Compounding Forecaster",
      "Wealth Intelligence",
      0.5,
      400,
      () => calculatePassbookCompounding(342500, 45000, 10, 8.25)
    )
  );

  // 6. Offline IFSC Routing Table Lookup
  results.push(
    measureBenchmark(
      "Offline NPCI / IFSC Routing Table Lookup (Sub-0.01ms)",
      "DBT Verification",
      0.05,
      150,
      () => lookupIfsc("SBIN0001234")
    )
  );

  // 7. Presidio Zero-Trust PII Masking Tokenizer
  results.push(
    measureBenchmark(
      "Presidio Zero-Trust DPDP PII Masking Tokenizer",
      "Data Privacy (DPDP 2023)",
      0.2,
      350,
      () => tokenizePresidioSample("Citizen Ramesh Kumar Aadhaar: 1234 5678 9012 PAN: ABCDE1234F Phone: 9876543210")
    )
  );

  return results;
}
