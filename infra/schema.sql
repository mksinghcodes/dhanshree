-- ==============================================================================
-- RAW POSTGRESQL 16 DDL: DHANSHREE MULTI-VENDOR MARKETPLACE
-- Launch Markets: Nepal (NP), India (IN), UAE (AE)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 2. Enumerated Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SELLER', 'BUYER', 'SUPPORT', 'FINANCE', 'MODERATOR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('NOT_SUBMITTED', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DOCUMENTS_REQUESTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'INACTIVE', 'REJECTED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE listing_type AS ENUM ('STANDARD', 'AUCTION', 'RFQ_BULK');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE auction_status AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED', 'RESERVE_NOT_MET');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'COD_PENDING_VERIFICATION', 'PROCESSING',
    'PACKED', 'HANDED_OVER_TO_COURIER', 'IN_TRANSIT', 'OUT_FOR_DELIVERY',
    'DELIVERED', 'DELIVERY_FAILED', 'RTO_INITIATED', 'RTO_DELIVERED', 'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'INITIALIZED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'ESCROW_HELD'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status AS ENUM ('NOT_APPLICABLE', 'HELD', 'RELEASED_TO_SELLER', 'DISPUTED', 'REFUNDED_TO_BUYER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE cod_risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'BLOCKED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE return_status AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED', 'ITEM_RECEIVED', 'INSPECTION_PASSED', 'REFUND_ISSUED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payout_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'ON_HOLD');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'WHATSAPP');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Core Tables
CREATE TABLE IF NOT EXISTS countries (
  code VARCHAR(2) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  default_currency VARCHAR(3) NOT NULL,
  default_language VARCHAR(5) NOT NULL,
  phone_prefix VARCHAR(10) NOT NULL,
  is_rtl_default BOOLEAN DEFAULT FALSE,
  is_operational BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  exchange_rate_to_base NUMERIC(14,6) DEFAULT 1.000000,
  decimal_digits INT DEFAULT 2,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  tax_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  rate_percent NUMERIC(5,2) NOT NULL,
  hsn_sac_code VARCHAR(20),
  is_reverse_charge BOOLEAN DEFAULT FALSE,
  tcs_percent NUMERIC(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tax_rules_country_type ON tax_rules(country_code, tax_type);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(25) UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(150) NOT NULL,
  avatar_url VARCHAR(500),
  role user_role DEFAULT 'BUYER',
  status user_status DEFAULT 'ACTIVE',
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  preferred_country VARCHAR(2) DEFAULT 'NP',
  preferred_language VARCHAR(5) DEFAULT 'en',
  preferred_currency VARCHAR(3) DEFAULT 'NPR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  is_revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  alternate_phone VARCHAR(25),
  is_default_shipping BOOLEAN DEFAULT FALSE,
  is_default_billing BOOLEAN DEFAULT FALSE,
  province VARCHAR(100),
  district VARCHAR(100),
  municipality VARCHAR(150),
  ward_number INT,
  tole_street VARCHAR(200),
  state VARCHAR(100),
  district_city VARCHAR(100),
  pin_code VARCHAR(10),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  emirate VARCHAR(50),
  area_neighborhood VARCHAR(150),
  street_name VARCHAR(150),
  building_villa_name VARCHAR(150),
  apartment_villa_number VARCHAR(50),
  makani_number VARCHAR(20),
  po_box VARCHAR(20),
  landmark VARCHAR(200),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_country ON addresses(country_code);

CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(50) NOT NULL,
  operational_country VARCHAR(2) NOT NULL,
  kyc_status kyc_status DEFAULT 'PENDING',
  kyc_rejection_reason TEXT,
  nepal_pan_vat_number VARCHAR(50),
  nepal_citizenship_doc VARCHAR(500),
  nepal_company_reg_doc VARCHAR(500),
  india_pan_number VARCHAR(20),
  india_gstin_number VARCHAR(30),
  india_cin_number VARCHAR(30),
  india_gst_verified BOOLEAN DEFAULT FALSE,
  uae_trade_license_no VARCHAR(50),
  uae_trade_license_doc VARCHAR(500),
  uae_trade_license_expiry TIMESTAMP WITH TIME ZONE,
  uae_emirates_id_masked VARCHAR(30),
  uae_vat_trn_number VARCHAR(30),
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(50),
  bank_iban_or_swift VARCHAR(50),
  bank_branch_or_ifsc VARCHAR(50),
  commission_rate NUMERIC(5,2) DEFAULT 10.00,
  is_featured_seller BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  rating_average NUMERIC(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stores_seller ON stores(seller_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES categories(id),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  banner_url VARCHAR(500),
  display_order INT DEFAULT 0,
  level INT DEFAULT 0,
  hierarchy_path VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_path ON categories(hierarchy_path);

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  description TEXT,
  website_url VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  store_id UUID NOT NULL REFERENCES stores(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  listing_type listing_type DEFAULT 'STANDARD',
  status product_status DEFAULT 'DRAFT',
  sku VARCHAR(100) UNIQUE NOT NULL,
  base_price NUMERIC(12,2) NOT NULL,
  base_currency VARCHAR(3) DEFAULT 'NPR',
  rating_average NUMERIC(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  seo_title VARCHAR(255),
  seo_description VARCHAR(500),
  seo_keywords VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_title_trgm ON products USING gin (title gin_trgm_ops);

CREATE TABLE IF NOT EXISTS product_country_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  currency VARCHAR(3) NOT NULL,
  original_price NUMERIC(12,2) NOT NULL,
  sale_price NUMERIC(12,2),
  cost_price NUMERIC(12,2),
  is_available_in_country BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, country_code)
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  title VARCHAR(150) NOT NULL,
  attributes JSONB NOT NULL,
  weight_grams INT,
  length_cm NUMERIC(8,2),
  width_cm NUMERIC(8,2),
  height_cm NUMERIC(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_thumbnail BOOLEAN DEFAULT FALSE,
  media_type VARCHAR(20) DEFAULT 'IMAGE'
);

CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  name VARCHAR(150) NOT NULL,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  address_id UUID NOT NULL REFERENCES addresses(id),
  contact_phone VARCHAR(25) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity_available INT DEFAULT 0,
  quantity_reserved INT DEFAULT 0,
  safety_stock_threshold INT DEFAULT 5,
  restock_lead_days INT DEFAULT 3,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(variant_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  guest_session_id VARCHAR(255) UNIQUE,
  country_code VARCHAR(2) DEFAULT 'NP',
  currency_code VARCHAR(3) DEFAULT 'NPR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  quantity INT DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  shipping_address_id UUID NOT NULL REFERENCES addresses(id),
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  currency_code VARCHAR(3) NOT NULL,
  order_status order_status DEFAULT 'PENDING_PAYMENT',
  payment_status payment_status DEFAULT 'PENDING',
  payment_method VARCHAR(50) NOT NULL,
  subtotal_amount NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) DEFAULT 0.00,
  shipping_amount NUMERIC(12,2) DEFAULT 0.00,
  tax_amount NUMERIC(12,2) DEFAULT 0.00,
  grand_total_amount NUMERIC(12,2) NOT NULL,
  is_cod BOOLEAN DEFAULT FALSE,
  cod_fee NUMERIC(10,2) DEFAULT 0.00,
  cod_risk_level cod_risk_level DEFAULT 'LOW',
  cod_otp_verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_country ON orders(country_code);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  store_id UUID NOT NULL REFERENCES stores(id),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  product_title VARCHAR(255) NOT NULL,
  variant_title VARCHAR(150) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  quantity INT DEFAULT 1,
  tax_rate_percent NUMERIC(5,2) DEFAULT 0.00,
  tax_amount NUMERIC(12,2) DEFAULT 0.00,
  discount_amount NUMERIC(12,2) DEFAULT 0.00,
  total_price NUMERIC(12,2) NOT NULL,
  item_status VARCHAR(50) DEFAULT 'PENDING'
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_seller ON order_items(seller_id);

CREATE TABLE IF NOT EXISTS order_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  triggered_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  tax_registration_number VARCHAR(50),
  pdf_url VARCHAR(500),
  bilingual_data JSONB,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gateway_provider VARCHAR(50) NOT NULL,
  transaction_reference VARCHAR(150) UNIQUE NOT NULL,
  external_payment_id VARCHAR(150),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status payment_status DEFAULT 'PENDING',
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_holds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  total_amount NUMERIC(12,2) NOT NULL,
  commission_fee NUMERIC(12,2) NOT NULL,
  tax_withheld_tcs NUMERIC(12,2) DEFAULT 0.00,
  net_payable_to_seller NUMERIC(12,2) NOT NULL,
  escrow_status escrow_status DEFAULT 'HELD',
  release_eligible_at TIMESTAMP WITH TIME ZONE NOT NULL,
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seller_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  payout_method VARCHAR(50) NOT NULL,
  destination_account VARCHAR(100) NOT NULL,
  status payout_status DEFAULT 'PENDING',
  reference_number VARCHAR(100) UNIQUE,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier_partner VARCHAR(50) NOT NULL,
  tracking_number VARCHAR(100) UNIQUE NOT NULL,
  waybill_url VARCHAR(500),
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  shipping_status VARCHAR(50) DEFAULT 'MANIFESTED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(150),
  description TEXT,
  event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  order_item_id UUID NOT NULL REFERENCES order_items(id),
  user_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  reason VARCHAR(255) NOT NULL,
  evidence_images JSONB,
  return_status return_status DEFAULT 'REQUESTED',
  tracking_number VARCHAR(100),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_return_id UUID REFERENCES order_returns(id),
  payment_transaction_id UUID NOT NULL REFERENCES payment_transactions(id),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  refund_reason VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(150),
  comment TEXT,
  photo_urls JSONB,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_votes INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  discount_type VARCHAR(20) NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0.00,
  max_discount_amount NUMERIC(10,2),
  applicable_country VARCHAR(2),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  user_id UUID NOT NULL REFERENCES users(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  discount_amount NUMERIC(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  starting_bid_price NUMERIC(12,2) NOT NULL,
  reserve_price NUMERIC(12,2),
  bid_increment NUMERIC(10,2) DEFAULT 100.00,
  current_highest_bid NUMERIC(12,2) DEFAULT 0.00,
  current_winner_id UUID,
  currency VARCHAR(3) NOT NULL,
  status auction_status DEFAULT 'SCHEDULED',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  total_bids INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auction_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bid_amount NUMERIC(12,2) NOT NULL,
  is_winning BOOLEAN DEFAULT FALSE,
  is_proxy_bid BOOLEAN DEFAULT FALSE,
  max_proxy_amount NUMERIC(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rfq_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  target_quantity INT NOT NULL,
  target_price_per_unit NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  destination_country VARCHAR(2) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'OPEN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel notification_channel DEFAULT 'IN_APP',
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
