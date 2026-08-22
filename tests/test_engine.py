"""
Jan-EPF AI: 80/20 On-Site Deterministic Business Engine Test Suite (Agent 7).
Tests fuzzy name matching, Form 31 calculations, ECR exit date deductions,
Section 192A TDS evaluations, compounding growth projections, and IFSC mergers.
"""
from datetime import date
from src.core.engine import (
    calculate_fuzzy_name_match,
    calculate_form_31_eligibility,
    deduce_missing_date_of_exit,
    calculate_tds_deduction,
    calculate_passbook_growth_forecast,
    lookup_and_resolve_ifsc,
    triage_grievance_root_cause
)


def test_fuzzy_name_matching():
    # Exact match
    assert calculate_fuzzy_name_match("Ramesh Kumar", "Ramesh Kumar") == 100.0
    # Token permutation (Kumar Ramesh vs Ramesh Kumar)
    assert calculate_fuzzy_name_match("Kumar Ramesh", "Ramesh Kumar") == 100.0
    # Honorific stripping (Shri Ramesh Kumar vs Ramesh Kumar)
    assert calculate_fuzzy_name_match("Shri Ramesh Kumar", "Ramesh Kumar") >= 90.0
    # Minor typo
    score = calculate_fuzzy_name_match("Ramesh Kumar", "Ramesh Kumarr")
    assert score >= 90.0
    # Completely different names
    assert calculate_fuzzy_name_match("Ramesh Kumar", "Sunita Devi") < 50.0


def test_form_31_medical_advance():
    # Para 68J (Illness): No minimum service required
    res = calculate_form_31_eligibility(
        employee_share=182000.0,
        employer_share=115500.0,
        monthly_wage=26000.0,
        service_years=2.0,
        reason="MEDICAL"
    )
    assert res["eligible"] is True
    # 6 months wages = 6 * 26000 = 156000
    assert res["max_advance_amount"] == 156000.0
    assert "68J" in res["para_clause"]


def test_form_31_housing_advance():
    # Para 68B (Housing): Requires 5 years service
    ineligible = calculate_form_31_eligibility(
        employee_share=100000.0,
        employer_share=50000.0,
        monthly_wage=20000.0,
        service_years=3.0,
        reason="HOUSING"
    )
    assert ineligible["eligible"] is False
    assert ineligible["max_advance_amount"] == 0.0

    eligible = calculate_form_31_eligibility(
        employee_share=100000.0,
        employer_share=50000.0,
        monthly_wage=20000.0,
        service_years=6.0,
        reason="HOUSING"
    )
    assert eligible["eligible"] is True
    assert eligible["max_advance_amount"] == 150000.0


def test_form_31_marriage_advance():
    # Para 68K (Marriage): Requires 7 years service, max 50% employee share
    ineligible = calculate_form_31_eligibility(
        employee_share=100000.0,
        employer_share=50000.0,
        monthly_wage=20000.0,
        service_years=5.0,
        reason="MARRIAGE"
    )
    assert ineligible["eligible"] is False

    eligible = calculate_form_31_eligibility(
        employee_share=100000.0,
        employer_share=50000.0,
        monthly_wage=20000.0,
        service_years=8.0,
        reason="MARRIAGE"
    )
    assert eligible["eligible"] is True
    assert eligible["max_advance_amount"] == 50000.0  # 50% of 100000


def test_deduce_missing_date_of_exit():
    # August (31 days)
    doe_aug = deduce_missing_date_of_exit(date(2023, 8, 1))
    assert doe_aug == date(2023, 8, 31)

    # February in leap year (2024 -> 29 days)
    doe_feb_leap = deduce_missing_date_of_exit(date(2024, 2, 1))
    assert doe_feb_leap == date(2024, 2, 29)

    # April (30 days)
    doe_apr = deduce_missing_date_of_exit(date(2023, 4, 15))
    assert doe_apr == date(2023, 4, 30)


def test_tds_deduction_exemptions():
    # Exemption 1: Service >= 5 years
    res1 = calculate_tds_deduction(service_years=5.5, withdrawal_amount=200000.0)
    assert res1["tds_applicable"] is False
    assert res1["tds_amount"] == 0.0

    # Exemption 2: Withdrawal < 50,000
    res2 = calculate_tds_deduction(service_years=2.0, withdrawal_amount=35000.0)
    assert res2["tds_applicable"] is False
    assert res2["tds_amount"] == 0.0

    # Exemption 3: Form 15G submitted
    res3 = calculate_tds_deduction(
        service_years=2.0,
        withdrawal_amount=150000.0,
        pan_linked=True,
        form_15g_submitted=True
    )
    assert res3["tds_applicable"] is False
    assert res3["tds_amount"] == 0.0

    # Case 4: TDS applied with PAN (10%)
    res4 = calculate_tds_deduction(
        service_years=2.0,
        withdrawal_amount=100000.0,
        pan_linked=True,
        form_15g_submitted=False
    )
    assert res4["tds_applicable"] is True
    assert res4["tds_rate_percent"] == 10.0
    assert res4["tds_amount"] == 10000.0
    assert res4["net_disbursement"] == 90000.0

    # Case 5: TDS applied without PAN (20% under Section 206AA)
    res5 = calculate_tds_deduction(
        service_years=2.0,
        withdrawal_amount=100000.0,
        pan_linked=False,
        form_15g_submitted=False
    )
    assert res5["tds_applicable"] is True
    assert res5["tds_rate_percent"] == 20.0
    assert res5["tds_amount"] == 20000.0
    assert res5["net_disbursement"] == 80000.0


def test_passbook_growth_forecaster():
    curve = calculate_passbook_growth_forecast(
        current_balance=100000.0,
        monthly_employee_contrib=2500.0,
        monthly_employer_contrib=2500.0,
        current_age=50,
        retirement_age=58,
        annual_interest_rate=8.25
    )
    assert len(curve) == 9  # Age 50 to 58 inclusive
    assert curve[0]["total_balance"] == 100000.0
    assert curve[-1]["total_balance"] > 100000.0
    assert curve[-1]["age"] == 58


def test_ifsc_merger_lookup():
    # Merged bank (Allahabad Bank -> Indian Bank)
    alla_res = lookup_and_resolve_ifsc("ALLA0210001")
    assert alla_res["valid_syntax"] is True
    assert alla_res["is_merged"] is True
    assert alla_res["bank_name"] == "Indian Bank"

    # Active direct bank (SBI)
    sbin_res = lookup_and_resolve_ifsc("SBIN0001234")
    assert sbin_res["valid_syntax"] is True
    assert sbin_res["is_merged"] is False
    assert sbin_res["bank_name"] == "State Bank of India"

    # Invalid IFSC length
    invalid_res = lookup_and_resolve_ifsc("INVALID")
    assert invalid_res["valid_syntax"] is False


def test_grievance_root_cause_triage():
    diag_exit = triage_grievance_root_cause(
        uan="100982348712",
        complaint_category="EXIT",
        complaint_text="My previous employer did not update date of exit."
    )
    assert diag_exit["error_code_classification"] == "ERR_EPFO_DOE_MISSING"
    assert diag_exit["automated_fix_available"] is True

    diag_transfer = triage_grievance_root_cause(
        uan="101294817203",
        complaint_category="TRANSFER",
        complaint_text="I want to transfer balance from my old company."
    )
    assert diag_transfer["error_code_classification"] == "ERR_EPFO_UNMERGED_MEMBER_ID"
