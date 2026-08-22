"""
Jan-EPF AI: Pydantic v2 Domain Schemas Test Suite (Agent 7).
Tests contract validity, regex validators, and domain schemas.
"""
from datetime import date
import pytest
from pydantic import ValidationError
from src.core.schemas import (
    CitizenProfile,
    BankKYC,
    ActiveEmployment,
    PassbookSummary,
    ClaimSubmissionRequest,
    ClaimType,
    KYCStatus,
    PennyDropVerificationRequest,
    ChequeAnalysisRequest,
    JointDeclarationRequest,
    JointDeclarationFieldCorrection,
    GrievanceDiagnosisRequest
)


def test_valid_citizen_profile():
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
        active_employment=ActiveEmployment(
            member_id="KNBLR00123450000098712",
            establishment_name="Precision Auto Components",
            date_of_joining=date(2018, 6, 15),
            total_service_years=8.2
        ),
        passbook_summary=PassbookSummary(
            total_balance=342500.0,
            employee_share=182000.0,
            employer_share=115500.0,
            pension_fund_share=45000.0,
            monthly_wage=26000.0
        )
    )
    assert profile.uan == "100982348712"
    assert profile.full_name == "Ramesh Kumar"
    assert profile.bank_kyc.penny_drop_verified is True


def test_invalid_uan_rejection():
    with pytest.raises(ValidationError):
        CitizenProfile(
            uan="123",  # Invalid UAN length
            full_name="Test Citizen",
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


def test_claim_submission_request():
    req = ClaimSubmissionRequest(
        uan="100982348712",
        claim_type=ClaimType.MEDICAL_ADVANCE,
        amount_requested=50000.0,
        reason_code="PARA_68J_ILLNESS",
        reason_description="Medical treatment"
    )
    assert req.uan == "100982348712"
    assert req.amount_requested == 50000.0
    assert req.claim_type == ClaimType.MEDICAL_ADVANCE


def test_joint_declaration_request():
    req = JointDeclarationRequest(
        uan="100982348712",
        member_id="KNBLR00123450000098712",
        establishment_id="EST12345",
        corrections=[
            JointDeclarationFieldCorrection(
                field_name="full_name",
                existing_value="Ramesh K",
                corrected_value="Ramesh Kumar",
                supporting_document_type="Aadhaar"
            )
        ]
    )
    assert len(req.corrections) == 1
    assert req.corrections[0].corrected_value == "Ramesh Kumar"
