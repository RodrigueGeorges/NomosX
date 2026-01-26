-- CreateExtension
-- Migration: Add institutional provider fields to Source table

-- Add new columns to Source table
ALTER TABLE "Source" 
ADD COLUMN IF NOT EXISTS "documentType" TEXT,
ADD COLUMN IF NOT EXISTS "issuer" TEXT,
ADD COLUMN IF NOT EXISTS "issuerType" TEXT,
ADD COLUMN IF NOT EXISTS "classification" TEXT,
ADD COLUMN IF NOT EXISTS "publishedDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS "contentFormat" TEXT,
ADD COLUMN IF NOT EXISTS "securityLevel" TEXT,
ADD COLUMN IF NOT EXISTS "economicSeries" TEXT,
ADD COLUMN IF NOT EXISTS "legalStatus" TEXT;

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS "Source_issuerType_idx" ON "Source"("issuerType");
CREATE INDEX IF NOT EXISTS "Source_issuer_idx" ON "Source"("issuer");
CREATE INDEX IF NOT EXISTS "Source_documentType_idx" ON "Source"("documentType");
CREATE INDEX IF NOT EXISTS "Source_classification_idx" ON "Source"("classification");
CREATE INDEX IF NOT EXISTS "Source_publishedDate_idx" ON "Source"("publishedDate");
CREATE INDEX IF NOT EXISTS "Source_language_idx" ON "Source"("language");
