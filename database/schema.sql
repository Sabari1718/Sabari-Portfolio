-- ============================================================
-- Sabari Portfolio — Full Database Schema (Final)
-- Run this for fresh installations only.
-- For existing DBs, use database/migration.sql instead.
-- ============================================================

CREATE DATABASE IF NOT EXISTS sabari_portfolio;
USE sabari_portfolio;

-- -----------------------------------------------------------
-- USERS — Admin accounts
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- PROFILE — Single portfolio owner profile
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    headline VARCHAR(255),
    bio TEXT,
    profile_image VARCHAR(500),
    location VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    resume_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    twitter_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- PROJECTS — Portfolio projects
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    image_url VARCHAR(500),
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'completed',
    type VARCHAR(50) DEFAULT 'web',
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- PROJECT_TECHNOLOGIES — Tech tags per project
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_technologies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    technology VARCHAR(100) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- SKILLS — Technical skills
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    proficiency INT DEFAULT 80,
    icon VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- EXPERIENCES — Work experience
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    role VARCHAR(255) NOT NULL,
    description TEXT,
    technologies TEXT,
    start_date DATE,
    end_date DATE,
    currently_working BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- EDUCATION — Academic background
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field VARCHAR(255),
    grade VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- CERTIFICATIONS — Professional certifications
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    issue_date DATE,
    credential_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- SOCIAL_LINKS — Social / external profile links
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- CONTACT_MESSAGES — Messages from public contact form
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- NAVBAR SETTINGS
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS navbar_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    logo_name VARCHAR(255) DEFAULT 'Sabari Portfolio',
    about_label VARCHAR(100) DEFAULT 'About',
    projects_label VARCHAR(100) DEFAULT 'Projects',
    skills_label VARCHAR(100) DEFAULT 'Skills',
    contact_label VARCHAR(100) DEFAULT 'Contact',
    show_about BOOLEAN DEFAULT TRUE,
    show_projects BOOLEAN DEFAULT TRUE,
    show_skills BOOLEAN DEFAULT TRUE,
    show_contact BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO navbar_settings (logo_name, about_label, projects_label, skills_label, contact_label, show_about, show_projects, show_skills, show_contact)
SELECT 'Sabari Portfolio', 'About', 'Projects', 'Skills', 'Contact', TRUE, TRUE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM navbar_settings);

