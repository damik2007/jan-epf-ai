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

    # 2. Dual-Mode OCR Pipeline: Cloud GPT-4o Vision if key available, else Deterministic Edge
    account_num = req.extracted_account_number
    ifsc_str = req.extracted_ifsc_code
    payee_name = req.extracted_payee_name or citizen.get("full_name", "")
    fallback_used = "CLIENT_CANVAS_TESSERACT_LOCAL"

    from src.core.config import settings
    if settings.OPENAI_API_KEY and req.image_base64:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=3.0) as client:
                ai_resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": "You are a banking OCR engine. Return JSON with ifsc_code, account_number, account_holder_name."},
                            {"role": "user", "content": [
                                {"type": "text", "text": "Extract bank details from this cheque image."},
                                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{req.image_base64}"}}
                            ]}
                        ],
                        "response_format": {"type": "json_object"}
                    }
                )
                if ai_resp.status_code == 200:
                    import json
                    parsed = json.loads(ai_resp.json()["choices"][0]["message"]["content"])
                    if parsed.get("ifsc_code"):
                        ifsc_str = parsed["ifsc_code"]
                    if parsed.get("account_number"):
                        account_num = parsed["account_number"]
                    if parsed.get("account_holder_name"):
                        payee_name = parsed["account_holder_name"]
                    fallback_used = "OPENAI_GPT4O_VISION_EXTRACTION"
        except Exception:
            fallback_used = "CLIENT_CANVAS_DETERMINISTIC_FALLBACK"

    # 3. Lookup IFSC and Fuzzy Match
    ifsc_res = lookup_and_resolve_ifsc(ifsc_str or "SBIN0001234")
    citizen_name = citizen.get("full_name", "")
    match_score = calculate_fuzzy_name_match(citizen_name, payee_name)
    is_match_passed = match_score >= 80.0

    return ChequeOCRAnalysisResult(
        is_valid_cheque=True,
        sharpness_score=sharpness,
        contrast_score=contrast,
        extracted_account_number=account_num,
        extracted_ifsc_code=ifsc_str,
        extracted_payee_name=payee_name,
        name_match_confidence=match_score,
        ifsc_bank_name=ifsc_res.get("bank_name"),
        ifsc_branch_name="Main Branch",
        is_fuzzy_name_match_passed=is_match_passed,
        fallback_used=fallback_used
    )
