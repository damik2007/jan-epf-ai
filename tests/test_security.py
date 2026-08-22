"""
Jan-EPF AI: Comprehensive Zero-Trust Security, Presidio PII, and Token Vault Test Suite (Agent 3).
Tests Presidio on-device masking, AES-256-GCM token encryption, HMAC webhooks, JWT tokens, and anti-hallucination guards.
"""
import pytest
from pydantic import BaseModel, Field
from src.core.schemas import ClaimSubmissionRequest, ClaimType
from src.core.security import (
    AntiHallucinationGuard,
    CryptographicSignatureManager,
    PresidioPIISanitizer,
    SecurityTokenManager,
    TokenEncryptionVault,
)
from src.core.security_helpers import SecurityTestHelper


# ==============================================================================
# 1. PRESIDIO PII SANITIZATION TESTS
# ==============================================================================
def test_presidio_aadhaar_masking():
    """
    Ensures 12-digit Aadhaar numbers are masked to XXXX-XXXX-Last4.
    """
    raw_1 = "987654321098"
    raw_2 = "9876 5432 1098"
    raw_3 = "9876-5432-1098"

    assert PresidioPIISanitizer.mask_aadhaar(raw_1) == "XXXX-XXXX-1098"
    assert PresidioPIISanitizer.mask_aadhaar(raw_2) == "XXXX-XXXX-1098"
    assert PresidioPIISanitizer.mask_aadhaar(raw_3) == "XXXX-XXXX-1098"


def test_presidio_pan_masking():
    """
    Ensures 10-character PAN is masked to First5****Last1.
    """
    pan = "ABCDE1234F"
    assert PresidioPIISanitizer.mask_pan(pan) == "ABCDE****F"


def test_presidio_phone_masking():
    """
    Ensures 10-digit Indian phone numbers are masked to +91******Last4.
    """
    phone_1 = "+919876543210"
    phone_2 = "9876543210"

    assert PresidioPIISanitizer.mask_phone(phone_1) == "+91******3210"
    assert PresidioPIISanitizer.mask_phone(phone_2) == "+91******3210"


def test_presidio_bank_account_masking():
    """
    Ensures bank account numbers have only the last 4 digits visible.
    """
    acc = "50100234567890"
    masked = PresidioPIISanitizer.mask_bank_account(acc)
    assert masked.endswith("7890")
    assert masked.startswith("XXXXXXXXXX")


def test_presidio_name_masking():
    """
    Ensures names are masked keeping only initial letters.
    """
    name = "Ramesh Kumar Sharma"
    masked = PresidioPIISanitizer.mask_name(name)
    assert masked == "R***** K**** S*****"


def test_presidio_text_sanitization():
    """
    Ensures raw narrative text containing PII is scrubbed before LLM prompt transmission.
    """
    raw_grievance = (
        "Citizen Ramesh (Aadhaar: 987654321098, PAN: ABCDE1234F) called from +919876543210 "
        "asking for medical withdrawal to account 50100234567890."
    )
    sanitized = PresidioPIISanitizer.sanitize_text(raw_grievance)

    assert "987654321098" not in sanitized
    assert "ABCDE1234F" not in sanitized
    assert "+919876543210" not in sanitized
    assert "XXXX-XXXX-1098" in sanitized
    assert "ABCDE****F" in sanitized
    assert "+91******3210" in sanitized


def test_presidio_recursive_dict_sanitization():
    """
    Ensures nested dictionary structures are completely scrubbed of PII.
    """
    payload = {
        "uan": "100982341201",
        "citizen": {
            "aadhaar_number": "987654321098",
            "pan_number": "ABCDE1234F",
            "contact": {
                "mobile_phone": "9876543210",
                "email": "ramesh.kumar@example.com"
            }
        },
        "bank_account_number": "50100234567890"
    }

    sanitized = PresidioPIISanitizer.sanitize_dict(payload)

    # Check zero PII leakage
    SecurityTestHelper.assert_zero_pii_leakage(sanitized)
    assert sanitized["citizen"]["aadhaar_number"] == "XXXX-XXXX-1098"
    assert sanitized["citizen"]["pan_number"] == "ABCDE****F"
    assert sanitized["citizen"]["contact"]["mobile_phone"] == "+91******3210"
    assert sanitized["citizen"]["contact"]["email"] == "r***r@example.com"


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
    # Raw output has dirty/unformatted UAN
    bad_data = {
        "uan": "UAN-100982341201",  # Invalid regex pattern
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
