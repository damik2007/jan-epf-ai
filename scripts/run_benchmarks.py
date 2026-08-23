"""
Automated 80/20 Sovereign Engine Latency Benchmark Suite
Measures sub-5ms deterministic computations, fuzzy matching, and zero-trust PII sanitization.
"""

import time
import statistics
import sys
import os
from datetime import date

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.core.engine import (
    calculate_form_31_eligibility,
    calculate_fuzzy_name_match,
    deduce_missing_date_of_exit,
    calculate_tds_deduction,
    calculate_passbook_growth_forecast,
    lookup_and_resolve_ifsc,
    prune_context_with_tiktoken,
    evaluate_cheque_clip_semantics,
)
from src.core.security import PresidioPIISanitizer, TokenEncryptionVault

def run_benchmarks():
    iterations = 1000
    results = {}

    # 1. Fuzzy Name Matching (Levenshtein)
    times = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        score = calculate_fuzzy_name_match("Ramesh Kumar", "RAMESH KUMAR SHARMA")
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["fuzzy_name_match"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 5.0,
        "status": "PASS" if statistics.mean(times) < 5.0 else "FAIL"
    }

    # 2. Form 31 Eligibility Calculation (Para 68J, 68B, 68K)
    times = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        elig = calculate_form_31_eligibility(
            employee_share=210000.0,
            employer_share=140000.0,
            monthly_wage=25000.0,
            service_years=6.5,
            reason="Para 68J (Medical)"
        )
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["form31_eligibility_math"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 2.0,
        "status": "PASS" if statistics.mean(times) < 2.0 else "FAIL"
    }

    # 3. TDS Deduction Calculator (Section 192A)
    times = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        tds = calculate_tds_deduction(
            service_years=3.5,
            withdrawal_amount=120000.0,
            pan_linked=True,
            form_15g_submitted=True
        )
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["tds_deduction_math"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 2.0,
        "status": "PASS" if statistics.mean(times) < 2.0 else "FAIL"
    }

    # 4. ECR Exit Date Deduction (Statutory Rule)
    times = []
    sample_date = date(2023, 8, 1)
    for _ in range(iterations):
        t0 = time.perf_counter()
        exit_date = deduce_missing_date_of_exit(sample_date)
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["ecr_exit_date_deduction"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 2.0,
        "status": "PASS" if statistics.mean(times) < 2.0 else "FAIL"
    }

    # 5. 8.25% Passbook Compounding Forecaster (30 years simulation)
    times = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        curve = calculate_passbook_growth_forecast(
            current_balance=250000.0,
            monthly_employee_contrib=2500.0,
            monthly_employer_contrib=2500.0,
            current_age=30,
            retirement_age=58,
            annual_interest_rate=8.25
        )
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["compounding_forecaster_30yr"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 2.0,
        "status": "PASS" if statistics.mean(times) < 2.0 else "FAIL"
    }

    # 6. IFSC Bank Merger Resolution
    times = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        ifsc_res = lookup_and_resolve_ifsc("ANDB0001234")
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["ifsc_bank_merger_lookup"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 2.0,
        "status": "PASS" if statistics.mean(times) < 2.0 else "FAIL"
    }

    # 7. Presidio Zero-Trust PII Masker
    times = []
    sample_text = "Citizen Ramesh Kumar with Aadhaar 9876 5432 1098 and PAN ABCDE1234F called phone +91 98765 43210 regarding EPFO claim."
    for _ in range(iterations):
        t0 = time.perf_counter()
        masked = PresidioPIISanitizer.sanitize_text(sample_text)
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["presidio_pii_masking"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 5.0,
        "status": "PASS" if statistics.mean(times) < 5.0 else "FAIL"
    }

    # 8. Token AES-GCM-256 Encryption & Decryption
    times = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        enc = TokenEncryptionVault.encrypt_token("100982348712")
        dec = TokenEncryptionVault.decrypt_token(enc)
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["token_encryption_cycle"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 2.0,
        "status": "PASS" if statistics.mean(times) < 2.0 else "FAIL"
    }

    # 9. OpenAI tiktoken BPE Context Pruning & Budgeting
    # Warm up encoder once before loop
    _ = prune_context_with_tiktoken("warmup", max_tokens=10)
    times = []
    sample_grievance = "Citizen reports issue with PF advance claim under Para 68J. Hospital bills attached for ₹1,50,000." * 10
    for _ in range(iterations):
        t0 = time.perf_counter()
        pruned, count = prune_context_with_tiktoken(sample_grievance, max_tokens=64)
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["tiktoken_context_pruning"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 1.0,
        "status": "PASS" if statistics.mean(times) < 1.0 else "FAIL"
    }

    # 10. OpenAI CLIP Zero-Shot Cheque Semantic Verification
    times = []
    for _ in range(iterations):
        t0 = time.perf_counter()
        clip_res = evaluate_cheque_clip_semantics(
            sharpness_score=90.0,
            contrast_score=80.0,
            extracted_ifsc="SBIN0001234",
            name_fuzzy_score=92.0,
            has_signature_box=True
        )
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)
    results["clip_cheque_semantics"] = {
        "mean_ms": statistics.mean(times),
        "p50_ms": statistics.median(times),
        "p99_ms": sorted(times)[int(0.99 * iterations)],
        "target_ms": 1.0,
        "status": "PASS" if statistics.mean(times) < 1.0 else "FAIL"
    }

    print("=" * 88)
    print("JAN-EPF AI DETERMINISTIC ENGINE BENCHMARK RESULTS (1000 iterations)")
    print("=" * 88)
    print(f"{'Benchmark Target':<32} | {'Mean (ms)':<10} | {'P50 (ms)':<10} | {'P99 (ms)':<10} | {'Target':<10} | {'Status'}")
    print("-" * 88)
    for name, data in results.items():
        print(f"{name:<32} | {data['mean_ms']:<10.4f} | {data['p50_ms']:<10.4f} | {data['p99_ms']:<10.4f} | < {data['target_ms']}ms   | {data['status']}")
    print("=" * 88)
    return results

if __name__ == "__main__":
    run_benchmarks()
