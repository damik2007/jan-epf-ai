"""
Jan-EPF AI: Pydantic v2 Core Domain Schemas & Contracts (RFC-001).
Strict data validation models for Citizens, Claims, Passbooks, KYC, OCR, Grievances, and Joint Declarations.
"""
from datetime import date, datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ==============================================================================
# ENUMS & CONSTANTS
# ==============================================================================
class ClaimType(str, Enum):
    MEDICAL_ADVANCE = "FORM_31_MEDICAL"
    HOUSING_ADVANCE = "FORM_31_HOUSING"
    MARRIAGE_ADVANCE = "FORM_31_MARRIAGE"
    PF_TRANSFER = "FORM_13_TRANSFER"
    FINAL_SETTLEMENT = "FORM_19_10C_SETTLEMENT"
    PENSION_CLAIM = "FORM_10D_PENSION"
    LIFE_CERTIFICATE = "JEEVAN_PRAMAAN"
    E_NOMINATION = "E_NOMINATION"
    JOINT_DECLARATION = "JOINT_DECLARATION"


class ClaimStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    IN_REVIEW = "IN_REVIEW"
    AUTO_APPROVED = "AUTO_APPROVED"
    DISBURSED = "DISBURSED"
    REJECTED = "REJECTED"


class KYCStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED_BY_EMPLOYER = "APPROVED_BY_EMPLOYER"
    VERIFIED_ACTIVE = "VERIFIED_ACTIVE"
    SENIOR_PENSION_ACTIVE = "SENIOR_PENSION_ACTIVE"
    REJECTED = "REJECTED"


class TopicHub(str, Enum):
    MONEY = "money"
    CAREER = "career"
    SAVINGS = "savings"
    FIX = "fix"


# ==============================================================================
# CITIZEN IDENTITY & BANKING MODELS
# ==============================================================================
class BankKYC(BaseModel):
    bank_name: str
    account_number_masked: str
    ifsc_code: str
    kyc_status: KYCStatus
    penny_drop_verified: bool = False
    verified_holder_name: Optional[str] = None


class EmploymentHistoryItem(BaseModel):
    member_id: str
    establishment_name: str
    date_of_joining: date
    date_of_exit: Optional[date] = None
    balance: float = 0.0
    transfer_status: str = "PENDING_MERGE"
    last_ecr_wage_month: Optional[date] = None
    exit_date_deduced: Optional[date] = None


class ActiveEmployment(BaseModel):
    member_id: str
    establishment_name: str
    date_of_joining: date
    date_of_exit: Optional[date] = None
    total_service_years: float = 0.0


class PassbookSummary(BaseModel):
    total_balance: float
    employee_share: float
    employer_share: float
    pension_fund_share: float
    interest_credited_current_fy: float = 0.0
    last_contribution_date: Optional[date] = None
    monthly_wage: float = 0.0
    interest_rate: float = 8.25
    settled_at_retirement: bool = False


class PensionDetails(BaseModel):
    ppo_number: str
    scheme: str = "EPS-95"
    monthly_pension_amount: float
    pension_start_date: date
    last_disbursement_date: Optional[date] = None
    life_certificate_status: str
    life_certificate_expiry: Optional[date] = None


class Nominee(BaseModel):
    name: str
    relationship: str
    dob: Optional[date] = None
    share_percent: int = 100
    aadhaar_masked: Optional[str] = None
    guardian_name: Optional[str] = None


class NominationDetails(BaseModel):
    nomination_filed: bool
    filed_date: Optional[date] = None
    nominees: List[Nominee] = []
    suggested_nominee: Optional[Nominee] = None


class InsuranceDetails(BaseModel):
    edli_coverage_amount: float = 700000.0
    status: str = "ACTIVE_COVERED"


class CitizenProfile(BaseModel):
    uan: str = Field(..., pattern=r"^\d{12}$", description="12-digit Universal Account Number")
    full_name: str
    phone: str = Field(..., pattern=r"^\+91\d{10}$")
    dob: date
    gender: str
    father_name: str
    aadhaar_masked: str
    pan_masked: str
    bank_kyc: BankKYC
    active_employment: Optional[ActiveEmployment] = None
    employment_history: List[EmploymentHistoryItem] = []
    passbook_summary: PassbookSummary
    pension_details: Optional[PensionDetails] = None
    nomination_details: Optional[NominationDetails] = None
    insurance_details: InsuranceDetails = Field(default_factory=InsuranceDetails)
    eligible_claims: Dict[str, Any] = {}


# ==============================================================================
# CLAIM CREATION & SETTLEMENT CONTRACTS
# ==============================================================================
class ClaimSubmissionRequest(BaseModel):
    uan: str
    claim_type: ClaimType
    amount_requested: float = Field(..., gt=0)
    reason_code: str
    reason_description: Optional[str] = None
    bank_account_verified: bool = True
    uploaded_cheque_extracted_name: Optional[str] = None
    uploaded_cheque_extracted_ifsc: Optional[str] = None
    form_15g_submitted: bool = False
    source_member_id: Optional[str] = None
    target_member_id: Optional[str] = None


class ClaimSubmissionResponse(BaseModel):
    claim_id: str
    uan: str
    claim_type: ClaimType
    amount_sanctioned: float
    status: ClaimStatus
    estimated_disbursement_hours: int = 24
    tds_deducted_amount: float = 0.0
    direct_benefit_transfer_account: str
    audit_trace_token: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ==============================================================================
# CHEQUE OCR & PENNY DROP VERIFICATION CONTRACTS
# ==============================================================================
class ChequeAnalysisRequest(BaseModel):
    uan: str
    image_base64: Optional[str] = None
    extracted_account_number: Optional[str] = "987654321098"
    extracted_ifsc_code: Optional[str] = "SBIN0001234"
    extracted_payee_name: Optional[str] = "Ramesh Kumar"
    client_sharpness_score: float = Field(default=92.5, ge=0, le=100)
    client_contrast_score: float = Field(default=88.0, ge=0, le=100)


class ChequeOCRAnalysisResult(BaseModel):
    is_valid_cheque: bool
    sharpness_score: float = Field(..., ge=0.0, le=100.0)
    contrast_score: float = Field(..., ge=0.0, le=100.0)
    extracted_account_number: Optional[str] = None
    extracted_ifsc_code: Optional[str] = None
    extracted_payee_name: Optional[str] = None
    name_match_confidence: float = Field(default=0.0, ge=0.0, le=100.0)
    ifsc_bank_name: Optional[str] = None
    ifsc_branch_name: Optional[str] = None
    is_fuzzy_name_match_passed: bool = False
    fallback_used: str = "CLIENT_CANVAS_TESSERACT"


class PennyDropVerificationRequest(BaseModel):
    uan: str
    account_number: str
    ifsc_code: str
    account_holder_name: str


class PennyDropVerificationResponse(BaseModel):
    success: bool
    npcI_reference_id: str
    bank_response_code: str
    account_exists: bool
    registered_account_name: str
    fuzzy_match_score: float
    is_ready_for_claims: bool


# ==============================================================================
# DIGITAL JOINT DECLARATION CONTRACTS (3-WAY HANDSHAKE)
# ==============================================================================
class JointDeclarationFieldCorrection(BaseModel):
    field_name: str  # e.g., "full_name", "dob", "father_name", "date_of_joining"
    existing_value: str
    corrected_value: str
    supporting_document_type: str  # e.g., "Aadhaar", "Passport", "Birth Certificate"


class JointDeclarationRequest(BaseModel):
    uan: str
    member_id: str
    establishment_id: str
    corrections: List[JointDeclarationFieldCorrection]
    citizen_aadhaar_consent: bool = True


class JointDeclarationStatusResponse(BaseModel):
    application_id: str
    uan: str
    status: str  # PENDING_EMPLOYER_ESIGN, PENDING_EPFO_APPROVAL, APPROVED
    citizen_signed_at: datetime
    employer_signed_at: Optional[datetime] = None
    epfo_approved_at: Optional[datetime] = None
    audit_hash: str


# ==============================================================================
# GRIEVANCE & COPILOT DIAGNOSIS CONTRACTS
# ==============================================================================
class GrievanceDiagnosisRequest(BaseModel):
    uan: str
    complaint_category: str
    complaint_description: str
    model_override: Optional[str] = None


class GrievanceDiagnosisResponse(BaseModel):
    uan: str
    root_cause_identified: str
    error_code_classification: str
    automated_fix_available: bool
    recommended_action: str
    auto_remediation_status: Optional[str] = None
    predicted_resolution_days: int = 1
    model_served: Optional[str] = "DETERMINISTIC_SOVEREIGN_CORE"
    tokens_ingested: Optional[int] = 0
    inference_latency_ms: Optional[float] = 0.0


# ==============================================================================
# VOICE ASSISTANT & INTENT PARSING CONTRACTS
# ==============================================================================
class VoiceCommandRequest(BaseModel):
    audio_transcript: Optional[str] = None
    raw_audio_base64: Optional[str] = None
    detected_language: str = "hi-IN"  # hi-IN, te-IN, ta-IN, en-IN
    uan_context: Optional[str] = None


class VoiceCommandResponse(BaseModel):
    recognized_intent: str  # e.g., "CHECK_BALANCE", "MEDICAL_ADVANCE", "TRANSFER_PF", "FIX_NAME"
    target_route: str  # e.g., "/money", "/savings", "/career", "/fix"
    spoken_response_text: str
    prefilled_form_data: Dict[str, Any] = {}
    confidence_score: float = 0.95
