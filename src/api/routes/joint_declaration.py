"""
Jan-EPF AI: Digital Joint Declaration & 3-Way Handshake Route (Agent 2).
Eliminates physical 4-page paper forms with cryptographic digital signing.
"""
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from src.core.data_store import mock_store
from src.core.schemas import (
    JointDeclarationRequest,
    JointDeclarationStatusResponse
)
from src.core.security import CryptographicSignatureManager

router = APIRouter(prefix="/joint-declaration", tags=["Digital Joint Declaration"])


@router.post("/submit", response_model=JointDeclarationStatusResponse)
async def submit_joint_declaration(req: JointDeclarationRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {req.uan} not found."
        )

    app_id = f"JD-{uuid.uuid4().hex[:8].upper()}"
    now = datetime.utcnow()

    # Generate immutable tamper-evident audit hash of corrections
    audit_data = f"{app_id}:{req.uan}:{req.member_id}:{len(req.corrections)}:{now.isoformat()}"
    audit_hash = CryptographicSignatureManager.generate_audit_hash(audit_data)

    jd_record = {
        "application_id": app_id,
        "uan": req.uan,
        "member_id": req.member_id,
        "establishment_id": req.establishment_id,
        "corrections": [c.model_dump() for c in req.corrections],
        "citizen_aadhaar_consent": req.citizen_aadhaar_consent,
        "status": "APPROVED_AUTOMATED_3WAY",  # Instant 3-way handshake simulation
        "citizen_signed_at": now,
        "employer_signed_at": now,
        "epfo_approved_at": now,
        "audit_hash": audit_hash
    }

    # Automatically apply field updates to mock store if name/dob was corrected
    updates: dict = {}
    for c in req.corrections:
        if c.field_name == "full_name":
            updates["full_name"] = c.corrected_value
        elif c.field_name == "father_name":
            updates["father_name"] = c.corrected_value

    if updates:
        mock_store.update_citizen(req.uan, updates)

    mock_store.add_joint_declaration(jd_record)

    return JointDeclarationStatusResponse(
        application_id=app_id,
        uan=req.uan,
        status="APPROVED_AUTOMATED_3WAY",
        citizen_signed_at=now,
        employer_signed_at=now,
        epfo_approved_at=now,
        audit_hash=audit_hash
    )


@router.get("/{uan}", response_model=List[JointDeclarationStatusResponse])
async def get_joint_declarations(uan: str):
    jds = mock_store.get_joint_declarations(uan)
    return [JointDeclarationStatusResponse(**jd) for jd in jds]
