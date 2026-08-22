"""
Jan-EPF AI: Comprehensive Row-Level Security (RLS) & Migration Policy Test Suite.
Tests PostgreSQL RLS migration DDL structure, session context generation,
and in-memory tenant/citizen data isolation.
"""
import os
import pytest
from src.core.security_helpers import (
    InMemoryRLSEngine,
    RLSSessionContext,
    SecurityTestHelper,
)


def test_sql_migration_file_structure():
    """
    Validates that migrations/001_initial_rls.sql contains all necessary
    PostgreSQL RLS DDL tables, functions, triggers, and security policies.
    """
    migration_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "migrations",
        "001_initial_rls.sql"
    )
    assert os.path.exists(migration_path), "Migration 001_initial_rls.sql must exist"

    with open(migration_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    # Verify Extensions
    assert "pgcrypto" in sql_content
    assert "uuid-ossp" in sql_content

    # Verify Required Tables
    assert "CREATE TABLE IF NOT EXISTS tenants" in sql_content
    assert "CREATE TABLE IF NOT EXISTS citizen_profiles" in sql_content
    assert "CREATE TABLE IF NOT EXISTS passbook_summaries" in sql_content
    assert "CREATE TABLE IF NOT EXISTS passbook_entries" in sql_content
    assert "CREATE TABLE IF NOT EXISTS member_claims" in sql_content
    assert "CREATE TABLE IF NOT EXISTS encrypted_token_store" in sql_content
    assert "CREATE TABLE IF NOT EXISTS joint_declarations" in sql_content
    assert "CREATE TABLE IF NOT EXISTS security_audit_logs" in sql_content

    # Verify RLS Enablement & Enforcement
    assert "ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE citizen_profiles ENABLE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE passbook_summaries ENABLE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE passbook_entries ENABLE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE member_claims ENABLE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE encrypted_token_store ENABLE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE joint_declarations ENABLE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;" in sql_content

    # Verify Force RLS
    assert "ALTER TABLE citizen_profiles FORCE ROW LEVEL SECURITY;" in sql_content
    assert "ALTER TABLE member_claims FORCE ROW LEVEL SECURITY;" in sql_content

    # Verify Context and Storage Helper Functions
    assert "get_current_tenant_id()" in sql_content
    assert "get_current_uan()" in sql_content
    assert "get_current_role()" in sql_content
    assert "is_rls_bypassed()" in sql_content
    assert "set_session_context(" in sql_content
    assert "clear_session_context()" in sql_content
    assert "store_encrypted_token(" in sql_content
    assert "retrieve_decrypted_token(" in sql_content
    assert "revoke_token(" in sql_content

    # Verify Policies
    assert "CREATE POLICY p_tenants_isolation ON tenants" in sql_content
    assert "CREATE POLICY p_citizen_profiles_isolation ON citizen_profiles" in sql_content
    assert "CREATE POLICY p_passbook_summaries_isolation ON passbook_summaries" in sql_content
    assert "CREATE POLICY p_member_claims_isolation ON member_claims" in sql_content
    assert "CREATE POLICY p_encrypted_token_store_isolation ON encrypted_token_store" in sql_content


def test_rls_session_context_sql_generation():
    """
    Tests that RLSSessionContext produces accurate SET LOCAL statements for PostgreSQL sessions.
    """
    ctx = RLSSessionContext(
        tenant_id="11111111-1111-1111-1111-111111111111",
        uan="100982341201",
        role="citizen",
        bypass_rls=False
    )
    sql_stmts = ctx.to_sql_statements()
    assert len(sql_stmts) == 4
    assert "SET LOCAL app.current_tenant_id = '11111111-1111-1111-1111-111111111111';" in sql_stmts
    assert "SET LOCAL app.current_uan = '100982341201';" in sql_stmts
    assert "SET LOCAL app.current_role = 'citizen';" in sql_stmts
    assert "SET LOCAL app.bypass_rls = 'false';" in sql_stmts


def test_tenant_data_isolation():
    """
    Simulates multi-tenant data access: Tenant A must never access Tenant B's records.
    """
    tenant_a = "11111111-1111-1111-1111-111111111111"
    tenant_b = "22222222-2222-2222-2222-222222222222"

    citizen_a = SecurityTestHelper.generate_mock_citizen_record(
        uan="100982341201", tenant_id=tenant_a, full_name="Ramesh Kumar"
    )
    citizen_b = SecurityTestHelper.generate_mock_citizen_record(
        uan="100982341202", tenant_id=tenant_b, full_name="Priya Sharma"
    )

    all_citizens = [citizen_a, citizen_b]

    # Session for Tenant A (Employer Admin)
    ctx_employer_a = RLSSessionContext(tenant_id=tenant_a, role="employer_admin")
    results_a = InMemoryRLSEngine.filter_rows("citizen_profiles", all_citizens, ctx_employer_a)
    assert len(results_a) == 1
    assert results_a[0]["uan"] == "100982341201"
    assert results_a[0]["full_name"] == "Ramesh Kumar"

    # Session for Tenant B (Employer Admin)
    ctx_employer_b = RLSSessionContext(tenant_id=tenant_b, role="employer_admin")
    results_b = InMemoryRLSEngine.filter_rows("citizen_profiles", all_citizens, ctx_employer_b)
    assert len(results_b) == 1
    assert results_b[0]["uan"] == "100982341202"
    assert results_b[0]["full_name"] == "Priya Sharma"


def test_citizen_row_level_security_isolation():
    """
    Simulates citizen isolation: A citizen can only see their own UAN passbook and claims.
    """
    tenant_id = "11111111-1111-1111-1111-111111111111"
    uan_ramesh = "100982341201"
    uan_gurmeet = "100982341203"

    passbook_ramesh = SecurityTestHelper.generate_mock_passbook_summary(
        uan=uan_ramesh, tenant_id=tenant_id, total_balance=485000.0
    )
    passbook_gurmeet = SecurityTestHelper.generate_mock_passbook_summary(
        uan=uan_gurmeet, tenant_id=tenant_id, total_balance=890000.0
    )

    all_passbooks = [passbook_ramesh, passbook_gurmeet]

    # Session for Ramesh (Citizen)
    ctx_ramesh = RLSSessionContext(tenant_id=tenant_id, uan=uan_ramesh, role="citizen")
    results_ramesh = InMemoryRLSEngine.filter_rows("passbook_summaries", all_passbooks, ctx_ramesh)
    assert len(results_ramesh) == 1
    assert results_ramesh[0]["uan"] == uan_ramesh
    assert results_ramesh[0]["total_balance"] == 485000.0

    # Session for Gurmeet (Citizen)
    ctx_gurmeet = RLSSessionContext(tenant_id=tenant_id, uan=uan_gurmeet, role="citizen")
    results_gurmeet = InMemoryRLSEngine.filter_rows("passbook_summaries", all_passbooks, ctx_gurmeet)
    assert len(results_gurmeet) == 1
    assert results_gurmeet[0]["uan"] == uan_gurmeet
    assert results_gurmeet[0]["total_balance"] == 890000.0

    # Impersonation attempt: Ramesh tries to query Gurmeet's UAN in context
    ctx_tampered = RLSSessionContext(tenant_id=tenant_id, uan="100982349999", role="citizen")
    results_tampered = InMemoryRLSEngine.filter_rows("passbook_summaries", all_passbooks, ctx_tampered)
    assert len(results_tampered) == 0


def test_service_role_and_admin_bypass():
    """
    Tests that EPFO Admin and internal background workers can bypass RLS for batch processing.
    """
    tenant_a = "11111111-1111-1111-1111-111111111111"
    tenant_b = "22222222-2222-2222-2222-222222222222"

    claim_a = SecurityTestHelper.generate_mock_claim_record(uan="100982341201", tenant_id=tenant_a)
    claim_b = SecurityTestHelper.generate_mock_claim_record(uan="100982341202", tenant_id=tenant_b)

    all_claims = [claim_a, claim_b]

    # Service Role
    ctx_service = RLSSessionContext(role="service_role")
    results_service = InMemoryRLSEngine.filter_rows("member_claims", all_claims, ctx_service)
    assert len(results_service) == 2

    # Explicit Bypass Flag
    ctx_bypass = RLSSessionContext(bypass_rls=True)
    results_bypass = InMemoryRLSEngine.filter_rows("member_claims", all_claims, ctx_bypass)
    assert len(results_bypass) == 2


def test_insert_rls_constraints():
    """
    Verifies that unauthorized INSERTs across tenant or UAN boundaries are blocked.
    """
    tenant_id = "11111111-1111-1111-1111-111111111111"
    other_tenant = "99999999-9999-9999-9999-999999999999"
    uan = "100982341201"

    valid_claim = SecurityTestHelper.generate_mock_claim_record(uan=uan, tenant_id=tenant_id)
    cross_tenant_claim = SecurityTestHelper.generate_mock_claim_record(uan=uan, tenant_id=other_tenant)
    other_citizen_claim = SecurityTestHelper.generate_mock_claim_record(uan="100982341209", tenant_id=tenant_id)

    ctx_citizen = RLSSessionContext(tenant_id=tenant_id, uan=uan, role="citizen")

    # 1. Citizen inserting their own claim -> ALLOWED
    assert InMemoryRLSEngine.can_insert("member_claims", valid_claim, ctx_citizen) is True

    # 2. Citizen inserting claim for another tenant -> BLOCKED
    assert InMemoryRLSEngine.can_insert("member_claims", cross_tenant_claim, ctx_citizen) is False

    # 3. Citizen inserting claim under another citizen's UAN -> BLOCKED
    assert InMemoryRLSEngine.can_insert("member_claims", other_citizen_claim, ctx_citizen) is False
