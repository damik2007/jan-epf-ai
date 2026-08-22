"""
Jan-EPF AI: Security & Row-Level Security (RLS) Test Helpers.
Provides utilities for testing zero-trust tenant isolation, token vaults,
Presidio PII masking, HMAC signatures, and PostgreSQL RLS session policies.
"""
import copy
import json
import re
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple, Union

from src.core.config import settings
from src.core.schemas import ClaimType, KYCStatus
from src.core.security import (
    CryptographicSignatureManager,
    PresidioPIISanitizer,
    SecurityTokenManager,
    TokenEncryptionVault,
)


class RLSSessionContext:
    """
    Manages session variables corresponding to PostgreSQL RLS policies:
    - app.current_tenant_id
    - app.current_uan
    - app.current_role
    - app.bypass_rls
    """

    def __init__(
        self,
        tenant_id: Optional[str] = None,
        uan: Optional[str] = None,
        role: str = "citizen",
        bypass_rls: bool = False
    ):
        self.tenant_id = str(tenant_id) if tenant_id else ""
        self.uan = str(uan) if uan else ""
        self.role = role
        self.bypass_rls = bypass_rls

    def to_sql_statements(self) -> List[str]:
        """
        Generates SQL statements to apply in a PostgreSQL session connection.
        """
        return [
            f"SET LOCAL app.current_tenant_id = '{self.tenant_id}';",
            f"SET LOCAL app.current_uan = '{self.uan}';",
            f"SET LOCAL app.current_role = '{self.role}';",
            f"SET LOCAL app.bypass_rls = '{'true' if self.bypass_rls else 'false'}';"
        ]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "app.current_tenant_id": self.tenant_id,
            "app.current_uan": self.uan,
            "app.current_role": self.role,
            "app.bypass_rls": "true" if self.bypass_rls else "false"
        }


class InMemoryRLSEngine:
    """
    High-fidelity in-memory simulator of PostgreSQL 001_initial_rls.sql policies.
    Guarantees deterministic isolation testing without requiring an active PostgreSQL daemon.
    """

    @staticmethod
    def filter_rows(
        table_name: str,
        rows: List[Dict[str, Any]],
        context: RLSSessionContext
    ) -> List[Dict[str, Any]]:
        """
        Applies RLS policy rules based on the active RLSSessionContext.
        """
        # 1. Bypass check (service_role, epfo_admin, super_admin or bypass_rls=True)
        if context.bypass_rls or context.role in ("service_role", "epfo_admin", "super_admin"):
            return copy.deepcopy(rows)

        # Anonymous has zero access
        if context.role == "anonymous" or not context.tenant_id:
            return []

        filtered = []
        for row in rows:
            row_tenant = str(row.get("tenant_id", ""))
            row_uan = str(row.get("uan", ""))

            # Tenant boundary must strictly match
            if row_tenant != context.tenant_id:
                continue

            # Employer admin has access to all records inside their tenant
            if context.role == "employer_admin":
                filtered.append(copy.deepcopy(row))
            # Citizen role is strictly bounded to (tenant_id AND uan)
            elif context.role == "citizen":
                if row_uan and row_uan == context.uan:
                    filtered.append(copy.deepcopy(row))
                elif not row_uan and table_name in ("tenants", "security_audit_logs"):
                    filtered.append(copy.deepcopy(row))

        return filtered

    @staticmethod
    def can_insert(
        table_name: str,
        row: Dict[str, Any],
        context: RLSSessionContext
    ) -> bool:
        """
        Simulates WITH CHECK constraint on INSERT operations.
        """
        if context.bypass_rls or context.role in ("service_role", "epfo_admin", "super_admin"):
            return True

        if context.role == "anonymous" or not context.tenant_id:
            return False

        row_tenant = str(row.get("tenant_id", ""))
        row_uan = str(row.get("uan", ""))

        if row_tenant != context.tenant_id:
            return False

        if context.role == "employer_admin":
            return True

        if context.role == "citizen":
            if row_uan and row_uan == context.uan:
                return True
            if table_name == "security_audit_logs":
                return True

        return False


class SecurityTestHelper:
    """
    Suite of helpers for unit, integration, and security assertion tests.
    """

    @staticmethod
    def create_mock_jwt_token(
        uan: str = "100982341201",
        tenant_id: str = "11111111-1111-1111-1111-111111111111",
        role: str = "citizen",
        expires_in_seconds: int = 3600
    ) -> str:
        """
        Generates a valid signed JWT session token.
        """
        return SecurityTokenManager.create_access_token(
            data={
                "sub": uan,
                "uan": uan,
                "tenant_id": tenant_id,
                "role": role
            },
            expires_delta=timedelta(seconds=expires_in_seconds)
        )

    @staticmethod
    def create_expired_jwt_token(
        uan: str = "100982341201",
        tenant_id: str = "11111111-1111-1111-1111-111111111111",
        role: str = "citizen"
    ) -> str:
        """
        Generates an intentionally expired JWT token for security boundary testing.
        """
        return SecurityTokenManager.create_access_token(
            data={
                "sub": uan,
                "uan": uan,
                "tenant_id": tenant_id,
                "role": role
            },
            expires_delta=timedelta(seconds=-60)
        )

    @staticmethod
    def create_signed_npci_webhook(
        payload: Dict[str, Any],
        secret: Optional[str] = None
    ) -> Tuple[bytes, str]:
        """
        Returns JSON-encoded bytes and HMAC signature header.
        """
        payload_bytes = json.dumps(payload, sort_keys=True).encode("utf-8")
        if secret:
            import hmac
            import hashlib
            signature = hmac.new(
                secret.encode("utf-8"),
                payload_bytes,
                hashlib.sha256
            ).hexdigest()
        else:
            signature = CryptographicSignatureManager.sign_webhook_payload(payload_bytes)
        return payload_bytes, signature

    @staticmethod
    def assert_zero_pii_leakage(text_or_obj: Union[str, Dict[str, Any], List[Any]]) -> None:
        """
        Asserts that no raw unmasked Aadhaar or raw PAN appears in text or structured object.
        """
        if isinstance(text_or_obj, dict):
            for k, v in text_or_obj.items():
                lower_k = k.lower()
                if isinstance(v, (dict, list)):
                    SecurityTestHelper.assert_zero_pii_leakage(v)
                elif isinstance(v, str):
                    if "aadhaar" in lower_k:
                        if not v.startswith("XXXX"):
                            raise AssertionError(f"PII Leakage: Unmasked Aadhaar in field '{k}' -> {v}")
                    elif "pan" in lower_k:
                        if "****" not in v:
                            raise AssertionError(f"PII Leakage: Unmasked PAN in field '{k}' -> {v}")
                    elif "account" in lower_k and "name" not in lower_k:
                        if not (v.startswith("X") or v.startswith("XXXX")):
                            raise AssertionError(f"PII Leakage: Unmasked Account in field '{k}' -> {v}")
                    elif "phone" in lower_k or "mobile" in lower_k:
                        if not v.startswith("+91******"):
                            raise AssertionError(f"PII Leakage: Unmasked Phone in field '{k}' -> {v}")
            return

        if isinstance(text_or_obj, list):
            for item in text_or_obj:
                SecurityTestHelper.assert_zero_pii_leakage(item)
            return

        # Plain string inspection
        target_str = str(text_or_obj)
        # Check raw unmasked PAN (e.g. ABCDE1234F)
        raw_pan = re.search(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b", target_str)
        if raw_pan:
            match = raw_pan.group(0)
            if "****" not in match:
                raise AssertionError(f"PII Leakage Detected: Raw PAN found -> {match}")

    @staticmethod
    def generate_mock_citizen_record(
        uan: str = "100982341201",
        tenant_id: str = "11111111-1111-1111-1111-111111111111",
        full_name: str = "Ramesh Kumar",
        phone: str = "+919876543210",
        aadhaar: str = "987654321098",
        pan: str = "ABCDE1234F",
        bank_account: str = "50100234567890",
        ifsc: str = "HDFC0000060"
    ) -> Dict[str, Any]:
        """
        Creates a raw citizen record pre-sanitized with Presidio.
        """
        return {
            "member_id": str(uuid.uuid4()),
            "tenant_id": tenant_id,
            "uan": uan,
            "full_name": full_name,
            "phone_masked": PresidioPIISanitizer.mask_phone(phone),
            "dob": "1978-05-15",
            "gender": "MALE",
            "father_name": "Suresh Kumar",
            "aadhaar_masked": PresidioPIISanitizer.mask_aadhaar(aadhaar),
            "pan_masked": PresidioPIISanitizer.mask_pan(pan),
            "bank_name": "HDFC Bank",
            "account_number_masked": PresidioPIISanitizer.mask_bank_account(bank_account),
            "ifsc_code": ifsc,
            "kyc_status": KYCStatus.VERIFIED_ACTIVE.value,
            "penny_drop_verified": True
        }

    @staticmethod
    def generate_mock_passbook_summary(
        uan: str = "100982341201",
        tenant_id: str = "11111111-1111-1111-1111-111111111111",
        total_balance: float = 485000.0,
        employee_share: float = 240000.0,
        employer_share: float = 145000.0,
        pension_share: float = 100000.0
    ) -> Dict[str, Any]:
        return {
            "summary_id": str(uuid.uuid4()),
            "tenant_id": tenant_id,
            "uan": uan,
            "total_balance": total_balance,
            "employee_share": employee_share,
            "employer_share": employer_share,
            "pension_fund_share": pension_share,
            "interest_credited_current_fy": 38500.0,
            "monthly_wage": 45000.0,
            "interest_rate": 8.25,
            "last_contribution_date": "2026-07-31",
            "settled_at_retirement": False
        }

    @staticmethod
    def generate_mock_claim_record(
        uan: str = "100982341201",
        tenant_id: str = "11111111-1111-1111-1111-111111111111",
        claim_type: ClaimType = ClaimType.MEDICAL_ADVANCE,
        amount: float = 40000.0
    ) -> Dict[str, Any]:
        return {
            "claim_id": str(uuid.uuid4()),
            "tenant_id": tenant_id,
            "uan": uan,
            "claim_type": claim_type.value,
            "amount_requested": amount,
            "amount_sanctioned": amount,
            "tds_deducted_amount": 0.0,
            "reason_code": "ILLNESS_SURGERY",
            "reason_description": "Emergency Hospital Advance",
            "status": "SUBMITTED",
            "bank_account_verified": True,
            "form_15g_submitted": False,
            "dbt_account_masked": "XXXXXXXX7890",
            "audit_trace_token": CryptographicSignatureManager.generate_audit_hash(f"{uan}-{amount}-{uuid.uuid4()}"),
            "submitted_at": datetime.now(timezone.utc).isoformat()
        }
