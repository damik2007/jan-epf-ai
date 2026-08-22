"""
Jan-EPF AI: AI Grievance Copilot (EPFiGMS Modernization) Route (Agent 2).
"""
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from src.core.data_store import mock_store
from src.core.engine import triage_grievance_root_cause
from src.core.schemas import (
    GrievanceDiagnosisRequest,
    GrievanceDiagnosisResponse
)

router = APIRouter(prefix="/grievances", tags=["Grievances & AI Copilot"])


@router.post("/diagnose", response_model=GrievanceDiagnosisResponse)
async def diagnose_grievance(req: GrievanceDiagnosisRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {req.uan} not found."
        )

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
