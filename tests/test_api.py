"""
Jan-EPF AI: Exhaustive Async FastAPI Endpoints Integration Test Suite (Agent 2 & Agent 7).
Tests all 20+ endpoints: /health, /metrics, /, /auth/login, /auth/verify-token,
/citizens/, /citizens/{uan}, /citizens/{uan}/eligibility,
/claims/submit, /claims/{uan},
/passbook/{uan}, /passbook/{uan}/forecast,
/kyc/penny-drop, /kyc/ifsc/{ifsc},
/ocr/analyze-cheque,
/voice/intent,
/joint-declaration/submit, /joint-declaration/{uan},
/grievances/diagnose, /grievances/lodge, /grievances/{uan}, and main_app entrypoint.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from src.api.main import app as gateway_app
from src.main import app as main_app
from src.core.security import SecurityTokenManager


@pytest.fixture
def anyio_backend():
    return "asyncio"


# ==============================================================================
# 1. SYSTEM & OBSERVABILITY ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_health_check_endpoint():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "HEALTHY"
        assert "app_name" in data
        assert "resilience_matrix" in data
        assert "VOICE_INGEST" in data["resilience_matrix"]


@pytest.mark.asyncio
async def test_prometheus_metrics_endpoint():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        res = await client.get("/metrics")
        assert res.status_code == 200
        assert b"jan_epf_http_request_duration_seconds" in res.content


@pytest.mark.asyncio
async def test_root_index_endpoint():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        res = await client.get("/")
        assert res.status_code == 200
        data = res.json()
        assert "Jan-EPF AI" in data["message"]
        assert data["health"] == "/health"


@pytest.mark.asyncio
async def test_main_app_entrypoint():
    async with AsyncClient(transport=ASGITransport(app=main_app), base_url="http://test") as client:
        res_root = await client.get("/")
        assert res_root.status_code == 200
        res_health = await client.get("/health")
        assert res_health.status_code == 200
        res_metrics = await client.get("/metrics")
        assert res_metrics.status_code == 200
        res_auth = await client.post("/api/v1/auth/login", json={"uan": "100982348712", "otp": "123456"})
        assert res_auth.status_code == 200


# ==============================================================================
# 2. AUTHENTICATION ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_auth_login_success_and_failures():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Success login
        res = await client.post("/api/v1/auth/login", json={"uan": "100982348712", "otp": "123456"})
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["uan"] == "100982348712"
        assert data["full_name"] == "Ramesh Kumar"
        assert data["masked_phone"].startswith("+91******")

        # Unknown UAN -> 404
        res_404 = await client.post("/api/v1/auth/login", json={"uan": "999999999999", "otp": "123456"})
        assert res_404.status_code == 404

        # Invalid UAN format -> 422
        res_422 = await client.post("/api/v1/auth/login", json={"uan": "123", "otp": "123456"})
        assert res_422.status_code == 422


@pytest.mark.asyncio
async def test_auth_verify_token():
    valid_token = SecurityTokenManager.create_access_token({"sub": "100982348712", "name": "Ramesh Kumar"})
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Valid token
        res = await client.get(f"/api/v1/auth/verify-token?token={valid_token}")
        assert res.status_code == 200
        data = res.json()
        assert data["valid"] is True
        assert data["payload"]["sub"] == "100982348712"

        # Invalid token -> 401
        res_bad = await client.get("/api/v1/auth/verify-token?token=invalid.jwt.token")
        assert res_bad.status_code == 401


# ==============================================================================
# 3. CITIZEN PERSONAS & ELIGIBILITY ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_citizens_list_and_get():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # List all citizens
        res = await client.get("/api/v1/citizens/")
        assert res.status_code == 200
        citizens = res.json()
        assert len(citizens) >= 4
        # Assert PII is sanitized
        for c in citizens:
            assert "XXXX-XXXX-" in c["aadhaar_masked"]
            assert "****" in c["pan_masked"]

        # Get existing citizen
        res_c = await client.get("/api/v1/citizens/100982348712")
        assert res_c.status_code == 200
        assert res_c.json()["full_name"] == "Ramesh Kumar"

        # Get non-existent citizen -> 404
        res_non = await client.get("/api/v1/citizens/999999999999")
        assert res_non.status_code == 404


@pytest.mark.asyncio
async def test_citizens_eligibility():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        res = await client.get("/api/v1/citizens/100982348712/eligibility")
        assert res.status_code == 200
        elig = res.json()
        assert elig["uan"] == "100982348712"
        assert elig["medical_advance"]["eligible"] is True
        assert elig["housing_advance"]["eligible"] is True
        assert elig["marriage_advance"]["eligible"] is True
        assert elig["total_pf_balance"] > 0

        # Non-existent citizen -> 404
        res_404 = await client.get("/api/v1/citizens/999999999999/eligibility")
        assert res_404.status_code == 404


# ==============================================================================
# 4. CLAIMS SUBMISSION & HISTORY ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_claims_submit_medical_advance():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        payload = {
            "uan": "100982348712",
            "claim_type": "FORM_31_MEDICAL",
            "amount_requested": 40000.0,
            "reason_code": "PARA_68J_ILLNESS",
            "reason_description": "Hospitalization expense"
        }
        res = await client.post("/api/v1/claims/submit", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["claim_id"].startswith("CLM-")
        assert data["status"] == "AUTO_APPROVED"
        assert data["amount_sanctioned"] == 40000.0
        assert data["tds_deducted_amount"] == 0.0
        assert "audit_trace_token" in data
        assert len(data["audit_trace_token"]) == 64


@pytest.mark.asyncio
async def test_claims_submit_final_settlement_with_tds():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Priya Sharma has 3.0 service years -> Final settlement >= 50k has 10% TDS without 15G
        payload = {
            "uan": "101294817203",
            "claim_type": "FORM_19_10C_SETTLEMENT",
            "amount_requested": 100000.0,
            "reason_code": "RETIREMENT_OR_JOB_LEAVE",
            "form_15g_submitted": False
        }
        res = await client.post("/api/v1/claims/submit", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["tds_deducted_amount"] == 10000.0
        assert data["amount_sanctioned"] == 90000.0


@pytest.mark.asyncio
async def test_claims_submit_unknown_uan():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        payload = {
            "uan": "999999999999",
            "claim_type": "FORM_31_MEDICAL",
            "amount_requested": 10000.0,
            "reason_code": "PARA_68J_ILLNESS"
        }
        res = await client.post("/api/v1/claims/submit", json=payload)
        assert res.status_code == 404


@pytest.mark.asyncio
async def test_claims_history_by_uan():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        res = await client.get("/api/v1/claims/100982348712")
        assert res.status_code == 200
        claims = res.json()
        assert isinstance(claims, list)
        assert len(claims) >= 1


# ==============================================================================
# 5. PASSBOOK & FORECAST ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_passbook_summary_and_forecast():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Get passbook
        res = await client.get("/api/v1/passbook/100982348712")
        assert res.status_code == 200
        pb = res.json()
        assert pb["full_name"] == "Ramesh Kumar"
        assert "passbook_summary" in pb
        assert "triple_split" in pb
        assert "insurance_card" in pb

        # Unknown citizen passbook -> 404
        res_404 = await client.get("/api/v1/passbook/999999999999")
        assert res_404.status_code == 404

        # Forecast passbook growth
        f_payload = {
            "current_age": 40,
            "monthly_employee_contrib": 3000.0,
            "monthly_employer_contrib": 3000.0,
            "retirement_age": 58,
            "interest_rate": 8.25
        }
        f_res = await client.post("/api/v1/passbook/100982348712/forecast", json=f_payload)
        assert f_res.status_code == 200
        curve = f_res.json()
        assert len(curve) == 19  # Age 40 through 58 inclusive
        assert curve[0]["age"] == 40
        assert curve[-1]["age"] == 58

        # Forecast unknown citizen -> 404
        f_res_404 = await client.post("/api/v1/passbook/999999999999/forecast", json=f_payload)
        assert f_res_404.status_code == 404


# ==============================================================================
# 6. KYC & BANKING ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_kyc_penny_drop_verification():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Success matching name
        payload_ok = {
            "uan": "100982348712",
            "account_number": "123456789012",
            "ifsc_code": "SBIN0001234",
            "account_holder_name": "Ramesh Kumar"
        }
        res_ok = await client.post("/api/v1/kyc/penny-drop", json=payload_ok)
        assert res_ok.status_code == 200
        data_ok = res_ok.json()
        assert data_ok["success"] is True
        assert data_ok["fuzzy_match_score"] == 100.0
        assert data_ok["bank_response_code"] == "ACT_VERIFIED_SUCCESS"
        assert data_ok["is_ready_for_claims"] is True

        # Invalid IFSC
        payload_bad_ifsc = {
            "uan": "100982348712",
            "account_number": "123456789012",
            "ifsc_code": "INVALID",
            "account_holder_name": "Ramesh Kumar"
        }
        res_bad_ifsc = await client.post("/api/v1/kyc/penny-drop", json=payload_bad_ifsc)
        assert res_bad_ifsc.status_code == 200
        assert res_bad_ifsc.json()["success"] is False
        assert res_bad_ifsc.json()["bank_response_code"] == "INVALID_IFSC"

        # Name Mismatch
        payload_mismatch = {
            "uan": "100982348712",
            "account_number": "123456789012",
            "ifsc_code": "SBIN0001234",
            "account_holder_name": "Vikram Malhotra"
        }
        res_mismatch = await client.post("/api/v1/kyc/penny-drop", json=payload_mismatch)
        assert res_mismatch.status_code == 200
        assert res_mismatch.json()["success"] is False
        assert res_mismatch.json()["bank_response_code"] == "NAME_MISMATCH_SUSPECT"

        # Unknown citizen -> 404
        payload_404 = payload_ok.copy()
        payload_404["uan"] = "999999999999"
        res_404 = await client.post("/api/v1/kyc/penny-drop", json=payload_404)
        assert res_404.status_code == 404


@pytest.mark.asyncio
async def test_kyc_ifsc_lookup():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Merged IFSC
        res_merged = await client.get("/api/v1/kyc/ifsc/ALLA0001234")
        assert res_merged.status_code == 200
        assert res_merged.json()["is_merged"] is True
        assert res_merged.json()["bank_name"] == "Indian Bank"

        # Active direct IFSC
        res_direct = await client.get("/api/v1/kyc/ifsc/HDFC0000060")
        assert res_direct.status_code == 200
        assert res_direct.json()["is_merged"] is False
        assert res_direct.json()["bank_name"] == "HDFC Bank"


# ==============================================================================
# 7. CHEQUE OCR & DOCUMENT ANALYSIS ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_cheque_ocr_analysis():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Sharp valid cheque matching Ramesh Kumar
        payload_sharp = {
            "uan": "100982348712",
            "extracted_account_number": "987654321012",
            "extracted_ifsc_code": "SBIN0001234",
            "extracted_payee_name": "Ramesh Kumar",
            "client_sharpness_score": 92.0,
            "client_contrast_score": 88.0
        }
        res = await client.post("/api/v1/ocr/analyze-cheque", json=payload_sharp)
        assert res.status_code == 200
        data = res.json()
        assert data["is_valid_cheque"] is True
        assert data["is_fuzzy_name_match_passed"] is True
        assert data["ifsc_bank_name"] == "State Bank of India"

        # Blurry cheque (< 40 sharpness)
        payload_blurry = payload_sharp.copy()
        payload_blurry["client_sharpness_score"] = 25.0
        res_blurry = await client.post("/api/v1/ocr/analyze-cheque", json=payload_blurry)
        assert res_blurry.status_code == 200
        assert res_blurry.json()["is_valid_cheque"] is False
        assert res_blurry.json()["fallback_used"] == "IMAGE_BLURRY_RECAPTURE_NEEDED"

        # Unknown UAN -> 404
        payload_404 = payload_sharp.copy()
        payload_404["uan"] = "999999999999"
        res_404 = await client.post("/api/v1/ocr/analyze-cheque", json=payload_404)
        assert res_404.status_code == 404


# ==============================================================================
# 8. VOICE ASSISTANT & INTENT ROUTING ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_voice_intent_routes():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Hindi Medical Intent
        res_hi = await client.post(
            "/api/v1/voice/intent",
            json={
                "audio_transcript": "मुझे मेडिकल इमरजेंसी के लिए पैसे निकालने हैं",
                "detected_language": "hi-IN",
                "uan_context": "100982348712"
            }
        )
        assert res_hi.status_code == 200
        assert res_hi.json()["recognized_intent"] == "EMERGENCY_MEDICAL_ADVANCE"
        assert res_hi.json()["target_route"] == "/money"
        assert "इमरजेंसी मेडिकल एडवांस" in res_hi.json()["spoken_response_text"]

        # Telugu Transfer Intent
        res_te = await client.post(
            "/api/v1/voice/intent",
            json={
                "audio_transcript": "నా పాత కంపెనీ PF బ్యాలెన్స్ బదిలీ చేయాలి",
                "detected_language": "te-IN"
            }
        )
        assert res_te.status_code == 200
        assert res_te.json()["recognized_intent"] == "TRANSFER_PF_BALANCE"
        assert res_te.json()["target_route"] == "/career"

        # Tamil Savings Intent
        res_ta = await client.post(
            "/api/v1/voice/intent",
            json={
                "audio_transcript": "என் பாஸ்புக் மற்றும் சேமிப்பு விவரங்கள் காட்டுங்கள்",
                "detected_language": "ta-IN"
            }
        )
        assert res_ta.status_code == 200
        assert res_ta.json()["recognized_intent"] == "VIEW_PASSBOOK_GROWTH"
        assert res_ta.json()["target_route"] == "/savings"

        # English Fix Details Intent
        res_en = await client.post(
            "/api/v1/voice/intent",
            json={
                "audio_transcript": "I need to fix my name and bank KYC details",
                "detected_language": "en-IN"
            }
        )
        assert res_en.status_code == 200
        assert res_en.json()["recognized_intent"] == "FIX_MEMBER_DETAILS"
        assert res_en.json()["target_route"] == "/fix"

        # Default fallback
        res_gen = await client.post(
            "/api/v1/voice/intent",
            json={
                "audio_transcript": "Random conversation",
                "detected_language": "en-IN"
            }
        )
        assert res_gen.status_code == 200
        assert res_gen.json()["recognized_intent"] == "GENERAL_EPFO_ASSISTANCE"


# ==============================================================================
# 9. DIGITAL JOINT DECLARATION & 3-WAY HANDSHAKE ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_joint_declaration_submit_and_get():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
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
                },
                {
                    "field_name": "father_name",
                    "existing_value": "Ram P Kumar",
                    "corrected_value": "Ram Prasad Kumar",
                    "supporting_document_type": "Aadhaar Card"
                }
            ],
            "citizen_aadhaar_consent": True
        }
        res = await client.post("/api/v1/joint-declaration/submit", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "APPROVED_AUTOMATED_3WAY"
        assert data["application_id"].startswith("JD-")
        assert "audit_hash" in data

        # Get list for UAN
        res_list = await client.get("/api/v1/joint-declaration/100982348712")
        assert res_list.status_code == 200
        assert len(res_list.json()) >= 1

        # Unknown UAN -> 404
        payload_404 = payload.copy()
        payload_404["uan"] = "999999999999"
        res_404 = await client.post("/api/v1/joint-declaration/submit", json=payload_404)
        assert res_404.status_code == 404


# ==============================================================================
# 10. GRIEVANCES & AI COPILOT ENDPOINTS
# ==============================================================================
@pytest.mark.asyncio
async def test_grievances_diagnose_lodge_and_get():
    async with AsyncClient(transport=ASGITransport(app=gateway_app), base_url="http://test") as client:
        # Diagnose
        diag_payload = {
            "uan": "100982348712",
            "complaint_category": "DATE_OF_EXIT",
            "complaint_description": "Previous employer failed to update date of exit."
        }
        res_diag = await client.post("/api/v1/grievances/diagnose", json=diag_payload)
        assert res_diag.status_code == 200
        assert res_diag.json()["error_code_classification"] == "ERR_EPFO_DOE_MISSING"
        assert res_diag.json()["automated_fix_available"] is True

        # Lodge
        res_lodge = await client.post("/api/v1/grievances/lodge", json=diag_payload)
        assert res_lodge.status_code == 200
        lodge_data = res_lodge.json()
        assert lodge_data["success"] is True
        assert lodge_data["grievance_id"].startswith("GRV-")

        # Get grievances for UAN
        res_get = await client.get("/api/v1/grievances/100982348712")
        assert res_get.status_code == 200
        assert len(res_get.json()) >= 1

        # Unknown citizen -> 404
        diag_404 = diag_payload.copy()
        diag_404["uan"] = "999999999999"
        res_404 = await client.post("/api/v1/grievances/diagnose", json=diag_404)
        assert res_404.status_code == 404

        res_lodge_404 = await client.post("/api/v1/grievances/lodge", json=diag_404)
        assert res_lodge_404.status_code == 404
