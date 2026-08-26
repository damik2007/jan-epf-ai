"""
Jan-EPF AI: Claim Submission & Autonomous Settlement Route (Agent 2).
"""
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from src.core.data_store import mock_store
from src.core.engine import calculate_tds_deduction
from src.core.schemas import (
    ClaimSubmissionRequest,
    ClaimSubmissionResponse,
    ClaimStatus,
    ClaimType
)
from src.core.security import CryptographicSignatureManager
from src.core.telemetry import CLAIMS_TOTAL_COUNTER

router = APIRouter(prefix="/claims", tags=["Claims"])


@router.post("/submit", response_model=ClaimSubmissionResponse)
async def submit_claim(req: ClaimSubmissionRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {req.uan} not found."
        )

    # Calculate TDS if Final Settlement
    tds_amount = 0.0
    if req.claim_type == ClaimType.FINAL_SETTLEMENT:
        service_years = 0.0
        if citizen.get("active_employment"):
            service_years = citizen["active_employment"].get("total_service_years", 0.0)
        tds_calc = calculate_tds_deduction(
            service_years=service_years,
            withdrawal_amount=req.amount_requested,
            pan_linked=bool(citizen.get("pan_masked")),
            form_15g_submitted=req.form_15g_submitted
        )
        tds_amount = tds_calc["tds_amount"]

    sanctioned_amount = max(0.0, req.amount_requested - tds_amount)
    claim_id = f"CLM-{uuid.uuid4().hex[:8].upper()}"

    # Generate immutable cryptographic audit trace
    now_dt = datetime.utcnow()
    audit_data = f"{claim_id}:{req.uan}:{req.claim_type.value}:{sanctioned_amount}:{now_dt.isoformat()}"
    audit_token = CryptographicSignatureManager.generate_audit_hash(audit_data)

    bank_kyc = citizen.get("bank_kyc", {})
    dbt_account = f"{bank_kyc.get('bank_name', 'Bank')} - {bank_kyc.get('account_number_masked', 'XXXX0000')}"

    claim_record = {
        "claim_id": claim_id,
        "uan": req.uan,
        "claim_type": req.claim_type,
        "amount_requested": req.amount_requested,
        "amount_sanctioned": sanctioned_amount,
        "status": ClaimStatus.AUTO_APPROVED,
        "estimated_disbursement_hours": 24,
        "tds_deducted_amount": tds_amount,
        "direct_benefit_transfer_account": dbt_account,
        "audit_trace_token": audit_token,
        "reason_code": req.reason_code,
        "reason_description": req.reason_description,
        "timestamp": now_dt
    }

    mock_store.add_claim(claim_record)

    # Track Prometheus metric
    CLAIMS_TOTAL_COUNTER.labels(
        claim_type=req.claim_type.value,
        status=ClaimStatus.AUTO_APPROVED.value
    ).inc()

    return ClaimSubmissionResponse(**claim_record)


@router.get("/{uan}", response_model=List[ClaimSubmissionResponse])
async def get_claims_by_uan(uan: str):
    claims = mock_store.get_claims_for_uan(uan)
    return [ClaimSubmissionResponse(**c) for c in claims]
