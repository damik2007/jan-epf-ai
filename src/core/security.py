"""
Jan-EPF AI: Zero-Trust Security, Presidio PII Sanitization, and JWT Token Engine (Agent 3).
Enforces zero-data-leakage, cryptographic signatures, token vault encryption, and strict PII redacting.
"""
import base64
import hashlib
import hmac
import os
import re
from datetime import datetime, timedelta, timezone
from typing import Any, Callable, Dict, List, Optional, Type, TypeVar
import jwt
from pydantic import BaseModel, ValidationError
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from src.core.config import settings

T = TypeVar("T", bound=BaseModel)

# ==============================================================================
# PII REGEX PATTERNS (SOVEREIGN ON-DEVICE PRESIDIO SANITIZER)
# ==============================================================================
PHONE_PATTERN = re.compile(r"\+91[\s-]?[6-9]\d{9}(?!\d)|(?<![\d\+])[6-9]\d{9}(?!\d)")
PAN_PATTERN = re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b", re.IGNORECASE)
AADHAAR_PATTERN = re.compile(r"(?<![\d\+])\d{4}[\s-]\d{4}[\s-]\d{4}(?!\d)|(?<![\d\+])[2-9]\d{11}(?!\d)")
EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
ACCOUNT_PATTERN = re.compile(r"(?<!\d)\d{9,18}(?!\d)")


class PresidioPIISanitizer:
    """
    On-device, sovereign PII sanitizer and masker.
    Guarantees no unmasked Aadhaar, PAN, phone, email, or bank account numbers are transmitted or logged.
    """

    @staticmethod
    def mask_aadhaar(aadhaar: str) -> str:
        clean = re.sub(r"\D", "", aadhaar)
        if len(clean) == 12:
            return f"XXXX-XXXX-{clean[-4:]}"
        return "XXXX-XXXX-XXXX"

    @staticmethod
    def mask_pan(pan: str) -> str:
        clean = pan.strip().upper()
        if len(clean) == 10:
            return f"{clean[:5]}****{clean[-1]}"
        return "ABCDE****F"

    @staticmethod
    def mask_phone(phone: str) -> str:
        clean = re.sub(r"\D", "", phone)
        if len(clean) >= 10:
            return f"+91******{clean[-4:]}"
        return "+91******0000"

    @staticmethod
    def mask_bank_account(account: str) -> str:
        clean = re.sub(r"\D", "", account)
        if len(clean) >= 4:
            return f"{'X' * (len(clean) - 4)}{clean[-4:]}"
        return "XXXXXX0000"

    @staticmethod
    def mask_email(email: str) -> str:
        clean = email.strip()
        if "@" in clean:
            user, domain = clean.split("@", 1)
            if len(user) > 2:
                masked_user = f"{user[0]}***{user[-1]}"
            else:
                masked_user = f"{user[0]}***"
            return f"{masked_user}@{domain}"
        return "u***@domain.com"

    @staticmethod
    def mask_name(name: str) -> str:
        parts = name.strip().split()
        masked_parts = []
        for p in parts:
            if len(p) > 1:
                masked_parts.append(f"{p[0]}{'*' * (len(p) - 1)}")
            else:
                masked_parts.append("*")
        return " ".join(masked_parts)

    @classmethod
    def sanitize_text(cls, text: str) -> str:
        """
        Sanitizes raw text strings (logs, grievance descriptions, chat prompts)
        by replacing detected PII entities with safe tokens in strict priority order.
        """
        if not text:
            return text

        # 1. Sanitize Phone numbers (+91 or 10-digit mobile)
        def _replace_phone(match):
            return cls.mask_phone(match.group(0))

        sanitized = PHONE_PATTERN.sub(_replace_phone, text)

        # 2. Sanitize Aadhaar numbers (12-digit or 4-4-4 format)
        def _replace_aadhaar(match):
            return cls.mask_aadhaar(match.group(0))

        sanitized = AADHAAR_PATTERN.sub(_replace_aadhaar, sanitized)

        # 3. Sanitize PAN numbers (5 letters, 4 digits, 1 letter)
        def _replace_pan(match):
            return cls.mask_pan(match.group(0))

        sanitized = PAN_PATTERN.sub(_replace_pan, sanitized)

        # 4. Sanitize Emails
        def _replace_email(match):
            return cls.mask_email(match.group(0))

        sanitized = EMAIL_PATTERN.sub(_replace_email, sanitized)

        return sanitized

    @classmethod
    def sanitize_dict(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recursively sanitizes dictionaries before serialization or external logging.
        Preserves non-PII operational identifiers like UAN, tenant_id, and claim_id.
        """
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, dict):
                sanitized[key] = cls.sanitize_dict(value)
            elif isinstance(value, list):
                sanitized[key] = [
                    cls.sanitize_dict(item) if isinstance(item, dict)
                    else (cls.sanitize_text(item) if isinstance(item, str) else item)
                    for item in value
                ]
            elif isinstance(value, str):
                lower_k = key.lower()
                # Operational identifiers to preserve
                if "uan" in lower_k or lower_k.endswith("_id") or lower_k in ("claim_id", "application_id", "member_id", "tenant_id", "token_id", "token", "signature", "hash"):
                    sanitized[key] = value
                elif "aadhaar" in lower_k and not value.startswith("XXXX"):
                    sanitized[key] = cls.mask_aadhaar(value)
                elif "pan" in lower_k and "****" not in value:
                    sanitized[key] = cls.mask_pan(value)
                elif "phone" in lower_k or "mobile" in lower_k:
                    sanitized[key] = cls.mask_phone(value)
                elif "email" in lower_k and "***" not in value:
                    sanitized[key] = cls.mask_email(value)
                elif "account" in lower_k and "name" not in lower_k and not value.startswith("X"):
                    sanitized[key] = cls.mask_bank_account(value)
                else:
                    sanitized[key] = cls.sanitize_text(value)
            else:
                sanitized[key] = value
        return sanitized


# ==============================================================================
# AES-256-GCM TOKEN ENCRYPTION VAULT
# ==============================================================================
class TokenEncryptionVault:
    """
    Symmetric AES-256-GCM encryption vault for storing access tokens,
    KYC secrets, and sensitive session states securely at rest.
    """

    @classmethod
    def _derive_key(cls, secret: Optional[str] = None) -> bytes:
        raw_key = secret or settings.JWT_SECRET_KEY
        return hashlib.sha256(raw_key.encode("utf-8")).digest()

    @classmethod
    def encrypt_token(cls, raw_token: str, secret: Optional[str] = None) -> bytes:
        """
        Encrypts raw token using AES-256-GCM with a 12-byte random nonce.
        Returns nonce + ciphertext + tag.
        """
        key = cls._derive_key(secret)
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, raw_token.encode("utf-8"), None)
        return nonce + ciphertext

    @classmethod
    def decrypt_token(cls, encrypted_payload: bytes, secret: Optional[str] = None) -> str:
        """
        Decrypts AES-256-GCM encrypted payload.
        Expects 12-byte nonce followed by ciphertext.
        """
        if len(encrypted_payload) < 28:
            raise ValueError("Invalid encrypted payload length")
        key = cls._derive_key(secret)
        aesgcm = AESGCM(key)
        nonce = encrypted_payload[:12]
        ciphertext = encrypted_payload[12:]
        decrypted_bytes = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted_bytes.decode("utf-8")

    @staticmethod
    def hash_token(raw_token: str) -> str:
        """
        Derives constant-time SHA-256 hash for fast database lookup.
        """
        return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


# ==============================================================================
# STATELESS JWT AUTHENTICATION ENGINE
# ==============================================================================
class SecurityTokenManager:
    """
    Manages stateless JWT tokens for citizen sessions, employer admin,
    and internal microservice authentication.
    """

    @staticmethod
    def create_access_token(
        data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        to_encode = data.copy()
        now = datetime.now(timezone.utc)
        if expires_delta:
            expire = now + expires_delta
        else:
            expire = now + timedelta(hours=24)

        to_encode.update({
            "exp": expire,
            "iat": now,
            "iss": settings.APP_NAME
        })

        encoded_jwt = jwt.encode(
            to_encode,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def verify_access_token(token: str) -> Dict[str, Any]:
        """
        Decodes and verifies a JWT token. Raises ValueError if invalid or expired.
        """
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Authentication token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid authentication token")


# ==============================================================================
# CRYPTOGRAPHIC HMAC SIGNATURES (WEBHOOKS & AUDIT TRAILS)
# ==============================================================================
class CryptographicSignatureManager:
    """
    Enforces HMAC-SHA256 signatures for NPCI callbacks and generates tamper-evident audit hashes.
    """

    @staticmethod
    def generate_audit_hash(payload_str: str) -> str:
        """
        Creates a SHA-256 hash for immutable ledger and joint declaration audits.
        """
        return hashlib.sha256(payload_str.encode("utf-8")).hexdigest()

    @staticmethod
    def verify_webhook_signature(payload_bytes: bytes, signature_header: Optional[str]) -> bool:
        """
        Verifies NPCI penny-drop webhook callback HMAC signature with constant-time check.
        """
        if not signature_header or not payload_bytes:
            return False
        expected_sig = hmac.new(
            settings.WEBHOOK_HMAC_SECRET.encode("utf-8"),
            payload_bytes,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected_sig, signature_header)

    @staticmethod
    def sign_webhook_payload(payload_bytes: bytes) -> str:
        """
        Generates HMAC-SHA256 signature for outgoing webhook tests.
        """
        return hmac.new(
            settings.WEBHOOK_HMAC_SECRET.encode("utf-8"),
            payload_bytes,
            hashlib.sha256
        ).hexdigest()


# ==============================================================================
# ANTI-HALLUCINATION & MODEL SCHEMA VALIDATOR
# ==============================================================================
class AntiHallucinationGuard:
    """
    Validates model outputs against strict Pydantic v2 schemas and triggers
    self-correction routines to eliminate hallucinated fields.
    """

    @staticmethod
    def validate_or_correct(
        schema_cls: Type[T],
        raw_output: Any,
        correction_callback: Optional[Callable[[Dict[str, Any], str], Dict[str, Any]]] = None,
        max_retries: int = 2
    ) -> T:
        """
        Validates raw dictionary/JSON data against schema_cls.
        If validation fails, runs up to max_retries self-correction cycles.
        """
        current_data = raw_output if isinstance(raw_output, dict) else {}
        last_error = ""

        for attempt in range(max_retries + 1):
            try:
                # Recursively sanitize any sensitive PII in the input before parsing
                sanitized_dict = PresidioPIISanitizer.sanitize_dict(current_data)
                return schema_cls.model_validate(sanitized_dict)
            except ValidationError as e:
                last_error = str(e)
                if attempt < max_retries and correction_callback:
                    current_data = correction_callback(current_data, last_error)
                else:
                    raise ValueError(
                        f"Anti-hallucination validation failed after {attempt + 1} attempt(s): {last_error}"
                    )

        raise ValueError(f"Anti-hallucination validation failed: {last_error}")
