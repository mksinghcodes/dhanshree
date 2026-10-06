-- ==============================================================================
-- MYSQL 8.0/8.4 (INNODB): FINANCIAL TRANSACTIONS & RECONCILIATION ENGINE
-- High-throughput transactional archive, row-level locking, and fiscal partitioning
-- Multi-Market: Nepal (NPR), India (INR), UAE (AED)
-- ==============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ------------------------------------------------------------------------------
-- 1. MERCHANT FINANCIAL BALANCES (InnoDB Row-Level Locking for Payouts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `merchant_balances` (
    `merchant_id` VARCHAR(36) NOT NULL,
    `country_code` VARCHAR(2) NOT NULL DEFAULT 'NP',
    `currency` VARCHAR(3) NOT NULL DEFAULT 'NPR',
    `available_balance` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `pending_escrow_balance` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `lifetime_settled_volume` DECIMAL(16, 2) NOT NULL DEFAULT 0.00,
    `lifetime_tax_remitted` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `last_payout_at` DATETIME NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`merchant_id`, `currency`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. PARTITIONED TRANSACTION JOURNAL ARCHIVE
-- High-speed historical auditing partitioned by fiscal transaction year
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `financial_transactions` (
    `id` VARCHAR(36) NOT NULL,
    `transaction_number` VARCHAR(64) NOT NULL,
    `order_id` VARCHAR(36) NOT NULL,
    `merchant_id` VARCHAR(36) NOT NULL,
    `buyer_id` VARCHAR(36) NOT NULL,
    `country_code` VARCHAR(2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `gross_amount` DECIMAL(14, 2) NOT NULL,
    `tax_amount` DECIMAL(14, 2) NOT NULL,
    `commission_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `net_vendor_amount` DECIMAL(14, 2) NOT NULL,
    `gateway_provider` ENUM('ESEWA', 'KHALTI', 'RAZORPAY', 'CONNECT_IPS', 'COD', 'CARD') NOT NULL,
    `gateway_reference_id` VARCHAR(128) NOT NULL,
    `escrow_status` ENUM('HELD_IN_ESCROW', 'RELEASED', 'REFUNDED', 'CHARGED_BACK') NOT NULL DEFAULT 'HELD_IN_ESCROW',
    `digital_root_vibration` TINYINT UNSIGNED NOT NULL DEFAULT 5,
    `transaction_date` DATETIME NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`, `transaction_date`),
    KEY `idx_merchant_date` (`merchant_id`, `transaction_date`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_gateway_ref` (`gateway_reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (YEAR(`transaction_date`)) (
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p2027 VALUES LESS THAN (2028),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ------------------------------------------------------------------------------
-- 3. PAYMENT GATEWAY RECONCILIATION & WEBHOOK IDEMPOTENCY
-- Prevents duplicate payment credit attacks across eSewa, Khalti, Razorpay
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_gateway_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `idempotency_key` VARCHAR(128) NOT NULL UNIQUE,
    `provider` VARCHAR(32) NOT NULL,
    `gateway_payment_id` VARCHAR(128) NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `signature_hash` VARCHAR(255) NOT NULL,
    `payload_json` JSON NOT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `processed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_prov_ref` (`provider`, `gateway_payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. STORED PROCEDURE: RECONCILE & RELEASE MERCHANT ESCROW PAYOUTS
-- Uses InnoDB Row-Level Locking (`FOR UPDATE`) for zero race-condition financial safety
-- ------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE `ReconcileMerchantPayout`(
    IN p_merchant_id VARCHAR(36),
    IN p_currency VARCHAR(3),
    IN p_release_amount DECIMAL(14, 2),
    OUT p_status_code VARCHAR(32),
    OUT p_new_available_balance DECIMAL(14, 2)
)
proc_label: BEGIN
    DECLARE v_current_escrow DECIMAL(14, 2);
    DECLARE v_current_avail DECIMAL(14, 2);

    -- Start Atomic Transaction
    START TRANSACTION;

    -- Lock row exclusively
    SELECT `pending_escrow_balance`, `available_balance`
    INTO v_current_escrow, v_current_avail
    FROM `merchant_balances`
    WHERE `merchant_id` = p_merchant_id AND `currency` = p_currency
    FOR UPDATE;

    -- Validate existence
    IF v_current_escrow IS NULL THEN
        SET p_status_code = 'MERCHANT_ACCOUNT_NOT_FOUND';
        SET p_new_available_balance = 0.00;
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Verify sufficient escrow held
    IF v_current_escrow < p_release_amount THEN
        SET p_status_code = 'INSUFFICIENT_ESCROW_BALANCE';
        SET p_new_available_balance = v_current_avail;
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Atomic Balance Shift: Escrow -> Available Payout
    UPDATE `merchant_balances`
    SET `pending_escrow_balance` = `pending_escrow_balance` - p_release_amount,
        `available_balance` = `available_balance` + p_release_amount,
        `lifetime_settled_volume` = `lifetime_settled_volume` + p_release_amount,
        `last_payout_at` = NOW()
    WHERE `merchant_id` = p_merchant_id AND `currency` = p_currency;

    -- Fetch updated balance
    SELECT `available_balance` INTO p_new_available_balance
    FROM `merchant_balances`
    WHERE `merchant_id` = p_merchant_id AND `currency` = p_currency;

    SET p_status_code = 'SUCCESS_ESCROW_RELEASED';

    COMMIT;
END //

DELIMITER ;
