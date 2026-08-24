"""
Jan-EPF AI 2.0: 360-Degree Comprehensive Verification Suite.
Validates all statutory edge cases, 4 persona end-to-end lifecycles, Presidio Zero-Trust PII masking,
AES-256-GCM cryptography, Section 192A TDS, EPS-95, EDLI, and SRE Chaos resilience.
"""
import pytest
from src.core.engine import (
    calculate_form_31_eligibility,
    calculate_tds_deduction,
    calculate_eps95_pension,
    calculate_edli_insurance,
    calculate_fuzzy_name_match,
    clean_name_for_comparison,
    deduce_missing_date_of_exit,
    calculate_passbook_growth_forecast,
    triage_grievance_root_cause,
)
from src.core.security import PresidioPIISanitizer, TokenEncryptionVault
from src.core.resilience import ComponentResilienceOrchestrator, SubsystemType
from src.core.data_store import MockCitizenDataStore


# ==============================================================================
# 1. STATUTORY 2.0 ADVANCE CLAIMS & EDGE CASES (Para 68J, 68B, 68K)
# ==============================================================================
def test_statutory_2_0_para_68j_medical_advance():
    # Para 68J: No service requirement, lower of 6-month wage or employee share balance
    res_eligible = calculate_form_31_eligibility(
        employee_share=48000.0,
        employer_share=25000.0,
        monthly_wage=15000.0,
        service_years=0.5,
        reason="MEDICAL"
    )
    assert res_eligible["eligible"] is True
    # 6 * 15000 = 90000; min(90000, 48000) = 48000 max eligible
    assert res_eligible["max_advance_amount"] == 48000.0
    assert "68J" in res_eligible["para_clause"]


def test_statutory_2_0_para_68b_housing_advance():
    # Para 68B: 5+ years service requirement, up to 36x wages
    # Scenario A: Rejection due to < 5 years service
    res_ineligible = calculate_form_31_eligibility(
        employee_share=150000.0,
        employer_share=80000.0,
        monthly_wage=25000.0,
        service_years=4.8,  # < 5 years
        reason="HOUSING"
    )
    assert res_ineligible["eligible"] is False
    assert res_ineligible["minimum_service_required_years"] == 5.0

    # Scenario B: Eligible with >= 5 years service
    res_eligible = calculate_form_31_eligibility(
        employee_share=150000.0,
        employer_share=80000.0,
        monthly_wage=25000.0,
        service_years=5.2,
        reason="HOUSING"
    )
    assert res_eligible["eligible"] is True
    assert res_eligible["max_advance_amount"] == 230000.0


def test_statutory_2_0_para_68k_marriage_education_advance():
    # Para 68K: 7+ years service requirement, up to 50% employee share
    # Scenario A: Rejection due to < 7 years
    res_ineligible = calculate_form_31_eligibility(
        employee_share=200000.0,
        employer_share=100000.0,
        monthly_wage=30000.0,
        service_years=6.5,
        reason="MARRIAGE"
    )
    assert res_ineligible["eligible"] is False
    assert res_ineligible["minimum_service_required_years"] == 7.0

    # Scenario B: Eligible with >= 7 years
    res_eligible = calculate_form_31_eligibility(
        employee_share=200000.0,
        employer_share=100000.0,
        monthly_wage=30000.0,
        service_years=7.5,
        reason="MARRIAGE"
    )
    assert res_eligible["eligible"] is True
    assert res_eligible["max_advance_amount"] == 100000.0  # 50% of 200,000


# ==============================================================================
# 2. SECTION 192A INCOME TAX TDS MATRIX
# ==============================================================================
def test_statutory_2_0_section_192a_tds_exemptions():
    # Case 1: Continuous service >= 5 years -> 0% TDS
    tds_1 = calculate_tds_deduction(
        service_years=5.5,
        withdrawal_amount=300000.0,
        pan_linked=True,
        form_15g_submitted=False
    )
    assert tds_1["tds_applicable"] is False
    assert tds_1["tds_rate_percent"] == 0.0
    assert tds_1["net_disbursement"] == 300000.0

    # Case 2: Service < 5 years, withdrawal < ₹50,000 -> 0% TDS
    tds_2 = calculate_tds_deduction(
        service_years=3.0,
        withdrawal_amount=45000.0,
        pan_linked=True,
        form_15g_submitted=False
    )
    assert tds_2["tds_applicable"] is False
    assert tds_2["tds_rate_percent"] == 0.0

    # Case 3: Service < 5 years, withdrawal >= ₹50,000 with Form 15G -> 0% TDS
    tds_3 = calculate_tds_deduction(
        service_years=3.0,
        withdrawal_amount=120000.0,
        pan_linked=True,
        form_15g_submitted=True
    )
    assert tds_3["tds_applicable"] is False
    assert tds_3["tds_rate_percent"] == 0.0

    # Case 4: Service < 5 years, withdrawal >= ₹50,000, PAN provided, NO Form 15G -> 10% TDS
    tds_4 = calculate_tds_deduction(
        service_years=3.0,
        withdrawal_amount=100000.0,
        pan_linked=True,
        form_15g_submitted=False
    )
    assert tds_4["tds_applicable"] is True
    assert tds_4["tds_rate_percent"] == 10.0
    assert tds_4["tds_amount"] == 10000.0
    assert tds_4["net_disbursement"] == 90000.0

    # Case 5: Service < 5 years, withdrawal >= ₹50,000, NO PAN, NO Form 15G -> 20% TDS (Maximum Marginal Rate)
    tds_5 = calculate_tds_deduction(
        service_years=3.0,
        withdrawal_amount=100000.0,
        pan_linked=False,
        form_15g_submitted=False
    )
    assert tds_5["tds_applicable"] is True
    assert tds_5["tds_rate_percent"] == 20.0
    assert tds_5["tds_amount"] == 20000.0
    assert tds_5["net_disbursement"] == 80000.0


# ==============================================================================
# 3. EPS-95 PENSION & EDLI 1976 INSURANCE CALCULATIONS
# ==============================================================================
def test_statutory_2_0_eps95_and_edli():
    # EPS-95: < 9.5 years = Form 10C Withdrawal Benefit
    eps_short = calculate_eps95_pension(
        monthly_wage=15000.0,
        service_years=4.5,
        current_age=40
    )
    assert eps_short["pension_type"] == "WITHDRAWAL_BENEFIT_TABLE_D"
    assert eps_short["monthly_pension"] == 0

    # EPS-95: >= 9.5 years and age 58 = Superannuation Pension
    eps_super = calculate_eps95_pension(
        monthly_wage=25000.0,
        service_years=25.0,
        current_age=58
    )
    assert eps_super["pension_type"] == "SUPERANNUATION_PENSION"
    assert eps_super["monthly_pension"] > 1000  # Minimum ₹1,000 statutory floor

    # EDLI 1976: max ₹7.0 Lakh ceiling
    edli_high = calculate_edli_insurance(
        monthly_wage=35000.0,
        epf_balance=500000.0
    )
    assert edli_high == 700000

    # EDLI 1976: min ₹2.5 Lakh floor
    edli_low = calculate_edli_insurance(
        monthly_wage=2000.0,
        epf_balance=10000.0
    )
    assert edli_low == 250000


# ==============================================================================
# 4. WAGNER-FISCHER FUZZY NAME MATCHING ACROSS INDIAN MUTATIONS
# ==============================================================================
def test_statutory_2_0_levenshtein_indian_names():
    # Clean honorifics
    assert clean_name_for_comparison("Shri Ramesh Kumar") == "RAMESH KUMAR"
    assert clean_name_for_comparison("Smt. Sunita Devi") == "SUNITA DEVI"
    assert clean_name_for_comparison("Dr. Priya Sharma") == "PRIYA SHARMA"

    # Permutations and minor spelling mutations (≥85% threshold)
    assert calculate_fuzzy_name_match("Ramesh Kumar", "Kumar Ramesh") == 100.0
    assert calculate_fuzzy_name_match("Priya Sharma", "Priyaa Sharma") >= 85.0
    assert calculate_fuzzy_name_match("Sunita Devi", "Sunitaa Devi") >= 85.0


# ==============================================================================
# 5. ZERO-TRUST PRESIDIO PII MASKING & AES-256-GCM CRYPTOGRAPHY
# ==============================================================================
def test_security_2_0_presidio_and_crypto():
    # Presidio Masking
    vault = PresidioPIISanitizer()
    masked_aadhaar = vault.mask_aadhaar("987654328712")
    assert masked_aadhaar.endswith("8712")
    assert "98765432" not in masked_aadhaar

    masked_pan = vault.mask_pan("ABCDE1234F")
    assert masked_pan.startswith("ABCDE")
    assert masked_pan.endswith("F")
    assert "1234" not in masked_pan

    # Recursive Dictionary Sanitization
    data = {
        "citizen": {
            "name": "Ramesh Kumar",
            "aadhaar": "987654328712",
            "pan": "ABCDE1234F",
            "phone": "+91-9876543210"
        }
    }
    sanitized = vault.sanitize_dict(data)
    assert sanitized["citizen"]["aadhaar"].endswith("8712")
    assert sanitized["citizen"]["pan"].startswith("ABCDE")
    assert "98765432" not in sanitized["citizen"]["aadhaar"]

    # AES-256-GCM Token Encryption and Tamper Detection
    token_vault = TokenEncryptionVault()
    secret_payload = "SESSION_UAN_100982348712_VALIDATED"
    encrypted = token_vault.encrypt_token(secret_payload)
    decrypted = token_vault.decrypt_token(encrypted)
    assert decrypted == secret_payload

    # Tampered ciphertext rejection (bytes concatenation)
    tampered = encrypted[:-4] + b"AAAA"
    with pytest.raises(Exception):
        token_vault.decrypt_token(tampered)


# ==============================================================================
# 6. SRE CIRCUIT BREAKER CHAOS FAULT-TOLERANCE
# ==============================================================================
def test_sre_2_0_circuit_breaker_resilience():
    orchestrator = ComponentResilienceOrchestrator()
    subsystems = [
        SubsystemType.VOICE_INGEST,
        SubsystemType.CHEQUE_OCR,
        SubsystemType.DATABASE,
        SubsystemType.QUEUE_WORKER,
        SubsystemType.NAME_MATCHING,
        SubsystemType.CACHE_STORE
    ]

    for sub in subsystems:
        assert not orchestrator.is_substitute_active(sub)

        # Simulate 3 consecutive failures to trip circuit
        orchestrator.record_failure(sub)
        orchestrator.record_failure(sub)
        orchestrator.record_failure(sub)
        assert orchestrator.is_substitute_active(sub)

        # Record success to recover to PRIMARY
        orchestrator.record_success(sub)
        assert not orchestrator.is_substitute_active(sub)


# ==============================================================================
# 7. 4 PERSONA COMPLETE JOURNEY SANITY VERIFICATION
# ==============================================================================
def test_4_personas_2_0_data_integrity():
    store = MockCitizenDataStore()
    personas = [
        ("100982348712", "Ramesh Kumar"),
        ("101294817203", "Priya Sharma"),
        ("100112233445", "Gurmeet Singh"),
        ("101889977665", "Sunita Devi")
    ]

    for uan, expected_name in personas:
        citizen = store.get_citizen(uan)
        assert citizen is not None
        assert citizen["full_name"] == expected_name
        assert citizen["uan"] == uan
        assert citizen["passbook_summary"]["total_balance"] >= 0
