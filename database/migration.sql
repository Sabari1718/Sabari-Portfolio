-- ============================================================
-- Sabari Portfolio — Database Migration
-- Run this ONCE against your existing sabari_portfolio DB
-- Safe to run: uses IF NOT EXISTS / column-existence checks
-- ============================================================

USE sabari_portfolio;

-- -----------------------------------------------------------
-- 1. EDUCATION — add missing timestamps
-- -----------------------------------------------------------
ALTER TABLE education
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- -----------------------------------------------------------
-- 2. PROFILE — add display_name, portfolio_url, twitter_url
-- -----------------------------------------------------------
ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) AFTER name,
  ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(255) AFTER linkedin_url,
  ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255) AFTER portfolio_url;

-- -----------------------------------------------------------
-- 3. PROJECTS — add category, type, display_order, is_visible
-- -----------------------------------------------------------
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS category VARCHAR(100) AFTER title,
  ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'web' AFTER status,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 AFTER type,
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE AFTER display_order;

-- -----------------------------------------------------------
-- 4. SKILLS — add display_order
-- -----------------------------------------------------------
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 AFTER icon;

-- -----------------------------------------------------------
-- 5. EXPERIENCES — add logo_url, technologies (JSON), display_order
-- -----------------------------------------------------------
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255) AFTER company,
  ADD COLUMN IF NOT EXISTS technologies TEXT AFTER description,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 AFTER location;

-- -----------------------------------------------------------
-- 6. CONTACT_MESSAGES — add replied_at for future use
-- -----------------------------------------------------------
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP NULL DEFAULT NULL AFTER is_read;

-- -----------------------------------------------------------
-- Verify migration
-- -----------------------------------------------------------
SELECT 'Migration complete' AS status;
