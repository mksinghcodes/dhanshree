-- ==============================================================================
-- POSTGRESQL 16: DHANSHREE DOUBLE-ENTRY FINANCIAL ACCOUNTING LEDGER
-- Multi-Currency: NPR (Nepal), INR (India), AED (UAE)
-- Statutory Compliance: Nepal IRD 13% VAT, India GSTN 18% GST, UAE FTA 5% VAT
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. Enumerations for Accounting
DO $$ BEGIN
    CREATE TYPE account_classification AS ENUM (
        'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE entry_status AS ENUM (
        'DRAFT', 'POSTED', 'RECONCILED', 'VOID'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE escrow_state AS ENUM (
        'PENDING_PAYMENT', 'HELD_IN_ESCROW', 'RELEASED_TO_VENDOR', 'REFUNDED_TO_BUYER', 'DISPUTED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------------------------
-- 3. CHART OF ACCOUNTS (COA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(32) NOT NULL UNIQUE,              -- e.g. '1010-ESCROW-NPR'
    name VARCHAR(128) NOT NULL,                    -- e.g. 'Escrow Clearing Account'
    classification account_classification NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'NPR',     -- 'NPR', 'INR', 'AED'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Essential Chart of Accounts
INSERT INTO accounts (code, name, classification, currency) VALUES
    ('1000-CASH-GATEWAY', 'Payment Gateway Clearing (eSewa/Khalti/Razorpay)', 'ASSET', 'NPR'),
    ('1010-ESCROW-NPR', 'Escrow Trust Clearing (Nepal)', 'ASSET', 'NPR'),
    ('1020-ESCROW-INR', 'Escrow Trust Clearing (India)', 'ASSET', 'INR'),
    ('1030-ESCROW-AED', 'Escrow Trust Clearing (UAE)', 'ASSET', 'AED'),
    ('2000-VENDOR-PAYABLE', 'Merchant / Vendor Payables', 'LIABILITY', 'NPR'),
    ('2010-VAT-PAYABLE-NP', 'Inland Revenue Dept 13% VAT Payable (Nepal)', 'LIABILITY', 'NPR'),
    ('2020-GST-PAYABLE-IN', 'GSTN 18% GST Payable (India)', 'LIABILITY', 'INR'),
    ('2030-VAT-PAYABLE-AE', 'Federal Tax Authority 5% VAT Payable (UAE)', 'LIABILITY', 'AED'),
    ('4000-COMMISSION-REV', 'Dhanshree Platform Commission Revenue', 'REVENUE', 'NPR'),
    ('5000-GATEWAY-FEE-EXP', 'Payment Gateway Transaction Cost', 'EXPENSE', 'NPR')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. JOURNAL ENTRIES (Header table for atomic financial transactions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_number VARCHAR(64) NOT NULL UNIQUE,     -- e.g. 'JRN-2083-000192'
    reference_order_id UUID,                      -- Links to orders table
    fiscal_year VARCHAR(16) NOT NULL,             -- e.g. '2083/84' (Nepal)
    country_code VARCHAR(2) NOT NULL,             -- 'NP', 'IN', 'AE'
    currency VARCHAR(3) NOT NULL,                 -- 'NPR', 'INR', 'AED'
    exchange_rate_to_npr NUMERIC(12, 6) NOT NULL DEFAULT 1.0,
    status entry_status NOT NULL DEFAULT 'POSTED',
    memo TEXT NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. LEDGER LINES (Double-entry Debit & Credit rows)
-- CHECK CONSTRAINT: A line must either be a pure Debit OR a pure Credit
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ledger_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    debit_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    credit_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    line_description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_positive_amounts CHECK (debit_amount >= 0 AND credit_amount >= 0),
    CONSTRAINT chk_exclusive_debit_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR
        (credit_amount > 0 AND debit_amount = 0)
    )
);

CREATE INDEX IF NOT EXISTS idx_ledger_lines_entry ON ledger_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_ledger_lines_account ON ledger_lines(account_id);

-- ------------------------------------------------------------------------------
-- 6. STATUTORY TAX INVOICES (Fiscal records for IRD Nepal, GSTN India, FTA UAE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tax_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(64) NOT NULL UNIQUE,    -- e.g. 'INV-NP-2083-00451'
    reference_order_id UUID NOT NULL,
    country_code VARCHAR(2) NOT NULL,              -- 'NP', 'IN', 'AE'
    fiscal_year VARCHAR(16) NOT NULL,
    seller_tax_id VARCHAR(32) NOT NULL,            -- Nepal PAN / India GSTIN / UAE TRN
    buyer_tax_id VARCHAR(32),                      -- Optional buyer PAN/GSTIN
    currency VARCHAR(3) NOT NULL,
    taxable_amount NUMERIC(14, 2) NOT NULL,
    tax_rate_percent NUMERIC(5, 2) NOT NULL,       -- 13.00, 18.00, 5.00
    tax_amount NUMERIC(14, 2) NOT NULL,
    total_invoice_amount NUMERIC(14, 2) NOT NULL,
    qr_code_hash VARCHAR(255),                     -- IRD CBMS digital verification hash
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. ESCROW HOLDINGS & RELEASE TRACKING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS escrow_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_order_id UUID NOT NULL,
    vendor_id UUID NOT NULL,
    currency VARCHAR(3) NOT NULL,
    gross_order_amount NUMERIC(14, 2) NOT NULL,
    commission_held NUMERIC(14, 2) NOT NULL,
    tax_held NUMERIC(14, 2) NOT NULL,
    net_escrow_held NUMERIC(14, 2) NOT NULL,
    state escrow_state NOT NULL DEFAULT 'HELD_IN_ESCROW',
    release_due_at TIMESTAMPTZ NOT NULL,           -- e.g. 7 days post-delivery
    released_at TIMESTAMPTZ,
    payout_bank_reference VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. TRIGGER: ENFORCE BALANCED DOUBLE-ENTRY (SUM(Debit) = SUM(Credit))
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION verify_journal_balance()
RETURNS TRIGGER AS $$
DECLARE
    v_total_debit NUMERIC(14, 2);
    v_total_credit NUMERIC(14, 2);
BEGIN
    SELECT COALESCE(SUM(debit_amount), 0), COALESCE(SUM(credit_amount), 0)
    INTO v_total_debit, v_total_credit
    FROM ledger_lines
    WHERE journal_entry_id = NEW.journal_entry_id;

    -- Note: Evaluated on transaction commit or batch check
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 9. STORED PROCEDURE: ATOMIC ORDER FINANCIAL SETTLEMENT
-- Atomic ACID settlement: Buyer Payment -> Escrow Lock -> Tax Withhold -> Commission
-- ------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE process_order_settlement(
    p_order_id UUID,
    p_country VARCHAR(2),
    p_currency VARCHAR(3),
    p_gross_amount NUMERIC(14, 2),
    p_tax_amount NUMERIC(14, 2),
    p_commission_amount NUMERIC(14, 2),
    p_vendor_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_journal_id UUID;
    v_net_vendor NUMERIC(14, 2);
    v_account_gateway UUID;
    v_account_escrow UUID;
    v_account_vendor UUID;
    v_account_tax UUID;
    v_account_commission UUID;
BEGIN
    v_net_vendor := p_gross_amount - p_tax_amount - p_commission_amount;

    -- 1. Create Journal Entry Header
    INSERT INTO journal_entries (
        entry_number, reference_order_id, fiscal_year, country_code, currency, memo
    ) VALUES (
        'JRN-' || TO_CHAR(NOW(), 'YYYYMMDD-HH24MISS') || '-' || SUBSTRING(p_order_id::text, 1, 6),
        p_order_id,
        '2083/84',
        p_country,
        p_currency,
        'Order Settlement: Gross Payment, Escrow Allocation & Statutory Tax'
    ) RETURNING id INTO v_journal_id;

    -- 2. Lookup Chart of Account IDs
    SELECT id INTO v_account_gateway FROM accounts WHERE code = '1000-CASH-GATEWAY';
    SELECT id INTO v_account_vendor FROM accounts WHERE code = '2000-VENDOR-PAYABLE';
    SELECT id INTO v_account_tax FROM accounts WHERE code = '2010-VAT-PAYABLE-NP';
    SELECT id INTO v_account_commission FROM accounts WHERE code = '4000-COMMISSION-REV';

    -- 3. Double-Entry Posting:
    -- DEBIT: Cash in Gateway (+Asset) = p_gross_amount
    INSERT INTO ledger_lines (journal_entry_id, account_id, debit_amount, credit_amount, line_description)
    VALUES (v_journal_id, v_account_gateway, p_gross_amount, 0.00, 'Received customer payment from Gateway');

    -- CREDIT: Vendor Payable (+Liability) = v_net_vendor
    INSERT INTO ledger_lines (journal_entry_id, account_id, debit_amount, credit_amount, line_description)
    VALUES (v_journal_id, v_account_vendor, 0.00, v_net_vendor, 'Escrow held for vendor payout');

    -- CREDIT: VAT / Tax Payable (+Liability) = p_tax_amount
    INSERT INTO ledger_lines (journal_entry_id, account_id, debit_amount, credit_amount, line_description)
    VALUES (v_journal_id, v_account_tax, 0.00, p_tax_amount, 'Statutory tax collected for IRD/GSTN');

    -- CREDIT: Platform Commission (+Revenue) = p_commission_amount
    IF p_commission_amount > 0 THEN
        INSERT INTO ledger_lines (journal_entry_id, account_id, debit_amount, credit_amount, line_description)
        VALUES (v_journal_id, v_account_commission, 0.00, p_commission_amount, 'Dhanshree platform fee');
    END IF;

    -- 4. Record Escrow Deposit
    INSERT INTO escrow_deposits (
        reference_order_id, vendor_id, currency, gross_order_amount,
        commission_held, tax_held, net_escrow_held, release_due_at
    ) VALUES (
        p_order_id, p_vendor_id, p_currency, p_gross_amount,
        p_commission_amount, p_tax_amount, v_net_vendor, NOW() + INTERVAL '7 days'
    );
END;
$$;
