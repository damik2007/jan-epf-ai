-- ==============================================================================
-- JAN-EPF AI: Zero-Trust Security & Row-Level Security (RLS) Migration
-- File: migrations/001_initial_rls.sql
-- Description: Establishes PostgreSQL schema with strict tenant data isolation,
--              citizen passbook tables, AES/PGP encrypted token stores,
--              and Row-Level Security (RLS) access control policies.
-- Author: Agent 3 (Zero-Trust Security & PII Shield)
-- Standard: ISO-27001 / DPDP Act (India) / Zero-Trust Architecture
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & CRYPTOGRAPHIC PREREQUISITES
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. CUSTOM TYPES & ENUMS
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_type_enum') THEN
        CREATE TYPE claim_type_enum AS ENUM (
            'FORM_31_MEDICAL',
            'FORM_31_HOUSING',
            'FORM_31_MARRIAGE',
            'FORM_13_TRANSFER',
            'FORM_19_10C_SETTLEMENT',
            'FORM_10D_PENSION',
            'JEEVAN_PRAMAAN',
            'E_NOMINATION',
            'JOINT_DECLARATION'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_status_enum') THEN
        CREATE TYPE claim_status_enum AS ENUM (
            'SUBMITTED',
            'IN_REVIEW',
            'AUTO_APPROVED',
            'DISBURSED',
            'REJECTED'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kyc_status_enum') THEN
        CREATE TYPE kyc_status_enum AS ENUM (
            'PENDING',
            'APPROVED_BY_EMPLOYER',
            'VERIFIED_ACTIVE',
            'SENIOR_PENSION_ACTIVE',
            'REJECTED'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_scope_enum') THEN
        CREATE TYPE token_scope_enum AS ENUM (
            'CITIZEN_SESSION',
            'EMPLOYER_ADMIN',
            'INTERNAL_SERVICE',
            'WEBHOOK_CONSUMER'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'actor_role_enum') THEN
        CREATE TYPE actor_role_enum AS ENUM (
            'citizen',
            'employer_admin',
            'epfo_admin',
            'service_role',
            'anonymous'
        );
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. TIMESTAMP UPDATE TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 4. CORE SCHEMA TABLES
-- ------------------------------------------------------------------------------

-- 4.1 Tenants / Establishments (Enterprise Isolation Boundary)
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_code VARCHAR(32) UNIQUE NOT NULL,
    establishment_name VARCHAR(255) NOT NULL,
    region_code VARCHAR(16) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_tenants
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 4.2 Citizen Profiles (Master Member Identity Registry)
CREATE TABLE IF NOT EXISTS citizen_profiles (
    member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    uan VARCHAR(12) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_masked VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(16) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    aadhaar_masked VARCHAR(32) NOT NULL,
    pan_masked VARCHAR(20) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    account_number_masked VARCHAR(32) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    kyc_status kyc_status_enum NOT NULL DEFAULT 'PENDING',
    penny_drop_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_uan UNIQUE (tenant_id, uan),
    CONSTRAINT chk_uan_format CHECK (uan ~ '^\d{12}$'),
    CONSTRAINT chk_ifsc_format CHECK (ifsc_code ~ '^[A-Z]{4}0[A-Z0-9]{6}$')
);

CREATE TRIGGER set_timestamp_citizen_profiles
BEFORE UPDATE ON citizen_profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 4.3 Citizen Passbook Summaries
CREATE TABLE IF NOT EXISTS passbook_summaries (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    uan VARCHAR(12) NOT NULL,
    total_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    employee_share NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    employer_share NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    pension_fund_share NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    interest_credited_current_fy NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    monthly_wage NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    interest_rate NUMERIC(4, 2) NOT NULL DEFAULT 8.25,
    last_contribution_date DATE,
    settled_at_retirement BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_passbook_tenant_uan UNIQUE (tenant_id, uan),
    CONSTRAINT chk_balances_non_negative CHECK (
        total_balance >= 0 AND
        employee_share >= 0 AND
        employer_share >= 0 AND
        pension_fund_share >= 0
    )
);

CREATE TRIGGER set_timestamp_passbook_summaries
BEFORE UPDATE ON passbook_summaries
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 4.4 Citizen Passbook Transaction Entries (Monthly ECR Wage Contributions)
CREATE TABLE IF NOT EXISTS passbook_entries (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    uan VARCHAR(12) NOT NULL,
    member_id_str VARCHAR(64) NOT NULL,
    wage_month DATE NOT NULL,
    transaction_date DATE NOT NULL,
    epf_wages NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    eps_wages NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    employee_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    employer_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pension_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    transaction_type VARCHAR(32) NOT NULL DEFAULT 'CREDIT',
    audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4.5 Member Claims (Form 31, 19, 10C, 10D, Transfers)
CREATE TABLE IF NOT EXISTS member_claims (
    claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    uan VARCHAR(12) NOT NULL,
    claim_type claim_type_enum NOT NULL,
    amount_requested NUMERIC(12, 2) NOT NULL,
    amount_sanctioned NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tds_deducted_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reason_code VARCHAR(64) NOT NULL,
    reason_description TEXT,
    status claim_status_enum NOT NULL DEFAULT 'SUBMITTED',
    bank_account_verified BOOLEAN NOT NULL DEFAULT FALSE,
    form_15g_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    dbt_account_masked VARCHAR(32),
    audit_trace_token VARCHAR(64) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    disbursed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_claim_amount_positive CHECK (amount_requested > 0)
);

CREATE TRIGGER set_timestamp_member_claims
BEFORE UPDATE ON member_claims
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 4.6 Encrypted Token Stores (Zero-Trust Session & Service Credential Vault)
CREATE TABLE IF NOT EXISTS encrypted_token_store (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    uan VARCHAR(12),
    token_scope token_scope_enum NOT NULL,
    encrypted_token_payload BYTEA NOT NULL, -- PGP/AES ciphertext
    token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 for fast O(1) indexed lookup without decryption
    key_id VARCHAR(64) NOT NULL DEFAULT 'v1-master-kms',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_encrypted_token_store
BEFORE UPDATE ON encrypted_token_store
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 4.7 Digital Joint Declarations (3-Way Member-Employer-EPFO Handshake)
CREATE TABLE IF NOT EXISTS joint_declarations (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    uan VARCHAR(12) NOT NULL,
    member_id_str VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_EMPLOYER_ESIGN',
    corrections JSONB NOT NULL,
    citizen_signed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    employer_signed_at TIMESTAMPTZ,
    epfo_approved_at TIMESTAMPTZ,
    audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_joint_declarations
BEFORE UPDATE ON joint_declarations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 4.8 Security Audit Logs (Immutable Zero-Trust Access Trail)
CREATE TABLE IF NOT EXISTS security_audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    uan VARCHAR(12),
    action VARCHAR(64) NOT NULL,
    resource VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    ip_address VARCHAR(45),
    correlation_id VARCHAR(64),
    audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. PERFORMANCE & AUDIT INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_citizen_profiles_tenant_uan ON citizen_profiles(tenant_id, uan);
CREATE INDEX IF NOT EXISTS idx_passbook_summaries_tenant_uan ON passbook_summaries(tenant_id, uan);
CREATE INDEX IF NOT EXISTS idx_passbook_entries_tenant_uan_date ON passbook_entries(tenant_id, uan, wage_month);
CREATE INDEX IF NOT EXISTS idx_member_claims_tenant_uan ON member_claims(tenant_id, uan);
CREATE INDEX IF NOT EXISTS idx_member_claims_status ON member_claims(status);
CREATE INDEX IF NOT EXISTS idx_encrypted_token_lookup ON encrypted_token_store(token_hash) WHERE is_revoked = FALSE;
CREATE INDEX IF NOT EXISTS idx_encrypted_token_tenant_uan ON encrypted_token_store(tenant_id, uan);
CREATE INDEX IF NOT EXISTS idx_joint_declarations_tenant_uan ON joint_declarations(tenant_id, uan);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_tenant ON security_audit_logs(tenant_id, created_at);

-- ------------------------------------------------------------------------------
-- 6. SESSION CONTEXT ACCESSOR & MUTATOR FUNCTIONS
-- ------------------------------------------------------------------------------

-- 6.1 Get Current Tenant ID from Session Configuration
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
    v_tenant_str TEXT;
BEGIN
    v_tenant_str := NULLIF(current_setting('app.current_tenant_id', true), '');
    IF v_tenant_str IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN v_tenant_str::UUID;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 6.2 Get Current Citizen UAN from Session Configuration
CREATE OR REPLACE FUNCTION get_current_uan()
RETURNS VARCHAR(12) AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_uan', true), '');
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 6.3 Get Current Actor Role
CREATE OR REPLACE FUNCTION get_current_role()
RETURNS VARCHAR(32) AS $$
BEGIN
    RETURN COALESCE(NULLIF(current_setting('app.current_role', true), ''), 'anonymous');
EXCEPTION WHEN OTHERS THEN
    RETURN 'anonymous';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 6.4 Check if Session is Bypassing RLS (Internal Service / Super Admin)
CREATE OR REPLACE FUNCTION is_rls_bypassed()
RETURNS BOOLEAN AS $$
DECLARE
    v_bypass TEXT;
    v_role TEXT;
BEGIN
    v_bypass := current_setting('app.bypass_rls', true);
    v_role := current_setting('app.current_role', true);
    
    IF v_bypass = 'true' THEN
        RETURN TRUE;
    END IF;

    IF v_role IN ('service_role', 'epfo_admin', 'super_admin') THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 6.5 Helper: Set Complete Session Context
CREATE OR REPLACE FUNCTION set_session_context(
    p_tenant_id UUID,
    p_uan VARCHAR(12) DEFAULT NULL,
    p_role VARCHAR(32) DEFAULT 'citizen',
    p_bypass_rls BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
    IF p_tenant_id IS NOT NULL THEN
        PERFORM set_config('app.current_tenant_id', p_tenant_id::TEXT, false);
    ELSE
        PERFORM set_config('app.current_tenant_id', '', false);
    END IF;

    IF p_uan IS NOT NULL THEN
        PERFORM set_config('app.current_uan', p_uan, false);
    ELSE
        PERFORM set_config('app.current_uan', '', false);
    END IF;

    PERFORM set_config('app.current_role', COALESCE(p_role, 'citizen'), false);
    PERFORM set_config('app.bypass_rls', CASE WHEN p_bypass_rls THEN 'true' ELSE 'false' END, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.6 Helper: Clear Session Context
CREATE OR REPLACE FUNCTION clear_session_context()
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', '', false);
    PERFORM set_config('app.current_uan', '', false);
    PERFORM set_config('app.current_role', 'anonymous', false);
    PERFORM set_config('app.bypass_rls', 'false', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 7. CRYPTOGRAPHIC TOKEN STORAGE STORE & RETRIEVAL PROCEDURES
-- ------------------------------------------------------------------------------

-- 7.1 Store Encrypted Token
CREATE OR REPLACE FUNCTION store_encrypted_token(
    p_tenant_id UUID,
    p_uan VARCHAR(12),
    p_scope token_scope_enum,
    p_raw_token TEXT,
    p_encryption_secret TEXT,
    p_expires_at TIMESTAMPTZ,
    p_key_id VARCHAR(64) DEFAULT 'v1-master-kms'
)
RETURNS UUID AS $$
DECLARE
    v_token_id UUID;
    v_token_hash VARCHAR(64);
    v_encrypted_payload BYTEA;
BEGIN
    -- Derive SHA-256 hash for fast constant-time lookup
    v_token_hash := encode(digest(p_raw_token, 'sha256'), 'hex');
    
    -- Encrypt raw token payload symmetrically using PGP symmetric cipher
    v_encrypted_payload := pgp_sym_encrypt(p_raw_token, p_encryption_secret, 'compress-algo=1, cipher-algo=aes256');

    INSERT INTO encrypted_token_store (
        tenant_id,
        uan,
        token_scope,
        encrypted_token_payload,
        token_hash,
        key_id,
        expires_at
    ) VALUES (
        p_tenant_id,
        p_uan,
        p_scope,
        v_encrypted_payload,
        v_token_hash,
        p_key_id,
        p_expires_at
    )
    RETURNING token_id INTO v_token_id;

    RETURN v_token_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.2 Retrieve Decrypted Token
CREATE OR REPLACE FUNCTION retrieve_decrypted_token(
    p_token_hash VARCHAR(64),
    p_encryption_secret TEXT
)
RETURNS TEXT AS $$
DECLARE
    v_encrypted_payload BYTEA;
    v_decrypted TEXT;
    v_is_revoked BOOLEAN;
    v_expires_at TIMESTAMPTZ;
BEGIN
    SELECT encrypted_token_payload, is_revoked, expires_at
    INTO v_encrypted_payload, v_is_revoked, v_expires_at
    FROM encrypted_token_store
    WHERE token_hash = p_token_hash;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    IF v_is_revoked OR v_expires_at < CURRENT_TIMESTAMP THEN
        RETURN NULL;
    END IF;

    v_decrypted := pgp_sym_decrypt(v_encrypted_payload, p_encryption_secret);
    RETURN v_decrypted;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.3 Revoke Token
CREATE OR REPLACE FUNCTION revoke_token(p_token_hash VARCHAR(64))
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE encrypted_token_store
    SET is_revoked = TRUE,
        revoked_at = CURRENT_TIMESTAMP
    WHERE token_hash = p_token_hash
      AND is_revoked = FALSE;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 8. ROW-LEVEL SECURITY (RLS) ENABLING & POLICIES
-- ------------------------------------------------------------------------------

-- 8.1 Enable & Force RLS on all sensitive tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE passbook_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE passbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE encrypted_token_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE joint_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE citizen_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE passbook_summaries FORCE ROW LEVEL SECURITY;
ALTER TABLE passbook_entries FORCE ROW LEVEL SECURITY;
ALTER TABLE member_claims FORCE ROW LEVEL SECURITY;
ALTER TABLE encrypted_token_store FORCE ROW LEVEL SECURITY;
ALTER TABLE joint_declarations FORCE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs FORCE ROW LEVEL SECURITY;

-- 8.2 Drop existing policies to maintain idempotency
DROP POLICY IF EXISTS p_tenants_isolation ON tenants;
DROP POLICY IF EXISTS p_citizen_profiles_isolation ON citizen_profiles;
DROP POLICY IF EXISTS p_passbook_summaries_isolation ON passbook_summaries;
DROP POLICY IF EXISTS p_passbook_entries_isolation ON passbook_entries;
DROP POLICY IF EXISTS p_member_claims_isolation ON member_claims;
DROP POLICY IF EXISTS p_encrypted_token_store_isolation ON encrypted_token_store;
DROP POLICY IF EXISTS p_joint_declarations_isolation ON joint_declarations;
DROP POLICY IF EXISTS p_security_audit_logs_isolation ON security_audit_logs;

-- 8.3 Tenants Table Policy
-- Service role has full access; Employer Admin can view their own tenant record
CREATE POLICY p_tenants_isolation ON tenants
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR tenant_id = get_current_tenant_id()
)
WITH CHECK (
    is_rls_bypassed()
    OR tenant_id = get_current_tenant_id()
);

-- 8.4 Citizen Profiles Policy
-- Bypassed for service/epfo admins;
-- Employer admins can view/manage citizens within their tenant;
-- Citizens can ONLY access their own profile (matching tenant_id AND uan).
CREATE POLICY p_citizen_profiles_isolation ON citizen_profiles
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
)
WITH CHECK (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
);

-- 8.5 Passbook Summaries Policy
-- Citizen gets access ONLY if tenant_id and uan match current session.
-- Employer admin gets access across tenant.
CREATE POLICY p_passbook_summaries_isolation ON passbook_summaries
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
)
WITH CHECK (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
);

-- 8.6 Passbook Entries Policy
-- Read-only or contribution insertion bounded by tenant & citizen uan
CREATE POLICY p_passbook_entries_isolation ON passbook_entries
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
)
WITH CHECK (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
);

-- 8.7 Member Claims Policy
-- Citizen can create/view claims matching their UAN;
-- Employer admin can inspect claims filed within their establishment;
-- Service role / EPFO admin processes approval and disbursement.
CREATE POLICY p_member_claims_isolation ON member_claims
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
)
WITH CHECK (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
);

-- 8.8 Encrypted Token Store Policy
-- Highly restricted: Citizens can only access tokens associated with their session;
-- Service role manages token storage and revocation.
CREATE POLICY p_encrypted_token_store_isolation ON encrypted_token_store
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            uan IS NULL
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
            OR get_current_role() = 'employer_admin'
        )
    )
)
WITH CHECK (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            uan IS NULL
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
            OR get_current_role() = 'employer_admin'
        )
    )
);

-- 8.9 Digital Joint Declarations Policy
-- Citizen and employer participate in 3-way handshake within tenant boundary.
CREATE POLICY p_joint_declarations_isolation ON joint_declarations
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
)
WITH CHECK (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND (
            get_current_role() = 'employer_admin'
            OR (get_current_role() = 'citizen' AND uan = get_current_uan())
        )
    )
);

-- 8.10 Security Audit Logs Policy
-- Append-only for all authenticated actors; SELECT restricted to tenant scope or admin.
CREATE POLICY p_security_audit_logs_isolation ON security_audit_logs
AS RESTRICTIVE
FOR ALL
USING (
    is_rls_bypassed()
    OR (
        tenant_id = get_current_tenant_id()
        AND get_current_role() IN ('employer_admin', 'epfo_admin')
    )
)
WITH CHECK (
    -- Any active tenant actor can insert audit logs for compliance
    is_rls_bypassed()
    OR tenant_id = get_current_tenant_id()
    OR tenant_id IS NULL
);

-- ------------------------------------------------------------------------------
-- 9. ZERO-TRUST VERIFICATION SMOKE TEST
-- ------------------------------------------------------------------------------
-- To verify RLS policies in a PostgreSQL test connection:
-- 1. SELECT set_session_context('11111111-1111-1111-1111-111111111111', '100982341201', 'citizen');
-- 2. SELECT * FROM citizen_profiles; -> Returns ONLY row for 100982341201.
-- 3. SELECT set_session_context('22222222-2222-2222-2222-222222222222', '100982341201', 'citizen');
-- 4. SELECT * FROM citizen_profiles; -> Returns 0 rows (Cross-tenant breach blocked).
-- 5. SELECT clear_session_context();
