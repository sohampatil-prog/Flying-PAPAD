-- Papad Udd Game — Database Schema
-- Run this once to set up the database:
--   mysql -u root -p < setup.sql

CREATE DATABASE IF NOT EXISTS papad_udd
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE papad_udd;

CREATE TABLE IF NOT EXISTS scores (
    id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(50)     NOT NULL,
    score       INT UNSIGNED    NOT NULL DEFAULT 0,
    papad_type  ENUM('raw','fried','baked') NOT NULL DEFAULT 'raw',
    played_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Index for fast leaderboard queries (ORDER BY score DESC)
    INDEX idx_score (score DESC),
    -- Index for personal best lookup
    INDEX idx_player (player_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
