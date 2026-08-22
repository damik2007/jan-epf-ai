"""
Jan-EPF AI: Exhaustive Pydantic v2 Domain Schemas & Contracts Test Suite.
Validates RFC-001 domain models, regex validators, boundary conditions, defaults, and serializations.
"""
from datetime import date, datetime
import pytest
from pydantic import ValidationError

from src.core.schemas import (
    ActiveEmployment,
    BankKYC,
    ChequeOCRAnalysisResult,
    CitizenProfile,
    ClaimStatus,
    ClaimSubmissionRequest,
    ClaimSubmissionResponse,
    ClaimType,
    EmploymentHistoryItem,
    GrievanceDiagnosisRequest,
    GrievanceDiagnosisResponse,
    InsuranceDetails,
    JointDeclarationFieldCorrection,
    JointDeclarationRequest,
    JointDeclarationStatusResponse,
    KYCStatus,
    NominationDetails,
    Nominee,
    PassbookSummary,
    PennyDropVerificationRequest,
    PennyDropVerificationResponse,
    PensionDetails,
    TopicHub,
    VoiceCommandRequest,
    VoiceCommandResponse,
)
from src.api.routes.auth import LoginRequest, LoginResponse
from src.api.routes.ocr import ChequeAnalysisRequest
from src.api.routes.passbook import ForecastRequest


# ==============================================================================
# 1. ENUM INTEGRITY TESTS
# ==============================================================================
def test_claim_type_enum_values():
    assert ClaimType.MEDICAL_ADVANCE.value == "FORM_31_MEDICAL"
    assert ClaimType.HOUSING_ADVANCE.value == "FORM_31_HOUSING"
    assert ClaimType.MARRIAGE_ADVANCE.value == "FORM_31_MARRIAGE"
    assert ClaimType.PF_TRANSFER.value == "FORM_13_TRANSFER"
    assert ClaimType.FINAL_SETTLEMENT.value == "FORM_19_10C_SETTLEMENT"
    assert ClaimType.PENSION_CLAIM.value == "FORM_10D_PENSION"
    assert ClaimType.LIFE_CERTIFICATE.value == "JEEVAN_PRAMAAN"
    assert ClaimType.E_NOMINATION.value == "E_NOMINATION"
    assert ClaimType.JOINT_DECLARATION.value == "JOINT_DECLARATION"
    assert len(ClaimType) == 9


def test_claim_status_enum_values():
    assert ClaimStatus.SUBMITTED.value == "SUBMITTED"
    assert ClaimStatus.IN_REVIEW.value == "IN_REVIEW"
    assert ClaimStatus.AUTO_APPROVED.value == "AUTO_APPROVED"
    assert ClaimStatus.DISBURSED.value == "DISBURSED"
    assert ClaimStatus.REJECTED.value == "REJECTED"


def test_kyc_status_enum_values():
    assert KYCStatus.PENDING.value == "PENDING"
    assert KYCStatus.APPROVED_BY_EMPLOYER.value == "APPROVED_BY_EMPLOYER"
    assert KYCStatus.VERIFIED_ACTIVE.value == "VERIFIED_ACTIVE"
    assert KYCStatus.SENIOR_PENSION_ACTIVE.value == "SENIOR_PENSION_ACTIVE"
    assert KYCStatus.REJECTED.value == "REJECTED"


def test_topic_hub_enum_values():
    assert TopicHub.MONEY.value == "money"
    assert TopicHub.CAREER.value == "career"
    assert TopicHub.SAVINGS.value == "savings"
    assert TopicHub.FIX.value == "fix"


# ==============================================================================
# 2. CITIZEN IDENTITY & BANKING MODELS
# ==============================================================================
def test_bank_kyc_model():
    kyc = BankKYC(
        bank_name="State Bank of India",
        account_number_masked="XXXXXX9012",
        ifsc_code="SBIN0001234",
        kyc_status=KYCStatus.VERIFIED_ACTIVE,
        penny_drop_verified=True,
        verified_holder_name="Ramesh Kumar"
    )
    assert kyc.bank_name == "State Bank of India"
    assert kyc.penny_drop_verified is True
    assert kyc.verified_holder_name == "Ramesh Kumar"

    # Default penny_drop_verified is False
    kyc_default = BankKYC(
        bank_name="HDFC Bank",
        account_number_masked="XXXXXX4512",
        ifsc_code="HDFC0000456",
        kyc_status=KYCStatus.PENDING
    )
    assert kyc_default.penny_drop_verified is False
    assert kyc_default.verified_holder_name is None


def test_employment_history_and_active_employment():
    hist_item = EmploymentHistoryItem(
        member_id="KNBLR00123450000098712",
        establishment_name="Precision Auto Components",
        date_of_joining=date(2018, 6, 15),
        date_of_exit=date(2023, 8, 31),
        balance=185000.0,
        transfer_status="PENDING_MERGE",
        last_ecr_wage_month=date(2023, 8, 1),
        exit_date_deduced=date(2023, 8, 31)
    )
    assert hist_item.balance == 185000.0
    assert hist_item.transfer_status == "PENDING_MERGE"
    assert hist_item.exit_date_deduced == date(2023, 8, 31)

    # Defaults
    hist_default = EmploymentHistoryItem(
        member_id="MEM001",
        establishment_name="Est 1",
        date_of_joining=date(2020, 1, 1)
    )
    assert hist_default.balance == 0.0
    assert hist_default.transfer_status == "PENDING_MERGE"
    assert hist_default.date_of_exit is None

    active_emp = ActiveEmployment(
        member_id="MEM002",
        establishment_name="Est 2",
        date_of_joining=date(2023, 9, 1),
        total_service_years=3.5
    )
    assert active_emp.total_service_years == 3.5
    assert active_emp.date_of_exit is None


def test_passbook_summary_defaults_and_fields():
    pb = PassbookSummary(
        total_balance=475000.0,
        employee_share=260000.0,
        employer_share=165000.0,
        pension_fund_share=50000.0,
        monthly_wage=45000.0
    )
    assert pb.interest_rate == 8.25
    assert pb.interest_credited_current_fy == 0.0
    assert pb.settled_at_retirement is False
    assert pb.monthly_wage == 45000.0


def test_pension_and_nomination_models():
    pension = PensionDetails(
        ppo_number="PBASR00012345",
        monthly_pension_amount=4250.0,
        pension_start_date=date(2018, 2, 1),
        life_certificate_status="VALID_UNTIL_NOV_2026",
        life_certificate_expiry=date(2026, 11, 30)
    )
    assert pension.scheme == "EPS-95"
    assert pension.monthly_pension_amount == 4250.0

    nominee = Nominee(
        name="Manoj Kumar",
        relationship="Spouse",
        dob=date(1990, 5, 18),
        share_percent=100,
        aadhaar_masked="XXXX-XXXX-9988"
    )
    assert nominee.share_percent == 100
    assert nominee.guardian_name is None

    nomination = NominationDetails(
        nomination_filed=True,
        filed_date=date(2024, 1, 15),
        nominees=[nominee]
    )
    assert len(nomination.nominees) == 1
    assert nomination.nomination_filed is True


def test_insurance_details():
    ins = InsuranceDetails()
    assert ins.edli_coverage_amount == 700000.0
    assert ins.status == "ACTIVE_COVERED"


def test_citizen_profile_validation():
    profile = CitizenProfile(
        uan="100982348712",
        full_name="Ramesh Kumar",
        phone="+919876543210",
        dob=date(1978, 4, 12),
        gender="Male",
        father_name="Ram Prasad Kumar",
        aadhaar_masked="XXXX-XXXX-4819",
        pan_masked="ABCDE1234F",
        bank_kyc=BankKYC(
            bank_name="State Bank of India",
            account_number_masked="XXXXXX9012",
            ifsc_code="SBIN0001234",
            kyc_status=KYCStatus.APPROVED_BY_EMPLOYER,
            penny_drop_verified=True
        ),
        passbook_summary=PassbookSummary(
            total_balance=342500.0,
            employee_share=182000.0,
            employer_share=115500.0,
            pension_fund_share=45000.0
        )
    )
    assert profile.uan == "100982348712"
    assert profile.phone == "+919876543210"
    assert profile.active_employment is None
    assert profile.employment_history == []
    assert profile.insurance_details.edli_coverage_amount == 700000.0


def test_citizen_profile_invalid_uan_and_phone():
    # Invalid UAN: < 12 digits
    with pytest.raises(ValidationError):
        CitizenProfile(
            uan="10098234",  # Too short
            full_name="Test",
            phone="+919876543210",
            dob=date(1990, 1, 1),
            gender="Male",
            father_name="Father",
            aadhaar_masked="XXXX-XXXX-1234",
            pan_masked="ABCDE1234F",
            bank_kyc=BankKYC(
                bank_name="SBI",
                account_number_masked="XXXXXX1234",
                ifsc_code="SBIN0001234",
                kyc_status=KYCStatus.VERIFIED_ACTIVE
            ),
            passbook_summary=PassbookSummary(
                total_balance=1000.0,
                employee_share=600.0,
                employer_share=400.0,
                pension_fund_share=0.0
            )
        )

    # Invalid UAN: Non-numeric
    with pytest.raises(ValidationError):
        CitizenProfile(
            uan="10098234ABCD",
            full_name="Test",
            phone="+919876543210",
            dob=date(1990, 1, 1),
            gender="Male",
            father_name="Father",
            aadhaar_masked="XXXX-XXXX-1234",
            pan_masked="ABCDE1234F",
            bank_kyc=BankKYC(
                bank_name="SBI",
                account_number_masked="XXXXXX1234",
                ifsc_code="SBIN0001234",
                kyc_status=KYCStatus.VERIFIED_ACTIVE
            ),
            passbook_summary=PassbookSummary(
                total_balance=1000.0,
                employee_share=600.0,
                employer_share=400.0,
                pension_fund_share=0.0
            )
        )

    # Invalid Phone: Missing +91
    with pytest.raises(ValidationError):
        CitizenProfile(
            uan="100982348712",
            full_name="Test",
            phone="9876543210",  # Missing +91
            dob=date(1990, 1, 1),
            gender="Male",
            father_name="Father",
            aadhaar_masked="XXXX-XXXX-1234",
            pan_masked="ABCDE1234F",
            bank_kyc=BankKYC(
                bank_name="SBI",
                account_number_masked="XXXXXX1234",
                ifsc_code="SBIN0001234",
                kyc_status=KYCStatus.VERIFIED_ACTIVE
            ),
            passbook_summary=PassbookSummary(
                total_balance=1000.0,
                employee_share=600.0,
                employer_share=400.0,
                pension_fund_share=0.0
            )
        )


# ==============================================================================
# 3. CLAIM CREATION & SETTLEMENT CONTRACTS
# ==============================================================================
def test_claim_submission_request_valid_and_invalid():
    req = ClaimSubmissionRequest(
        uan="100982348712",
        claim_type=ClaimType.MEDICAL_ADVANCE,
        amount_requested=40000.0,
        reason_code="PARA_68J_ILLNESS",
        reason_description="Hospital emergency",
        form_15g_submitted=True
    )
    assert req.amount_requested == 40000.0
    assert req.bank_account_verified is True
    assert req.form_15g_submitted is True

    # Amount must be strictly greater than 0
    with pytest.raises(ValidationError):
        ClaimSubmissionRequest(
            uan="100982348712",
            claim_type=ClaimType.MEDICAL_ADVANCE,
            amount_requested=0.0,  # Invalid <= 0
            reason_code="PARA_68J_ILLNESS"
        )

    with pytest.raises(ValidationError):
        ClaimSubmissionRequest(
            uan="100982348712",
            claim_type=ClaimType.MEDICAL_ADVANCE,
            amount_requested=-5000.0,  # Negative
            reason_code="PARA_68J_ILLNESS"
        )


def test_claim_submission_response():
    resp = ClaimSubmissionResponse(
        claim_id="CLM-12345678",
        uan="100982348712",
        claim_type=ClaimType.MEDICAL_ADVANCE,
        amount_sanctioned=40000.0,
        status=ClaimStatus.AUTO_APPROVED,
        direct_benefit_transfer_account="State Bank of India - XXXXXX9012",
        audit_trace_token="sha256_mock_token_123"
    )
    assert resp.claim_id == "CLM-12345678"
    assert resp.estimated_disbursement_hours == 24
    assert resp.tds_deducted_amount == 0.0
    assert isinstance(resp.timestamp, datetime)


# ==============================================================================
# 4. OCR & PENNY DROP CONTRACTS
# ==============================================================================
def test_cheque_ocr_analysis_result_bounds():
    valid = ChequeOCRAnalysisResult(
        is_valid_cheque=True,
        sharpness_score=92.5,
        contrast_score=88.0,
        extracted_account_number="987654321098",
        extracted_ifsc_code="SBIN0001234",
        extracted_payee_name="Ramesh Kumar",
        name_match_confidence=100.0,
        ifsc_bank_name="State Bank of India",
        is_fuzzy_name_match_passed=True
    )
    assert valid.is_valid_cheque is True
    assert valid.fallback_used == "CLIENT_CANVAS_TESSERACT"

    # Sharpness score > 100 raises ValidationError
    with pytest.raises(ValidationError):
        ChequeOCRAnalysisResult(
            is_valid_cheque=True,
            sharpness_score=105.0,  # Out of bounds
            contrast_score=80.0
        )

    # Sharpness score < 0 raises ValidationError
    with pytest.raises(ValidationError):
        ChequeOCRAnalysisResult(
            is_valid_cheque=True,
            sharpness_score=-5.0,  # Out of bounds
            contrast_score=80.0
        )


def test_penny_drop_verification_models():
    req = PennyDropVerificationRequest(
        uan="100982348712",
        account_number="123456789012",
        ifsc_code="SBIN0001234",
        account_holder_name="Ramesh Kumar"
    )
    assert req.uan == "100982348712"
    assert req.ifsc_code == "SBIN0001234"

    resp = PennyDropVerificationResponse(
        success=True,
        npcI_reference_id="NPCI-REF-12345",
        bank_response_code="ACT_VERIFIED_SUCCESS",
        account_exists=True,
        registered_account_name="Ramesh Kumar",
        fuzzy_match_score=100.0,
        is_ready_for_claims=True
    )
    assert resp.success is True
    assert resp.fuzzy_match_score == 100.0
    assert resp.is_ready_for_claims is True


# ==============================================================================
# 5. JOINT DECLARATION, GRIEVANCES & VOICE CONTRACTS
# ==============================================================================
def test_joint_declaration_models():
    correction = JointDeclarationFieldCorrection(
        field_name="full_name",
        existing_value="Ramesh K",
        corrected_value="Ramesh Kumar",
        supporting_document_type="Aadhaar"
    )
    assert correction.field_name == "full_name"

    req = JointDeclarationRequest(
        uan="100982348712",
        member_id="MEM001",
        establishment_id="EST001",
        corrections=[correction],
        citizen_aadhaar_consent=True
    )
    assert len(req.corrections) == 1
    assert req.citizen_aadhaar_consent is True

    resp = JointDeclarationStatusResponse(
        application_id="JD-1234",
        uan="100982348712",
        status="APPROVED_AUTOMATED_3WAY",
        citizen_signed_at=datetime.utcnow(),
        audit_hash="mock_audit_hash"
    )
    assert resp.application_id == "JD-1234"
    assert resp.status == "APPROVED_AUTOMATED_3WAY"


def test_grievance_models():
    req = GrievanceDiagnosisRequest(
        uan="100982348712",
        complaint_category="EXIT",
        complaint_description="Missing date of exit"
    )
    assert req.complaint_category == "EXIT"

    resp = GrievanceDiagnosisResponse(
        uan="100982348712",
        root_cause_identified="Missing DOE",
        error_code_classification="ERR_EPFO_DOE_MISSING",
        automated_fix_available=True,
        recommended_action="Auto-deduce from ECR",
        auto_remediation_status="READY_TO_TRIGGER",
        predicted_resolution_days=1
    )
    assert resp.automated_fix_available is True
    assert resp.predicted_resolution_days == 1


def test_voice_command_models():
    req = VoiceCommandRequest(
        audio_transcript="मुझे पैसे चाहिए",
        detected_language="hi-IN",
        uan_context="100982348712"
    )
    assert req.detected_language == "hi-IN"

    resp = VoiceCommandResponse(
        recognized_intent="EMERGENCY_MEDICAL_ADVANCE",
        target_route="/money",
        spoken_response_text="मैंने फॉर्म तैयार कर दिया है।",
        prefilled_form_data={"amount_requested": 50000.0},
        confidence_score=0.98
    )
    assert resp.recognized_intent == "EMERGENCY_MEDICAL_ADVANCE"
    assert resp.confidence_score == 0.98


def test_route_specific_schemas():
    login_req = LoginRequest(uan="100982348712", otp="123456")
    assert login_req.uan == "100982348712"
    assert login_req.otp == "123456"

    with pytest.raises(ValidationError):
        LoginRequest(uan="123")  # Invalid UAN

    login_resp = LoginResponse(
        access_token="mock.jwt.token",
        token_type="bearer",
        uan="100982348712",
        full_name="Ramesh Kumar",
        masked_phone="+91******3210"
    )
    assert login_resp.token_type == "bearer"

    forecast_req = ForecastRequest(
        current_age=35,
        monthly_employee_contrib=2500.0,
        monthly_employer_contrib=2500.0,
        retirement_age=58,
        interest_rate=8.25
    )
    assert forecast_req.current_age == 35

    with pytest.raises(ValidationError):
        ForecastRequest(current_age=15)  # < 18

    with pytest.raises(ValidationError):
        ForecastRequest(retirement_age=70)  # > 65

    cheque_req = ChequeAnalysisRequest(
        uan="100982348712",
        client_sharpness_score=92.5,
        client_contrast_score=88.0
    )
    assert cheque_req.client_sharpness_score == 92.5
