CREATE TABLE IF NOT EXISTS "LocalRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ownerServiceId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "LocalMedia" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ownerServiceId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "relativePath" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "byteSize" INTEGER NOT NULL,
  "sha256" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "LocalOperation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "ok" BOOLEAN NOT NULL,
  "message" TEXT NOT NULL,
  "code" TEXT,
  "category" TEXT,
  "payload" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "LocalConfig" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "value" TEXT NOT NULL,
  "updatedAt" DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "LocalRecord_ownerServiceId_idx" ON "LocalRecord"("ownerServiceId");
CREATE INDEX IF NOT EXISTS "LocalRecord_entityType_idx" ON "LocalRecord"("entityType");
CREATE UNIQUE INDEX IF NOT EXISTS "LocalMedia_relativePath_key" ON "LocalMedia"("relativePath");
CREATE INDEX IF NOT EXISTS "LocalMedia_ownerServiceId_idx" ON "LocalMedia"("ownerServiceId");
