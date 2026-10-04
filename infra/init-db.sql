-- PostgreSQL Initialization Script
-- Enables UUID generation and trigram search extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'PostgreSQL initial extensions installed successfully for Dhanshree Database';
END $$;
