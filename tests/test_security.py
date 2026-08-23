"""
Jan-EPF AI: Exhaustive Zero-Trust Security, Presidio PII, and Token Vault Test Suite (Agent 3 & Agent 7).
Tests Presidio on-device masking, zero-leak invariants for Aadhaar/PAN/phone/email/bank, AES-256-GCM encryption,
HMAC webhook signatures, stateless JWT tokens, anti-hallucination guard, and RLS isolation.
"""
from datetime import timedelta
import pytest
from pydantic import BaseModel, Field
from src.core.schemas import ClaimType
from src.core.security import (
    AntiHallucinationGuard,
    CryptographicSignatureManager,
    PresidioPIISanitizer,
    SecurityTokenManager,
    TokenEncryptionVault,
)
from src.core.security_helpers import (
    InMemoryRLSEngine,
    RLSSessionContext,
    SecurityTestHelper,
)


# ==============================================================================
# 1. PRESIDIO PII SANITIZATION & ZERO-LEAK TESTS
# ==============================================================================
def test_presidio_aadhaar_masking():
    """
    Ensures 12-digit Aadhaar numbers are masked to XXXX-XXXX-Last4.
    """
    raw_1 = "987654321098"
    raw_2 = "9876 5432 1098"
    raw_3 = "9876-5432-1098"
    raw_invalid = "12345"

    assert PresidioPIISanitizer.mask_aadhaar(raw_1) == "XXXX-XXXX-1098"
    assert PresidioPIISanitizer.mask_aadhaar(raw_2) == "XXXX-XXXX-1098"
    assert PresidioPIISanitizer.mask_aadhaar(raw_3) == "XXXX-XXXX-1098"
    assert PresidioPIISanitizer.mask_aadhaar(raw_invalid) == "XXXX-XXXX-XXXX"


def test_presidio_pan_masking():
    """
    Ensures 10-character PAN is masked to First5****Last1.
    """
    pan = "ABCDE1234F"
    pan_lower = "abcde1234f"
    pan_invalid = "ABC12"

    assert PresidioPIISanitizer.mask_pan(pan) == "ABCDE****F"
    assert PresidioPIISanitizer.mask_pan(pan_lower) == "ABCDE****F"
    assert PresidioPIISanitizer.mask_pan(pan_invalid) == "ABCDE****F"


def test_presidio_phone_masking():
    """
    Ensures 10-digit Indian phone numbers are masked to +91******Last4.
    """
    phone_1 = "+919876543210"
    phone_2 = "9876543210"
    phone_spaced = "+91 98765 43210"
    phone_invalid = "123"

    assert PresidioPIISanitizer.mask_phone(phone_1) == "+91******3210"
    assert PresidioPIISanitizer.mask_phone(phone_2) == "+91******3210"
    assert PresidioPIISanitizer.mask_phone(phone_spaced) == "+91******3210"
    assert PresidioPIISanitizer.mask_phone(phone_invalid) == "+91******0000"


def test_presidio_bank_account_masking():
    """
    Ensures bank account numbers have only the last 4 digits visible.
    """
    acc = "50100234567890"
    masked = PresidioPIISanitizer.mask_bank_account(acc)
    assert masked.endswith("7890")
    assert masked.startswith("XXXXXXXXXX")

    short_acc = "12"
    assert PresidioPIISanitizer.mask_bank_account(short_acc) == "XXXXXX0000"


def test_presidio_email_masking():
    """
    Ensures email addresses are masked while preserving domain.
    """
    email1 = "ramesh.kumar@example.com"
    email2 = "ab@domain.in"
    invalid_email = "notanemail"

    masked1 = PresidioPIISanitizer.mask_email(email1)
    assert masked1 == "r***r@example.com"
    masked2 = PresidioPIISanitizer.mask_email(email2)
    assert masked2 == "a***@domain.in"
    assert PresidioPIISanitizer.mask_email(invalid_email) == "u***@domain.com"


def test_presidio_name_masking():
    """
    Ensures names are masked keeping only initial letters.
    """
    name = "Ramesh Kumar Sharma"
    masked = PresidioPIISanitizer.mask_name(name)
    assert masked == "R***** K**** S*****"

    single_letter_name = "R K"
    assert PresidioPIISanitizer.mask_name(single_letter_name) == "* *"


def test_presidio_text_sanitization():
    """
    Ensures raw narrative text containing PII is scrubbed before LLM prompt transmission.
    """
    raw_grievance = (
        "Citizen Ramesh (Aadhaar: 987654321098, PAN: ABCDE1234F, Email: ramesh@gmail.com) "
        "called from +919876543210 asking for medical withdrawal to account 50100234567890."
    )
    sanitized = PresidioPIISanitizer.sanitize_text(raw_grievance)

    assert "987654321098" not in sanitized
    assert "ABCDE1234F" not in sanitized
    assert "+919876543210" not in sanitized
    assert "ramesh@gmail.com" not in sanitized
    assert "XXXX-XXXX-1098" in sanitized
    assert "ABCDE****F" in sanitized
    assert "+91******3210" in sanitized
    assert "r***h@gmail.com" in sanitized

    # Empty text check
    assert PresidioPIISanitizer.sanitize_text("") == ""
    assert PresidioPIISanitizer.sanitize_text(None) is None


def test_presidio_recursive_dict_sanitization():
    """
    Ensures nested dictionary and list structures are completely scrubbed of PII.
    """
    payload = {
        "uan": "100982341201",
        "claim_id": "CLM-12345",
        "tenant_id": "TEN-999",
        "citizen": {
            "aadhaar_number": "987654321098",
            "pan_number": "ABCDE1234F",
            "contact": {
                "mobile_phone": "9876543210",
                "email": "ramesh.kumar@example.com"
            }
        },
        "bank_account_number": "50100234567890",
        "notes": [
            {"comment": "Contact citizen at +919876543210 for PAN ABCDE1234F"},
            "Simple string note"
        ]
    }

    sanitized = PresidioPIISanitizer.sanitize_dict(payload)

    # Check zero PII leakage
    SecurityTestHelper.assert_zero_pii_leakage(sanitized)
    assert sanitized["uan"] == "100982341201"  # Preserved operational ID
    assert sanitized["claim_id"] == "CLM-12345"
    assert sanitized["tenant_id"] == "TEN-999"
    assert sanitized["citizen"]["aadhaar_number"] == "XXXX-XXXX-1098"
    assert sanitized["citizen"]["pan_number"] == "ABCDE****F"
    assert sanitized["citizen"]["contact"]["mobile_phone"] == "+91******3210"
    assert sanitized["citizen"]["contact"]["email"] == "r***r@example.com"
    assert "XXXX-XXXX-1098" not in sanitized["notes"][0]["comment"]  # Phone and PAN sanitized in text
    assert "+91******3210" in sanitized["notes"][0]["comment"]


# ==============================================================================
# 2. AES-256-GCM TOKEN ENCRYPTION VAULT TESTS
# ==============================================================================
def test_token_encryption_and_decryption():
    """
    Tests symmetric AES-256-GCM encryption and decryption round-trip for sensitive tokens.
    """
    raw_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.somerandomsecurepayloadtoken123"
    encrypted_bytes = TokenEncryptionVault.encrypt_token(raw_token)

    assert isinstance(encrypted_bytes, bytes)
    assert encrypted_bytes != raw_token.encode("utf-8")

    decrypted = TokenEncryptionVault.decrypt_token(encrypted_bytes)
    assert decrypted == raw_token


def test_token_encryption_custom_secret():
    custom_secret = "my_custom_secret_key_1234567890"
    raw_token = "token_with_custom_secret"
    encrypted = TokenEncryptionVault.encrypt_token(raw_token, secret=custom_secret)
    decrypted = TokenEncryptionVault.decrypt_token(encrypted, secret=custom_secret)
    assert decrypted == raw_token


def test_token_encryption_tamper_rejection():
    """
    Ensures tampered ciphertexts are rejected by AES-256-GCM authentication tags.
    """
    raw_token = "secure_service_token_456"
    encrypted_bytes = bytearray(TokenEncryptionVault.encrypt_token(raw_token))

    # Tamper with byte
    encrypted_bytes[-1] ^= 0xFF

    with pytest.raises(Exception):
        TokenEncryptionVault.decrypt_token(bytes(encrypted_bytes))


def test_token_encryption_invalid_payload_length():
    with pytest.raises(ValueError, match="Invalid encrypted payload length"):
        TokenEncryptionVault.decrypt_token(b"short_payload")


def test_token_hash_lookup():
    """
    Verifies deterministic SHA-256 token hashing for constant-time DB lookups.
    """
    raw_token = "session_token_uan_100982341201"
    h1 = TokenEncryptionVault.hash_token(raw_token)
    h2 = TokenEncryptionVault.hash_token(raw_token)
    assert h1 == h2
    assert len(h1) == 64


# ==============================================================================
# 3. HMAC WEBHOOK VERIFICATION TESTS
# ==============================================================================
def test_hmac_webhook_verification_success():
    """
    Tests successful verification of NPCI penny-drop webhook callback.
    """
    payload = {
        "uan": "100982341201",
        "reference_id": "NPCI-REF-2026-98124",
        "status": "SUCCESS",
        "amount": 1.00
    }
    payload_bytes, signature = SecurityTestHelper.create_signed_npci_webhook(payload)

    is_valid = CryptographicSignatureManager.verify_webhook_signature(payload_bytes, signature)
    assert is_valid is True


def test_hmac_webhook_tamper_detection():
    """
    Tests that any payload mutation results in HMAC verification failure.
    """
    payload = {
        "uan": "100982341201",
        "reference_id": "NPCI-REF-2026-98124",
        "status": "SUCCESS",
        "amount": 1.00
    }
    payload_bytes, signature = SecurityTestHelper.create_signed_npci_webhook(payload)

    # Tamper with payload
    tampered_bytes = payload_bytes.replace(b"SUCCESS", b"FAILED")

    is_valid = CryptographicSignatureManager.verify_webhook_signature(tampered_bytes, signature)
    assert is_valid is False


def test_audit_hash_generation():
    h1 = CryptographicSignatureManager.generate_audit_hash("test-audit-payload-string")
    h2 = CryptographicSignatureManager.generate_audit_hash("test-audit-payload-string")
    assert h1 == h2
    assert len(h1) == 64


# ==============================================================================
# 4. STATELESS JWT ENGINE TESTS
# ==============================================================================
def test_jwt_creation_and_verification():
    """
    Tests generation and decoding of valid citizen JWT session token.
    """
    token = SecurityTestHelper.create_mock_jwt_token(
        uan="100982341201",
        tenant_id="11111111-1111-1111-1111-111111111111",
        role="citizen"
    )
    payload = SecurityTokenManager.verify_access_token(token)

    assert payload["uan"] == "100982341201"
    assert payload["tenant_id"] == "11111111-1111-1111-1111-111111111111"
    assert payload["role"] == "citizen"


def test_jwt_custom_expiry():
    token = SecurityTokenManager.create_access_token(
        {"sub": "100982341201"},
        expires_delta=timedelta(minutes=15)
    )
    payload = SecurityTokenManager.verify_access_token(token)
    assert payload["sub"] == "100982341201"


def test_jwt_expired_token_rejection():
    """
    Ensures expired JWT tokens raise ValueError.
    """
    expired_token = SecurityTestHelper.create_expired_jwt_token(uan="100982341201")
    with pytest.raises(ValueError, match="Authentication token has expired"):
        SecurityTokenManager.verify_access_token(expired_token)


def test_jwt_tampered_signature_rejection():
    """
    Ensures tokens with modified payloads or signatures are rejected.
    """
    token = SecurityTestHelper.create_mock_jwt_token(uan="100982341201")
    parts = token.split(".")
    tampered_token = f"{parts[0]}.{parts[1]}tampered.{parts[2]}"

    with pytest.raises(ValueError, match="Invalid authentication token"):
        SecurityTokenManager.verify_access_token(tampered_token)


# ==============================================================================
# 5. ANTI-HALLUCINATION GUARD & SELF-CORRECTION TESTS
# ==============================================================================
class SampleClaimSchema(BaseModel):
    uan: str = Field(..., pattern=r"^\d{12}$")
    claim_type: ClaimType
    amount: float = Field(..., gt=0)


def test_anti_hallucination_guard_success():
    """
    Tests clean validation pass-through for model outputs.
    """
    raw_data = {
        "uan": "100982341201",
        "claim_type": "FORM_31_MEDICAL",
        "amount": 40000.0
    }
    validated = AntiHallucinationGuard.validate_or_correct(SampleClaimSchema, raw_data)
    assert validated.uan == "100982341201"
    assert validated.claim_type == ClaimType.MEDICAL_ADVANCE
    assert validated.amount == 40000.0


def test_anti_hallucination_guard_self_correction():
    """
    Tests automatic repair of malformed fields via self-correction callback.
    """
    bad_data = {
        "uan": "UAN-100982341201",
        "claim_type": "FORM_31_MEDICAL",
        "amount": 40000.0
    }

    def correction_handler(data: dict, error_msg: str) -> dict:
        corrected = data.copy()
        if "UAN-" in corrected.get("uan", ""):
            corrected["uan"] = corrected["uan"].replace("UAN-", "")
        return corrected

    validated = AntiHallucinationGuard.validate_or_correct(
        SampleClaimSchema, bad_data, correction_callback=correction_handler, max_retries=2
    )
    assert validated.uan == "100982341201"
    assert validated.amount == 40000.0


def test_anti_hallucination_guard_exhausted_retries():
    """
    Tests exception when invalid data cannot be repaired.
    """
    unfixable_data = {
        "uan": "INVALID_UAN",
        "claim_type": "UNKNOWN_CLAIM",
        "amount": -500.0
    }

    with pytest.raises(ValueError, match="Anti-hallucination validation failed"):
        AntiHallucinationGuard.validate_or_correct(
            SampleClaimSchema, unfixable_data, max_retries=1
        )


def test_anti_hallucination_guard_non_dict_input():
    with pytest.raises(ValueError):
        AntiHallucinationGuard.validate_or_correct(SampleClaimSchema, "not_a_dict", max_retries=0)


# ==============================================================================
# 6. ROW-LEVEL SECURITY (RLS) IN-MEMORY ENGINE & TEST HELPERS
# ==============================================================================
def test_rls_session_context():
    ctx = RLSSessionContext(
        tenant_id="TEN-1",
        uan="100982341201",
        role="citizen",
        bypass_rls=False
    )
    sqls = ctx.to_sql_statements()
    assert len(sqls) == 4
    assert "SET LOCAL app.current_tenant_id = 'TEN-1';" in sqls[0]
    assert ctx.to_dict()["app.current_uan"] == "100982341201"


def test_in_memory_rls_filter_and_insert():
    rows = [
        {"tenant_id": "TEN-1", "uan": "100982341201", "data": "citizen 1 record"},
        {"tenant_id": "TEN-1", "uan": "100982348712", "data": "citizen 2 record"},
        {"tenant_id": "TEN-2", "uan": "100982349999", "data": "tenant 2 record"}
    ]

    # Citizen context: only sees own record in own tenant
    citizen_ctx = RLSSessionContext(tenant_id="TEN-1", uan="100982341201", role="citizen")
    citizen_rows = InMemoryRLSEngine.filter_rows("claims", rows, citizen_ctx)
    assert len(citizen_rows) == 1
    assert citizen_rows[0]["uan"] == "100982341201"

    # Employer admin context: sees all records in own tenant
    employer_ctx = RLSSessionContext(tenant_id="TEN-1", role="employer_admin")
    employer_rows = InMemoryRLSEngine.filter_rows("claims", rows, employer_ctx)
    assert len(employer_rows) == 2

    # Super admin / bypass context: sees all records
    admin_ctx = RLSSessionContext(role="super_admin")
    admin_rows = InMemoryRLSEngine.filter_rows("claims", rows, admin_ctx)
    assert len(admin_rows) == 3

    # Anonymous has zero access
    anon_ctx = RLSSessionContext(role="anonymous")
    anon_rows = InMemoryRLSEngine.filter_rows("claims", rows, anon_ctx)
    assert len(anon_rows) == 0

    # Insert constraints
    assert InMemoryRLSEngine.can_insert("claims", {"tenant_id": "TEN-1", "uan": "100982341201"}, citizen_ctx) is True
    assert InMemoryRLSEngine.can_insert("claims", {"tenant_id": "TEN-1", "uan": "100982348712"}, citizen_ctx) is False
    assert InMemoryRLSEngine.can_insert("claims", {"tenant_id": "TEN-2", "uan": "100982341201"}, citizen_ctx) is False
    assert InMemoryRLSEngine.can_insert("claims", {"tenant_id": "TEN-1", "uan": "100982348712"}, employer_ctx) is True
    assert InMemoryRLSEngine.can_insert("claims", {"tenant_id": "TEN-1", "uan": "100982348712"}, anon_ctx) is False


def test_security_test_helper_generators():
    citizen_rec = SecurityTestHelper.generate_mock_citizen_record()
    SecurityTestHelper.assert_zero_pii_leakage(citizen_rec)
    assert citizen_rec["aadhaar_masked"].startswith("XXXX-XXXX-")

    pb_rec = SecurityTestHelper.generate_mock_passbook_summary()
    assert pb_rec["total_balance"] == 485000.0

    claim_rec = SecurityTestHelper.generate_mock_claim_record()
    assert claim_rec["claim_type"] == "FORM_31_MEDICAL"


def test_pii_leakage_assertion_catches_violations():
    # Unmasked PAN
    with pytest.raises(AssertionError, match="PII Leakage"):
        SecurityTestHelper.assert_zero_pii_leakage({"pan": "ABCDE1234F"})

    # Unmasked Aadhaar
    with pytest.raises(AssertionError, match="PII Leakage"):
        SecurityTestHelper.assert_zero_pii_leakage({"aadhaar_number": "987654321098"})

    # Unmasked Phone
    with pytest.raises(AssertionError, match="PII Leakage"):
        SecurityTestHelper.assert_zero_pii_leakage({"phone": "+919876543210"})

    # Unmasked Account
    with pytest.raises(AssertionError, match="PII Leakage"):
        SecurityTestHelper.assert_zero_pii_leakage({"bank_account": "1234567890"})

    # Plain text unmasked PAN
    with pytest.raises(AssertionError, match="PII Leakage Detected"):
        SecurityTestHelper.assert_zero_pii_leakage("Citizen has PAN ABCDE1234F on record")


def test_telemetry_structured_json_formatter():
    import logging
    from src.core.telemetry import StructuredJSONFormatter

    formatter = StructuredJSONFormatter()
    record = logging.LogRecord(
        name="test_logger",
        level=logging.INFO,
        pathname="test.py",
        lineno=10,
        msg="Processing citizen login with UAN 100982348712",
        args=(),
        exc_info=None
    )
    record.trace_id = "trace-12345"
    record.uan = "100982348712"

    formatted = formatter.format(record)
    assert "trace-12345" in formatted
    assert "test_logger" in formatted
    assert "XXXX-XXXX-8712" in formatted


def test_data_store_edge_cases():
    from src.core.data_store import MockCitizenDataStore

    # Missing file fallback
    store = MockCitizenDataStore(data_path="/non/existent/path/data.json")
    assert store.citizens == {}
    assert store.get_citizen("123") is None
    assert store.update_citizen("123", {"name": "Test"}) is None

