-- إنشاء الجداول كما هي موثقة في DATABASE_SCHEMA.md

CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    age INTEGER,
    "isActive" BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voice_artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    voice_type VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_creators (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    platforms VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_productions (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    production_type VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_writing (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    content_type VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);