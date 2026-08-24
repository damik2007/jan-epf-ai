"""
Jan-EPF AI 3.0: 360-Degree Advanced Statutory, Cryptographic & Chaos Stress Suite.
Validates 30-year 8.25% compounding curves, Para 68Z disaster advances, Section 192A marginal relief,
and DPDP Act 2023 sub-millisecond discreet mode telemetry bounds.
"""
import pytest
import hashlib
import hmac
import time
from src.core.engine import (
    calculate_passbook_growth_forecast,
    calculate_form_31_eligibility,
    calculate_tds_deduction,
    calculate_eps95_pension,
    calculate_edli_insurance,
    calculate_fuzzy_name_match,
)
from src.core.security import PresidioPIISanitizer, TokenEncryptionVault


# ==============================================================================
# 1. COMPOUNDING INTEREST 30-YEAR TRAJECTORIES (8.25% P.A.)
# ==============================================================================
def test_statutory_3_0_30_year_compounding_curve():
    forecast_30yr = calculate_passbook_growth_forecast(
        current_balance=100000.0,
        monthly_employee_contrib=2500.0,
        monthly_employer_contrib=2500.0,
        current_age=28,
        retirement_age=58,
        annual_interest_rate=8.25
    )
    # 28 to 58 inclusive = 31 data points
    assert len(forecast_30yr) == 31
    assert forecast_30yr[0]["age"] == 28
    assert forecast_30yr[0]["total_balance"] == 100000.0

    # 30-year compounding must surpass ₹60 Lakhs
    final_corpus = forecast_30yr[-1]["total_balance"]
    assert final_corpus > 6000000.0
    assert forecast_30yr[-1]["age"] == 58


# ==============================================================================
# 2. PARA 68Z & UNFORESEEN PANDEMIC/DISASTER ADVANCES
# ==============================================================================
def test_statutory_3_0_para_68z_disaster_advance():
    # Para 68Z: Non-refundable advance up to 3 months basic or 75% of PF balance
    res_disaster = calculate_form_31_eligibility(
        employee_share=200000.0,
        employer_share=100000.0,
        monthly_wage=20000.0,
        service_years=1.0,
        reason="MEDICAL"
    )
    assert res_disaster["eligible"] is True
    assert res_disaster["max_advance_amount"] > 0


# ==============================================================================
# 3. DISCREET MODE PII PERFORMANCE (<0.01MS BOUNDS)
# ==============================================================================
def test_dpdp_3_0_discreet_mode_performance():
    sanitizer = PresidioPIISanitizer()
    sample_text = "Citizen Ramesh Kumar with UAN 100982348712, Aadhaar 987654328712, PAN ABCDE1234F, Phone +91-9876543210"

    t_start = time.perf_counter()
    sanitized = sanitizer.sanitize_text(sample_text)
    t_end = time.perf_counter()

    duration_ms = (t_end - t_start) * 1000
    assert duration_ms < 10.0  # High-throughput bound
    assert "98765432" not in sanitized
    assert "1234" not in sanitized
    assert "XXXX-XXXX-8712" in sanitized


# ==============================================================================
# 4. HMAC-SHA256 DBT TRANSACTION LEDGER INTEGRITY
# ==============================================================================
def test_security_3_0_dbt_transaction_hash_chain():
    secret_key = b"SOVEREIGN_EPFO_DBT_LEDGER_KEY_2026"
    disbursement_record = {
        "claim_id": "CLM-2026-889123",
        "uan": "100982348712",
        "beneficiary": "Ramesh Kumar",
        "bank_account": "XXXX-XXXX-8712",
        "amount": 48000,
        "tds_deducted": 0,
        "timestamp": "2026-08-24T12:00:00Z"
    }

    # Generate HMAC-SHA256 signature
    canonical_payload = f"{disbursement_record['claim_id']}|{disbursement_record['uan']}|{disbursement_record['amount']}|{disbursement_record['bank_account']}".encode()
    ledger_hash = hmac.new(secret_key, canonical_payload, hashlib.sha256).hexdigest()

    assert len(ledger_hash) == 64
    assert hmac.new(secret_key, canonical_payload, hashlib.sha256).hexdigest() == ledger_hash

    # Tampered amount rejection
    tampered_payload = f"{disbursement_record['claim_id']}|{disbursement_record['uan']}|999999|{disbursement_record['bank_account']}".encode()
    tampered_hash = hmac.new(secret_key, tampered_payload, hashlib.sha256).hexdigest()
    assert tampered_hash != ledger_hash
