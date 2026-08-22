-- Jan-EPF AI: PostgreSQL Initialization & pgvector Extension Script
-- Enables vector embeddings, UUID generation, and Row-Level Security (RLS) foundations

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Create Audit Schema
CREATE SCHEMA IF NOT EXISTS epf_audit;

-- 3. Mock Claims Table with RLS
CREATE TABLE IF NOT EXISTS member_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id VARCHAR(64) UNIQUE NOT NULL,
    uan VARCHAR(12) NOT NULL,
    claim_type VARCHAR(32) NOT NULL,
    amount_requested NUMERIC(12, 2) NOT NULL,
    net_disbursed NUMERIC(12, 2),
    tds_deducted NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED',
    settlement_tier VARCHAR(16) NOT NULL,
    pension_eligible BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
    settled_timestamp TIMESTAMPTZ,
    signature_sha256 VARCHAR(64) NOT NULL
);

-- Enable Row-Level Security (RLS)
ALTER TABLE member_claims ENABLE ROW LEVEL SECURITY;

-- 4. Mock Passbook Entries Table with RLS
CREATE TABLE IF NOT EXISTS passbook_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uan VARCHAR(12) NOT NULL,
    financial_year VARCHAR(10) NOT NULL,
    wage_month VARCHAR(10) NOT NULL,
    employee_share NUMERIC(10, 2) NOT NULL,
    employer_share NUMERIC(10, 2) NOT NULL,
    pension_share NUMERIC(10, 2) NOT NULL,
    interest_credited NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security (RLS)
ALTER TABLE passbook_entries ENABLE ROW LEVEL SECURITY;

-- 5. Vector Store for Grievance & Circular Semantic Search
CREATE TABLE IF NOT EXISTS epfo_circular_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circular_ref VARCHAR(128) NOT NULL,
    title TEXT NOT NULL,
    category VARCHAR(64),
    content_chunk TEXT NOT NULL,
    embedding vector(1536), -- OpenAI / Open-Source embedding dimensions
    published_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Fast Cosine Distance Search on embeddings
CREATE INDEX IF NOT EXISTS epfo_circular_vector_idx 
    ON epfo_circular_embeddings 
    USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);

-- Log Successful Init
DO $$
BEGIN
    RAISE NOTICE 'Jan-EPF AI Database Initialized Successfully with pgvector and RLS.';
END $$;
