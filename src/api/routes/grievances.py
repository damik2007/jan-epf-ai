import json
import uuid
from datetime import datetime
import httpx
from fastapi import APIRouter, HTTPException, status
from src.core.config import settings
from src.core.data_store import mock_store
from src.core.engine import triage_grievance_root_cause, prune_context_with_tiktoken
from src.core.schemas import (
    GrievanceDiagnosisRequest,
    GrievanceDiagnosisResponse
)
from src.core.security import AntiHallucinationGuard

router = APIRouter(prefix="/grievances", tags=["Grievances & AI Copilot"])


@router.post("/diagnose", response_model=GrievanceDiagnosisResponse)
async def diagnose_grievance(req: GrievanceDiagnosisRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {req.uan} not found."
        )

    # 1. Prune description with tiktoken to enforce strict token budget (<256 tokens)
    clean_desc, token_count = prune_context_with_tiktoken(req.complaint_description or "", max_tokens=256)

    # 2. Check if LLM API Key is configured for deep generative triage
    api_key = settings.LLM_API_KEY or settings.OPENAI_API_KEY
    if api_key:
        try:
            prompt = (
                f"You are Jan-EPF AI Grievance Copilot. Analyze the citizen grievance for UAN {req.uan}.\n"
                f"Category: {req.complaint_category}\n"
                f"Description (Tokens: {token_count}): {clean_desc}\n"
                f"Return JSON strictly conforming to: root_cause_identified (str), error_code_classification (str), "
                f"automated_fix_available (bool), recommended_action (str), predicted_resolution_days (int)."
            )
            async with httpx.AsyncClient(timeout=2.5) as client:
                llm_resp = await client.post(
                    f"{settings.LLM_API_BASE_URL}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": settings.LLM_MODEL,
                        "messages": [
                            {"role": "system", "content": "You are an expert EPFO compliance and claims arbitrator."},
                            {"role": "user", "content": prompt}
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.1
                    }
                )
                if llm_resp.status_code == 200:
                    data = llm_resp.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    parsed["uan"] = req.uan
                    return AntiHallucinationGuard.validate_or_correct(GrievanceDiagnosisResponse, parsed)
        except Exception:
            # Fall back safely to deterministic sovereign engine
            pass

    # 2. Deterministic Sovereign Engine Fallback (Sub-5ms, $0 cost)
    diagnosis = triage_grievance_root_cause(
        uan=req.uan,
        complaint_category=req.complaint_category,
        complaint_text=req.complaint_description,
        citizen=citizen
    )

    return GrievanceDiagnosisResponse(
        uan=req.uan,
        root_cause_identified=diagnosis["root_cause_identified"],
        error_code_classification=diagnosis["error_code_classification"],
        automated_fix_available=diagnosis["automated_fix_available"],
        recommended_action=diagnosis["recommended_action"],
        auto_remediation_status="READY_TO_TRIGGER",
        predicted_resolution_days=diagnosis["predicted_resolution_days"]
    )


@router.post("/lodge")
async def lodge_grievance(req: GrievanceDiagnosisRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {req.uan} not found."
        )

    g_id = f"GRV-{uuid.uuid4().hex[:8].upper()}"
    diagnosis = triage_grievance_root_cause(
        uan=req.uan,
        complaint_category=req.complaint_category,
        complaint_text=req.complaint_description,
        citizen=citizen
    )

    record = {
        "grievance_id": g_id,
        "uan": req.uan,
        "category": req.complaint_category,
        "description": req.complaint_description,
        "diagnosis": diagnosis,
        "status": "AUTO_REMEDIATED" if diagnosis["automated_fix_available"] else "COMMISSIONER_PRIORITY_QUEUE",
        "sla_target_hours": 48,
        "lodged_at": datetime.utcnow().isoformat()
    }
    mock_store.add_grievance(record)

    return {
        "success": True,
        "grievance_id": g_id,
        "status": record["status"],
        "message": f"Grievance diagnosed and assigned SLA tracking ({record['sla_target_hours']} hours)."
    }


@router.get("/{uan}")
async def get_grievances(uan: str):
    return mock_store.get_grievances(uan)
