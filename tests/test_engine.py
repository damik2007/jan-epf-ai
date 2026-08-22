"""
Jan-EPF AI: Exhaustive Deterministic Business Engine Test Suite (Agent 1 & Agent 7).
Tests fuzzy name matching (>=85% threshold), Form 31 statutory advance limits (68J, 68B, 68K, 68Z),
ECR exit date auto-deductions, Section 192A TDS logic, 8.25% compounding retirement forecaster,
IFSC bank merger resolver, and AI grievance root-cause triage.
"""
from datetime import date
import pytest
from src.core.engine import (
    BANK_MERGER_REGISTRY,
    KNOWN_BANKS,
    calculate_form_31_eligibility,
    calculate_fuzzy_name_match,
    calculate_passbook_growth_forecast,
    calculate_tds_deduction,
    clean_name_for_comparison,
    deduce_missing_date_of_exit,
    levenshtein_distance,
    lookup_and_resolve_ifsc,
    triage_grievance_root_cause,
)


# ==============================================================================
# 1. LEVENSHTEIN FUZZY MATCHING TESTS
# ==============================================================================
def test_clean_name_for_comparison():
    assert clean_name_for_comparison("") == ""
    assert clean_name_for_comparison("Shri Ramesh Kumar") == "RAMESH KUMAR"
    assert clean_name_for_comparison("Dr. Smt. Priya Sharma!!!") == "PRIYA SHARMA"
    assert clean_name_for_comparison("  Mohammad   Ali  ") == "MOHAMMAD ALI"


def test_levenshtein_distance_exact_and_edge_cases():
    assert levenshtein_distance("", "") == 0
    assert levenshtein_distance("A", "") == 1
    assert levenshtein_distance("", "ABC") == 3
    assert levenshtein_distance("SAME", "SAME") == 0
    assert levenshtein_distance("RAMESH", "RAMESH") == 0
    assert levenshtein_distance("RAMESH", "RAMES") == 1
    assert levenshtein_distance("RAMESH", "RAMESHWAR") == 3
    assert levenshtein_distance("ABC", "DEF") == 3


def test_calculate_fuzzy_name_match_exact_and_permutations():
    # Exact match
    assert calculate_fuzzy_name_match("Ramesh Kumar", "Ramesh Kumar") == 100.0
    # Case insensitivity
    assert calculate_fuzzy_name_match("ramesh kumar", "RAMESH KUMAR") == 100.0
    # Token permutation (Order Independence)
    assert calculate_fuzzy_name_match("Kumar Ramesh", "Ramesh Kumar") == 100.0
    assert calculate_fuzzy_name_match("Sharma Priya Devi", "Priya Devi Sharma") == 100.0
    # Empty inputs
    assert calculate_fuzzy_name_match("", "Ramesh") == 0.0
    assert calculate_fuzzy_name_match("Ramesh", "") == 0.0
    assert calculate_fuzzy_name_match("", "") == 0.0


def test_calculate_fuzzy_name_match_typos_and_thresholds():
    # Minor typos >= 85%
    score_typo1 = calculate_fuzzy_name_match("Ramesh Kumar", "Ramesh Kumarr")
    assert score_typo1 >= 85.0

    score_typo2 = calculate_fuzzy_name_match("Priya Sharma", "Priiya Sharma")
    assert score_typo2 >= 85.0

    # Completely different names < 50%
    score_diff = calculate_fuzzy_name_match("Ramesh Kumar", "Sunita Devi")
    assert score_diff < 50.0

    score_diff2 = calculate_fuzzy_name_match("Gurmeet Singh", "Vikram Malhotra")
    assert score_diff2 < 50.0


# ==============================================================================
# 2. FORM 31 ADVANCE ELIGIBILITY ENGINE (PARA 68)
# ==============================================================================
def test_form_31_medical_advance_para_68j():
    # Case 1: Standard medical advance (6 months basic wage limit)
    res = calculate_form_31_eligibility(
        employee_share=182000.0,
        employer_share=115500.0,
        monthly_wage=26000.0,
        service_years=1.5,
        reason="MEDICAL"
    )
    assert res["eligible"] is True
    # 6 * 26000 = 156000 < 182000
    assert res["max_advance_amount"] == 156000.0
    assert "68J" in res["para_clause"]
    assert res["minimum_service_required_years"] == 0.0

    # Case 2: Employee balance is lower than 6 months wages
    res_low_bal = calculate_form_31_eligibility(
        employee_share=50000.0,
        employer_share=30000.0,
        monthly_wage=25000.0,  # 6 months = 150000 > 50000
        service_years=0.5,
        reason="PARA_68J_ILLNESS"
    )
    assert res_low_bal["eligible"] is True
    assert res_low_bal["max_advance_amount"] == 50000.0

    # Case 3: Zero employee balance
    res_zero = calculate_form_31_eligibility(
        employee_share=0.0,
        employer_share=20000.0,
        monthly_wage=20000.0,
        service_years=1.0,
        reason="MEDICAL"
    )
    assert res_zero["eligible"] is False
    assert res_zero["max_advance_amount"] == 0.0


def test_form_31_housing_advance_para_68b():
    # Case 1: Ineligible (< 5 years service)
    res_ineligible = calculate_form_31_eligibility(
        employee_share=150000.0,
        employer_share=100000.0,
        monthly_wage=25000.0,
        service_years=4.9,
        reason="HOUSING"
    )
    assert res_ineligible["eligible"] is False
    assert res_ineligible["max_advance_amount"] == 0.0
    assert res_ineligible["minimum_service_required_years"] == 5.0

    # Case 2: Eligible (>= 5 years service)
    # Total combined balance = 250000, 36 months wages = 36 * 10000 = 360000
    res_eligible = calculate_form_31_eligibility(
        employee_share=150000.0,
        employer_share=100000.0,
        monthly_wage=10000.0,
        service_years=5.5,
        reason="FORM_31_HOUSING"
    )
    assert res_eligible["eligible"] is True
    assert res_eligible["max_advance_amount"] == 250000.0
    assert "68B" in res_eligible["para_clause"]


def test_form_31_marriage_advance_para_68k():
    # Case 1: Ineligible (< 7 years service)
    res_ineligible = calculate_form_31_eligibility(
        employee_share=200000.0,
        employer_share=100000.0,
        monthly_wage=30000.0,
        service_years=6.8,
        reason="MARRIAGE"
    )
    assert res_ineligible["eligible"] is False
    assert res_ineligible["max_advance_amount"] == 0.0
    assert res_ineligible["minimum_service_required_years"] == 7.0

    # Case 2: Eligible (>= 7 years service) -> 50% of employee share
    res_eligible = calculate_form_31_eligibility(
        employee_share=200000.0,
        employer_share=100000.0,
        monthly_wage=30000.0,
        service_years=7.5,
        reason="EDUCATION"
    )
    assert res_eligible["eligible"] is True
    assert res_eligible["max_advance_amount"] == 100000.0  # 50% of 200000
    assert "68K" in res_eligible["para_clause"]


def test_form_31_general_fallback():
    res = calculate_form_31_eligibility(
        employee_share=100000.0,
        employer_share=50000.0,
        monthly_wage=20000.0,
        service_years=2.0,
        reason="SPECIAL_CONTINGENCY"
    )
    assert res["eligible"] is True
    assert res["max_advance_amount"] == 75000.0  # 75% of 100000
    assert "68Z" in res["para_clause"]


# ==============================================================================
# 3. ECR DATE OF EXIT AUTO-DEDUCTION ENGINE
# ==============================================================================
def test_deduce_missing_date_of_exit():
    # 31-day month (January, August, December)
    assert deduce_missing_date_of_exit(date(2023, 1, 15)) == date(2023, 1, 31)
    assert deduce_missing_date_of_exit(date(2023, 8, 1)) == date(2023, 8, 31)
    assert deduce_missing_date_of_exit(date(2023, 12, 10)) == date(2023, 12, 31)

    # 30-day month (April, June, September, November)
    assert deduce_missing_date_of_exit(date(2023, 4, 1)) == date(2023, 4, 30)
    assert deduce_missing_date_of_exit(date(2023, 6, 20)) == date(2023, 6, 30)
    assert deduce_missing_date_of_exit(date(2023, 9, 5)) == date(2023, 9, 30)
    assert deduce_missing_date_of_exit(date(2023, 11, 28)) == date(2023, 11, 30)

    # February in leap year (2024 -> 29 days)
    assert deduce_missing_date_of_exit(date(2024, 2, 1)) == date(2024, 2, 29)

    # February in non-leap year (2023 -> 28 days)
    assert deduce_missing_date_of_exit(date(2023, 2, 1)) == date(2023, 2, 28)


# ==============================================================================
# 4. SECTION 192A TDS DEDUCTION CALCULATOR
# ==============================================================================
def test_tds_deduction_scenarios():
    # 1. Service >= 5 years -> Fully Exempt (0%)
    res_5yr = calculate_tds_deduction(service_years=5.0, withdrawal_amount=300000.0)
    assert res_5yr["tds_applicable"] is False
    assert res_5yr["tds_rate_percent"] == 0.0
    assert res_5yr["tds_amount"] == 0.0
    assert res_5yr["net_disbursement"] == 300000.0

    # 2. Withdrawal amount < Rs 50,000 -> Fully Exempt (0%)
    res_under_50k = calculate_tds_deduction(service_years=2.0, withdrawal_amount=49999.0)
    assert res_under_50k["tds_applicable"] is False
    assert res_under_50k["tds_amount"] == 0.0
    assert res_under_50k["net_disbursement"] == 49999.0

    # 3. Form 15G / 15H submitted -> Fully Exempt (0%)
    res_15g = calculate_tds_deduction(
        service_years=2.5,
        withdrawal_amount=150000.0,
        pan_linked=True,
        form_15g_submitted=True
    )
    assert res_15g["tds_applicable"] is False
    assert res_15g["tds_amount"] == 0.0
    assert res_15g["net_disbursement"] == 150000.0

    # 4. Service < 5 years, Amount >= 50k, PAN Linked -> 10% TDS
    res_pan = calculate_tds_deduction(
        service_years=3.0,
        withdrawal_amount=100000.0,
        pan_linked=True,
        form_15g_submitted=False
    )
    assert res_pan["tds_applicable"] is True
    assert res_pan["tds_rate_percent"] == 10.0
    assert res_pan["tds_amount"] == 10000.0
    assert res_pan["net_disbursement"] == 90000.0

    # 5. Service < 5 years, Amount >= 50k, PAN Missing -> 20% TDS (Section 206AA)
    res_no_pan = calculate_tds_deduction(
        service_years=3.0,
        withdrawal_amount=100000.0,
        pan_linked=False,
        form_15g_submitted=False
    )
    assert res_no_pan["tds_applicable"] is True
    assert res_no_pan["tds_rate_percent"] == 20.0
    assert res_no_pan["tds_amount"] == 20000.0
    assert res_no_pan["net_disbursement"] == 80000.0


# ==============================================================================
# 5. PASSBOOK COMPOUNDING INTEREST & FORECASTER
# ==============================================================================
def test_passbook_growth_forecast_curves():
    curve = calculate_passbook_growth_forecast(
        current_balance=200000.0,
        monthly_employee_contrib=3000.0,
        monthly_employer_contrib=3000.0,
        current_age=50,
        retirement_age=58,
        annual_interest_rate=8.25
    )
    # Age 50 through 58 -> 9 data points
    assert len(curve) == 9
    assert curve[0]["age"] == 50
    assert curve[0]["total_balance"] == 200000.0
    assert curve[0]["annual_interest_credited"] == 0.0

    # Intermediate and final year assertions
    assert curve[-1]["age"] == 58
    assert curve[-1]["total_balance"] > 200000.0
    assert curve[-1]["employee_share"] > 0
    assert curve[-1]["employer_share"] > 0
    assert curve[-1]["annual_interest_credited"] > 0


def test_passbook_growth_forecast_already_retired():
    # If current age >= retirement age, forecaster still produces minimum 1 year projection
    curve = calculate_passbook_growth_forecast(
        current_balance=100000.0,
        monthly_employee_contrib=0.0,
        monthly_employer_contrib=0.0,
        current_age=60,
        retirement_age=58
    )
    assert len(curve) >= 2


# ==============================================================================
# 6. IFSC & BANK MERGER AUTO-RESOLVER
# ==============================================================================
def test_ifsc_merger_registry_lookups():
    # Verify all 8 historical merged banks
    merged_checks = [
        ("ALLA0210001", "Indian Bank"),
        ("SYNB0001234", "Canara Bank"),
        ("CORP0000567", "Union Bank of India"),
        ("ANDB0000890", "Union Bank of India"),
        ("ORBC0001122", "Punjab National Bank"),
        ("UTBI0003344", "Punjab National Bank"),
        ("VIJB0005566", "Bank of Baroda"),
        ("BKDN0007788", "Bank of Baroda"),
    ]
    for ifsc, expected_bank in merged_checks:
        res = lookup_and_resolve_ifsc(ifsc)
        assert res["valid_syntax"] is True
        assert res["is_merged"] is True
        assert res["bank_name"] == expected_bank
        assert "merged" in res["merger_note"].lower()


def test_ifsc_known_direct_banks():
    direct_checks = [
        ("SBIN0001234", "State Bank of India"),
        ("HDFC0000060", "HDFC Bank"),
        ("ICIC0000011", "ICICI Bank"),
        ("PUNB0007890", "Punjab National Bank"),
        ("CNRB0001001", "Canara Bank"),
        ("UBIN0002002", "Union Bank of India"),
        ("BARB0003003", "Bank of Baroda"),
        ("IDIB0004004", "Indian Bank"),
        ("AIRP0000001", "Airtel Payments Bank"),
        ("IPOS0000001", "India Post Payments Bank"),
        ("PYTM0123456", "Paytm Payments Bank"),
        ("UTIB0000001", "Axis Bank"),
        ("KKBK0000001", "Kotak Mahindra Bank"),
    ]
    for ifsc, expected_bank in direct_checks:
        res = lookup_and_resolve_ifsc(ifsc)
        assert res["valid_syntax"] is True
        assert res["is_merged"] is False
        assert res["bank_name"] == expected_bank


def test_ifsc_invalid_and_unknown():
    # Invalid length
    inv1 = lookup_and_resolve_ifsc("SBIN123")
    assert inv1["valid_syntax"] is False
    assert inv1["bank_name"] == "Unknown"

    inv2 = lookup_and_resolve_ifsc("SBIN000123456789")
    assert inv2["valid_syntax"] is False

    # Unknown commercial bank prefix (11 chars)
    unk = lookup_and_resolve_ifsc("ZZZZ0001234")
    assert unk["valid_syntax"] is True
    assert unk["is_merged"] is False
    assert "Commercial Bank (ZZZZ)" in unk["bank_name"]


# ==============================================================================
# 7. AI GRIEVANCE COPILOT ROOT-CAUSE TRIAGE
# ==============================================================================
def test_triage_grievance_categories():
    # Missing Date of Exit
    diag_exit = triage_grievance_root_cause(
        uan="100982348712",
        complaint_category="EXIT_DATE",
        complaint_text="Employer did not update date of exit when I left job."
    )
    assert diag_exit["error_code_classification"] == "ERR_EPFO_DOE_MISSING"
    assert diag_exit["automated_fix_available"] is True
    assert diag_exit["auto_remediation_route"] == "/career"

    # Unmerged Member ID
    diag_transfer = triage_grievance_root_cause(
        uan="101294817203",
        complaint_category="TRANSFER",
        complaint_text="Need to transfer balance from my old company to current."
    )
    assert diag_transfer["error_code_classification"] == "ERR_EPFO_UNMERGED_MEMBER_ID"
    assert diag_transfer["auto_remediation_route"] == "/career"

    # Pending KYC / Bank Issue
    diag_kyc = triage_grievance_root_cause(
        uan="100982348712",
        complaint_category="KYC",
        complaint_text="My claim rejected due to bank KYC approval delay."
    )
    assert diag_kyc["error_code_classification"] == "ERR_EPFO_KYC_PENDING_RO"
    assert diag_kyc["auto_remediation_route"] == "/fix"

    # Name Mismatch
    diag_name = triage_grievance_root_cause(
        uan="100982348712",
        complaint_category="NAME_CORRECTION",
        complaint_text="My father name has a spelling mismatch with Aadhaar."
    )
    assert diag_name["error_code_classification"] == "ERR_EPFO_NAME_MISMATCH"
    assert diag_name["auto_remediation_route"] == "/fix"

    # General fallback
    diag_general = triage_grievance_root_cause(
        uan="100982348712",
        complaint_category="OTHER",
        complaint_text="Status of my pension paperwork."
    )
    assert diag_general["error_code_classification"] == "INFO_EPFO_STANDARD_INQUIRY"
    assert diag_general["auto_remediation_route"] == "/money"
