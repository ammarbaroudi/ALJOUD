-- ════════════════════════════════════════════
-- Aljoud Real Estate — Database Schema
-- Run this in Supabase SQL Editor
-- ════════════════════════════════════════════

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'admin' NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now() NOT NULL
);

-- Properties table
CREATE TYPE property_status AS ENUM ('للبيع', 'للإيجار', 'مباع');

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL,
  location VARCHAR DEFAULT 'الخالدية - حمص' NOT NULL,
  status property_status DEFAULT 'للبيع' NOT NULL,
  "isFeatured" BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT now() NOT NULL
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR NOT NULL,
  "publicId" VARCHAR NOT NULL,
  "propertyId" UUID REFERENCES properties(id) ON DELETE CASCADE
);
