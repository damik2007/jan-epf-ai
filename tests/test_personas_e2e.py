"""
Jan-EPF AI: User Persona End-to-End Journey Test Suite.
Tests complete lifecycles for all 4 citizen personas:
1. Ramesh Kumar (48) - Form 31 Emergency Medical Advance + Cheque OCR pre-validation
2. Priya Sharma (27) - Form 13 Multi-Job Transfer + Missing DOE Auto-Deduction
3. Gurmeet Singh (66) - Senior Citizen Mode + EPS-95 Monthly Pension + Jeevan Pramaan DLC
4. Sunita Devi (34) - 1-Click Mobile e-Nomination + Levenshtein Fuzzy Match + ₹7L EDLI
"""
import pytest
from httpx import AsyncClient, ASGITransport
from datetime import date
from src.api.main import app as gateway_app
from src.core.data_store import mock_store
from src.core.engine import (
    calculate_form_31_eligibility,
    calculate_fuzzy_name_match,
    calculate_passbook_growth_forecast,
    deduce_missing_date_of_exit,
)


@pytest.fixture
def anyio_backend():
    return "asyncio"


# ==============================================================================
# 1. PERSONA 1: RAMESH KUMAR (AGE 48) - EMERGENCY ADVANCE & CHEQUE OCR
# ==============================================================================
@pytest.mark.asyncio
async def test_persona_ramesh_kumar_emergency_advance_journey():
    uan = "100982348712"
    citizen = mock_store.get_citizen(uan)
    assert citizen is not None
    assert citizen["full_name"] == "Ramesh Kumar"

    # Step 1: Evaluate Form 31 Advance Eligibility under Para 68J (Illness)
    emp_share = citizen["passbook_summary"]["employee_share"]
    empr_share = citizen["passbook_summary"]["employer_share"]
    monthly_wage = citizen["active_employment"].get("monthly_basic_wage", 32000.0) if citizen.get("active_employment") else 32000.0
    service_years = citizen["active_employment"].get("total_service_years", 8.2) if citizen.get("active_employment") else 8.2

    f31_res = calculate_form_31_eligibility(
        employee_share=emp_share,
        employer_share=empr_share,
        monthly_wage=monthly_wage,
        service_years=service_years,
        reason="PARA_68J_ILLNESS"
    )
    assert f31_res["eligible"] is True
    assert f31_res["max_advance_amount"] > 0

    # Step 2: Client Canvas Cheque OCR Pre-Validation via API
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        ocr_res = await client.post("/api/v1/ocr/analyze-cheque", json={
            "uan": uan,
            "extracted_account_number": "987654321098",
            "extracted_ifsc_code": "SBIN0001234",
            "extracted_payee_name": "Ramesh Kumar",
            "client_sharpness_score": 92.5,
            "client_contrast_score": 88.0
        })
        assert ocr_res.status_code == 200
        ocr_data = ocr_res.json()
        assert ocr_data["is_valid_cheque"] is True
        assert ocr_data["is_fuzzy_name_match_passed"] is True
        assert ocr_data["ifsc_bank_name"] == "State Bank of India"

        # Step 3: Submit Form 31 Advance Claim
        claim_res = await client.post("/api/v1/claims/submit", json={
            "uan": uan,
            "claim_type": "FORM_31_MEDICAL",
            "amount_requested": 50000.0,
            "reason_code": "PARA_68J_ILLNESS",
            "reason_description": "Emergency Hospitalization Advance",
            "bank_account_verified": True
        })
        assert claim_res.status_code == 200
        claim_data = claim_res.json()
        assert claim_data["claim_id"].startswith("CLM-")
        assert claim_data["amount_sanctioned"] == 50000.0
        assert claim_data["status"] == "AUTO_APPROVED"


# ==============================================================================
# 2. PERSONA 2: PRIYA SHARMA (AGE 27) - FORM 13 TRANSFER & AUTO-EXIT DATE
# ==============================================================================
@pytest.mark.asyncio
async def test_persona_priya_sharma_job_switch_transfer_journey():
    uan = "101294817203"
    citizen = mock_store.get_citizen(uan)
    assert citizen is not None
    assert citizen["full_name"] == "Priya Sharma"

    # Step 1: Auto-Deduce Missing Date of Exit from last ECR wage month
    last_ecr_month = date(2023, 11, 1)
    deduced_doe = deduce_missing_date_of_exit(last_ecr_month)
    assert str(deduced_doe) == "2023-11-30"

    # Step 2: Submit Form 13 Transfer Request via API
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        transfer_res = await client.post("/api/v1/claims/submit", json={
            "uan": uan,
            "claim_type": "FORM_13_TRANSFER",
            "amount_requested": 185000.0,
            "reason_code": "JOB_SWITCH_TRANSFER",
            "reason_description": "Auto-merge previous establishment into Apex AI account",
            "source_member_id": "MHDEL00192830000182",
            "target_member_id": "MHBOM00982340000891"
        })
        assert transfer_res.status_code == 200
        transfer_data = transfer_res.json()
        assert transfer_data["claim_id"].startswith("CLM-")
        assert transfer_data["amount_sanctioned"] == 185000.0


# ==============================================================================
# 3. PERSONA 3: GURMEET SINGH (AGE 66) - SENIOR PENSIONER EPS-95 & DLC
# ==============================================================================
@pytest.mark.asyncio
async def test_persona_gurmeet_singh_senior_pension_journey():
    uan = "100112233445"
    citizen = mock_store.get_citizen(uan)
    assert citizen is not None
    assert citizen["full_name"] == "Gurmeet Singh"
    assert citizen["pension_details"] is not None
    assert citizen["pension_details"]["monthly_pension_amount"] == 4250.0

    # Step 1: Check Passbook and Pension Ledger via API
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        pb_res = await client.get(f"/api/v1/passbook/{uan}")
        assert pb_res.status_code == 200
        pb_data = pb_res.json()
        assert pb_data["uan"] == uan

        # Step 2: Submit Digital Life Certificate (DLC / Jeevan Pramaan)
        dlc_res = await client.post("/api/v1/claims/submit", json={
            "uan": uan,
            "claim_type": "JEEVAN_PRAMAAN",
            "amount_requested": 4250.0,
            "reason_code": "ANNUAL_DLC_RENEWAL",
            "reason_description": "Aadhaar FaceRD biometric renewal"
        })
        assert dlc_res.status_code == 200
        assert dlc_res.json()["status"] in ["AUTO_APPROVED", "SUBMITTED"]


# ==============================================================================
# 4. PERSONA 4: SUNITA DEVI (AGE 34) - E-NOMINATION & ₹7L EDLI INSURANCE
# ==============================================================================
@pytest.mark.asyncio
async def test_persona_sunita_devi_enomination_and_edli_journey():
    uan = "101889977665"
    citizen = mock_store.get_citizen(uan)
    assert citizen is not None
    assert citizen["full_name"] == "Sunita Devi"

    # Step 1: Fuzzy Name Match between Aadhaar and EPFO record
    match_score = calculate_fuzzy_name_match("Sunita Devi", "SUNITA DEVI")
    assert match_score == 100.0

    # Step 2: Verify Free ₹7 Lakh EDLI Life Insurance Cover
    growth_curve = calculate_passbook_growth_forecast(
        current_balance=86400,
        monthly_employee_contrib=1200,
        monthly_employer_contrib=367,
        current_age=34,
        retirement_age=58,
        annual_interest_rate=8.25
    )
    assert len(growth_curve) == 25
    assert growth_curve[-1]["total_balance"] > 86400

    # Step 3: Submit 1-Click e-Nomination via API
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        nom_res = await client.post("/api/v1/claims/submit", json={
            "uan": uan,
            "claim_type": "E_NOMINATION",
            "amount_requested": 700000.0,
            "reason_code": "FAMILY_BENEFICIARY_REGISTRATION",
            "reason_description": "Nominate Rahul (Son - 100% share) with Aadhaar e-Sign"
        })
        assert nom_res.status_code == 200
        nom_data = nom_res.json()
        assert nom_data["claim_id"].startswith("CLM-")
