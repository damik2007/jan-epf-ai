"""
Jan-EPF AI: Smart Cheque OCR & Pre-Validation Route (Agent 2).
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from src.core.data_store import mock_store
from src.core.engine import calculate_fuzzy_name_match, lookup_and_resolve_ifsc
from src.core.schemas import ChequeOCRAnalysisResult

router = APIRouter(prefix="/ocr", tags=["OCR & Document Pre-Validation"])


class ChequeAnalysisRequest(BaseModel):
    uan: str
    image_base64: Optional[str] = None
    extracted_account_number: Optional[str] = "987654321098"
    extracted_ifsc_code: Optional[str] = "SBIN0001234"
    extracted_payee_name: Optional[str] = "Ramesh Kumar"
    client_sharpness_score: float = Field(default=92.5, ge=0, le=100)
    client_contrast_score: float = Field(default=88.0, ge=0, le=100)


@router.post("/analyze-cheque", response_model=ChequeOCRAnalysisResult)
async def analyze_cheque(req: ChequeAnalysisRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {req.uan} not found."
        )

    # 1. Evaluate Sharpness and Contrast
    sharpness = req.client_sharpness_score
    contrast = req.client_contrast_score

    if sharpness < 40.0 or contrast < 35.0:
        return ChequeOCRAnalysisResult(
            is_valid_cheque=False,
            sharpness_score=sharpness,
            contrast_score=contrast,
            extracted_account_number=None,
            extracted_ifsc_code=None,
            extracted_payee_name=None,
            name_match_confidence=0.0,
            ifsc_bank_name=None,
            ifsc_branch_name=None,
            is_fuzzy_name_match_passed=False,
            fallback_used="IMAGE_BLURRY_RECAPTURE_NEEDED"
        )

    # 2. Lookup IFSC
    ifsc_res = lookup_and_resolve_ifsc(req.extracted_ifsc_code or "")

    # 3. Fuzzy Name Match
    payee_name = req.extracted_payee_name or ""
    citizen_name = citizen.get("full_name", "")
    match_score = calculate_fuzzy_name_match(citizen_name, payee_name)
    is_match_passed = match_score >= 80.0

    return ChequeOCRAnalysisResult(
        is_valid_cheque=True,
        sharpness_score=sharpness,
        contrast_score=contrast,
        extracted_account_number=req.extracted_account_number,
        extracted_ifsc_code=req.extracted_ifsc_code,
        extracted_payee_name=payee_name,
        name_match_confidence=match_score,
        ifsc_bank_name=ifsc_res.get("bank_name"),
        ifsc_branch_name="Main Branch",
        is_fuzzy_name_match_passed=is_match_passed,
        fallback_used="CLIENT_CANVAS_TESSERACT_LOCAL"
    )
