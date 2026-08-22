"""
Jan-EPF AI: 1-Click Penny-Drop & Bank KYC Verification Route (Agent 2).
"""
import uuid
from fastapi import APIRouter, HTTPException, status
from src.core.data_store import mock_store
from src.core.engine import calculate_fuzzy_name_match, lookup_and_resolve_ifsc
from src.core.schemas import (
    PennyDropVerificationRequest,
    PennyDropVerificationResponse
)

router = APIRouter(prefix="/kyc", tags=["KYC & Banking"])


@router.post("/penny-drop", response_model=PennyDropVerificationResponse)
async def verify_bank_account_penny_drop(req: PennyDropVerificationRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {req.uan} not found."
        )

    # Perform IFSC lookup
    ifsc_res = lookup_and_resolve_ifsc(req.ifsc_code)
    if not ifsc_res["valid_syntax"]:
        return PennyDropVerificationResponse(
            success=False,
            npcI_reference_id=f"NPCI-ERR-{uuid.uuid4().hex[:6].upper()}",
            bank_response_code="INVALID_IFSC",
            account_exists=False,
            registered_account_name="",
            fuzzy_match_score=0.0,
            is_ready_for_claims=False
        )

    # Calculate Levenshtein Fuzzy Match between registered citizen name and bank name
    fuzzy_score = calculate_fuzzy_name_match(citizen["full_name"], req.account_holder_name)
    is_match_passed = fuzzy_score >= 80.0

    # Auto-update citizen bank KYC status in memory store
    if is_match_passed:
        mock_store.update_citizen(req.uan, {
            "bank_kyc": {
                "bank_name": ifsc_res["bank_name"],
                "account_number_masked": f"XXXXXX{req.account_number[-4:] if len(req.account_number) >= 4 else '0000'}",
                "ifsc_code": req.ifsc_code.upper(),
                "kyc_status": "VERIFIED_ACTIVE",
                "penny_drop_verified": True,
                "verified_holder_name": req.account_holder_name
            }
        })

    return PennyDropVerificationResponse(
        success=is_match_passed,
        npcI_reference_id=f"NPCI-{uuid.uuid4().hex[:10].upper()}",
        bank_response_code="ACT_VERIFIED_SUCCESS" if is_match_passed else "NAME_MISMATCH_SUSPECT",
        account_exists=True,
        registered_account_name=req.account_holder_name,
        fuzzy_match_score=fuzzy_score,
        is_ready_for_claims=is_match_passed
    )


@router.get("/ifsc/{ifsc_code}")
async def lookup_ifsc(ifsc_code: str):
    return lookup_and_resolve_ifsc(ifsc_code)
