"""
Jan-EPF AI: FastAPI Endpoints Integration Test Suite (Agent 7).
Tests all routes: Auth, Citizens, Claims, Passbook, KYC, OCR, Voice, Joint Declaration, Grievance, Metrics.
"""
import asyncio
import pytest
from httpx import AsyncClient, ASGITransport
from src.api.main import app


def test_health_endpoint():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/health")
            assert res.status_code == 200
            data = res.json()
            assert data["status"] == "HEALTHY"
            assert "resilience_matrix" in data

    asyncio.run(_run())


def test_auth_login():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.post("/api/v1/auth/login", json={"uan": "100982348712", "otp": "123456"})
            assert res.status_code == 200
            data = res.json()
            assert "access_token" in data
            assert data["uan"] == "100982348712"
            assert data["full_name"] == "Ramesh Kumar"

    asyncio.run(_run())


def test_list_citizens_and_eligibility():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/api/v1/citizens/")
            assert res.status_code == 200
            citizens = res.json()
            assert len(citizens) >= 4

            res_elig = await client.get("/api/v1/citizens/100982348712/eligibility")
            assert res_elig.status_code == 200
            elig = res_elig.json()
            assert "medical_advance" in elig
            assert elig["medical_advance"]["eligible"] is True

    asyncio.run(_run())


def test_submit_medical_claim():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {
                "uan": "100982348712",
                "claim_type": "FORM_31_MEDICAL",
                "amount_requested": 40000.0,
                "reason_code": "PARA_68J_ILLNESS",
                "reason_description": "Emergency Hospitalization"
            }
            res = await client.post("/api/v1/claims/submit", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["claim_id"].startswith("CLM-")
            assert data["status"] == "AUTO_APPROVED"
            assert data["amount_sanctioned"] == 40000.0
            assert data["direct_benefit_transfer_account"].startswith("State Bank of India")

    asyncio.run(_run())


def test_passbook_summary_and_forecast():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/api/v1/passbook/100982348712")
            assert res.status_code == 200
            pb = res.json()
            assert "passbook_summary" in pb
            assert "triple_split" in pb

            forecast_res = await client.post(
                "/api/v1/passbook/100982348712/forecast",
                json={
                    "current_age": 45,
                    "monthly_employee_contrib": 3000.0,
                    "monthly_employer_contrib": 3000.0,
                    "retirement_age": 58,
                    "interest_rate": 8.25
                }
            )
            assert forecast_res.status_code == 200
            curve = forecast_res.json()
            assert len(curve) == 14

    asyncio.run(_run())


def test_penny_drop_kyc_verification():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {
                "uan": "100982348712",
                "account_number": "123456789012",
                "ifsc_code": "SBIN0001234",
                "account_holder_name": "Ramesh Kumar"
            }
            res = await client.post("/api/v1/kyc/penny-drop", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["success"] is True
            assert data["fuzzy_match_score"] == 100.0
            assert data["is_ready_for_claims"] is True

    asyncio.run(_run())


def test_cheque_ocr_analysis():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {
                "uan": "100982348712",
                "extracted_account_number": "987654321012",
                "extracted_ifsc_code": "SBIN0001234",
                "extracted_payee_name": "Ramesh Kumar",
                "client_sharpness_score": 92.0,
                "client_contrast_score": 88.0
            }
            res = await client.post("/api/v1/ocr/analyze-cheque", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["is_valid_cheque"] is True
            assert data["is_fuzzy_name_match_passed"] is True

    asyncio.run(_run())


def test_voice_intent_routing():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.post(
                "/api/v1/voice/intent",
                json={
                    "audio_transcript": "मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं",
                    "detected_language": "hi-IN",
                    "uan_context": "100982348712"
                }
            )
            assert res.status_code == 200
            data = res.json()
            assert data["recognized_intent"] == "EMERGENCY_MEDICAL_ADVANCE"
            assert data["target_route"] == "/money"

    asyncio.run(_run())


def test_joint_declaration_3way_handshake():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {
                "uan": "100982348712",
                "member_id": "KNBLR00123450000098712",
                "establishment_id": "EST12345",
                "corrections": [
                    {
                        "field_name": "full_name",
                        "existing_value": "Ramesh K",
                        "corrected_value": "Ramesh Kumar",
                        "supporting_document_type": "Aadhaar Card"
                    }
                ],
                "citizen_aadhaar_consent": True
            }
            res = await client.post("/api/v1/joint-declaration/submit", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["status"] == "APPROVED_AUTOMATED_3WAY"
            assert "audit_hash" in data

    asyncio.run(_run())


def test_grievance_copilot_diagnosis():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {
                "uan": "100982348712",
                "complaint_category": "DATE_OF_EXIT",
                "complaint_description": "My claim was rejected because employer failed to update date of exit."
            }
            res = await client.post("/api/v1/grievances/diagnose", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["error_code_classification"] == "ERR_EPFO_DOE_MISSING"
            assert data["automated_fix_available"] is True

    asyncio.run(_run())


def test_prometheus_metrics_endpoint():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            res = await client.get("/metrics")
            assert res.status_code == 200
            assert b"jan_epf_http_request_duration_seconds" in res.content

    asyncio.run(_run())
