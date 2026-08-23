"""
Jan-EPF AI: Admin, Employer & 3-Way Digital Joint Declaration Workflow Test Suite.
Tests:
1. 3-Way Digital Handshake: Citizen -> Employer DSC -> EPFO Field Officer Approval
2. Cryptographic Immutable SHA-256 Ledger Audit Verification
3. 6 Critical Substitute Employee Resilience Failover Triggers
"""
import pytest
from httpx import AsyncClient, ASGITransport
from src.api.main import app as gateway_app
from src.core.resilience import SubsystemType, resilience_orchestrator
from src.core.security import CryptographicSignatureManager


@pytest.fixture
def anyio_backend():
    return "asyncio"


# ==============================================================================
# 1. 3-WAY DIGITAL JOINT DECLARATION HANDSHAKE
# ==============================================================================
@pytest.mark.asyncio
async def test_3way_joint_declaration_handshake():
    uan = "100982348712"
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Step 1: Citizen submits name correction with Aadhaar consent
        submit_res = await client.post("/api/v1/joint-declaration/submit", json={
            "uan": uan,
            "member_id": "MHBOM00982340000891",
            "establishment_id": "MHBOM0098234",
            "corrections": [
                {
                    "field_name": "full_name",
                    "existing_value": "Ramesh Kumaar",
                    "corrected_value": "Ramesh Kumar",
                    "supporting_document_type": "Aadhaar"
                }
            ],
            "citizen_aadhaar_consent": True
        })
        assert submit_res.status_code == 200
        jd_data = submit_res.json()
        assert jd_data["application_id"].startswith("JD-")
        assert jd_data["status"] in ["PENDING_EMPLOYER_ESIGN", "APPROVED_AUTOMATED_3WAY"]
        assert len(jd_data["audit_hash"]) == 64  # SHA-256 hex string

        # Step 2: Query status by UAN
        status_res = await client.get(f"/api/v1/joint-declaration/{uan}")
        assert status_res.status_code == 200
        records = status_res.json()
        assert len(records) >= 1
        assert records[0]["application_id"] == jd_data["application_id"]


# ==============================================================================
# 2. CRYPTOGRAPHIC IMMUTABLE SHA-256 LEDGER VERIFICATION
# ==============================================================================
def test_cryptographic_audit_ledger_integrity():
    claim_id = "CLM-8F7A1290"
    uan = "100982348712"
    amount = 50000.00
    timestamp = "2026-08-22T10:00:00Z"

    ledger_entry = f"{claim_id}:{uan}:{amount}:{timestamp}"
    audit_hash = CryptographicSignatureManager.generate_audit_hash(ledger_entry)

    # Hash should be 64 characters long (SHA-256)
    assert len(audit_hash) == 64
    assert audit_hash == CryptographicSignatureManager.generate_audit_hash(ledger_entry)

    # Tampered amount changes hash completely
    tampered_entry = f"{claim_id}:{uan}:999999.00:{timestamp}"
    assert audit_hash != CryptographicSignatureManager.generate_audit_hash(tampered_entry)


# ==============================================================================
# 3. SUBSTITUTE EMPLOYEE RESILIENCE MATRIX
# ==============================================================================
def test_substitute_employee_resilience_matrix():
    status_matrix = resilience_orchestrator.get_status_matrix()
    assert len(status_matrix) == 6

    # Verify all 6 substitute rules are configured
    for sub in SubsystemType:
        assert sub.value in status_matrix
        assert "hot_substitute" in status_matrix[sub.value]
