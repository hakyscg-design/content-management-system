PRAGMA foreign_keys=OFF;

CREATE TABLE "new_LocalRecord" (
  "projectId" TEXT NOT NULL DEFAULT 'football-troll-vault',
  "id" TEXT NOT NULL,
  "ownerServiceId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  PRIMARY KEY ("projectId", "id")
);

INSERT INTO "new_LocalRecord" (
  "projectId",
  "id",
  "ownerServiceId",
  "entityType",
  "label",
  "status",
  "payload",
  "createdAt",
  "updatedAt"
)
SELECT
  'football-troll-vault',
  "id",
  "ownerServiceId",
  "entityType",
  "label",
  "status",
  "payload",
  "createdAt",
  "updatedAt"
FROM "LocalRecord";

DROP TABLE "LocalRecord";
ALTER TABLE "new_LocalRecord" RENAME TO "LocalRecord";
CREATE INDEX "LocalRecord_projectId_ownerServiceId_idx" ON "LocalRecord"("projectId", "ownerServiceId");
CREATE INDEX "LocalRecord_projectId_entityType_idx" ON "LocalRecord"("projectId", "entityType");

CREATE TABLE "new_LocalMedia" (
  "projectId" TEXT NOT NULL DEFAULT 'football-troll-vault',
  "id" TEXT NOT NULL,
  "ownerServiceId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "relativePath" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "byteSize" INTEGER NOT NULL,
  "sha256" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  PRIMARY KEY ("projectId", "id")
);

INSERT INTO "new_LocalMedia" (
  "projectId",
  "id",
  "ownerServiceId",
  "fileName",
  "relativePath",
  "contentType",
  "byteSize",
  "sha256",
  "createdAt",
  "updatedAt"
)
SELECT
  'football-troll-vault',
  "id",
  "ownerServiceId",
  "fileName",
  "relativePath",
  "contentType",
  "byteSize",
  "sha256",
  "createdAt",
  "updatedAt"
FROM "LocalMedia";

DROP TABLE "LocalMedia";
ALTER TABLE "new_LocalMedia" RENAME TO "LocalMedia";
CREATE UNIQUE INDEX "LocalMedia_projectId_relativePath_key" ON "LocalMedia"("projectId", "relativePath");
CREATE INDEX "LocalMedia_projectId_ownerServiceId_idx" ON "LocalMedia"("projectId", "ownerServiceId");

CREATE TABLE "new_LocalOperation" (
  "projectId" TEXT NOT NULL DEFAULT 'football-troll-vault',
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "ok" BOOLEAN NOT NULL,
  "message" TEXT NOT NULL,
  "code" TEXT,
  "category" TEXT,
  "payload" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("projectId", "id")
);

INSERT INTO "new_LocalOperation" (
  "projectId",
  "id",
  "title",
  "ok",
  "message",
  "code",
  "category",
  "payload",
  "createdAt"
)
SELECT
  'football-troll-vault',
  "id",
  "title",
  "ok",
  "message",
  "code",
  "category",
  "payload",
  "createdAt"
FROM "LocalOperation";

DROP TABLE "LocalOperation";
ALTER TABLE "new_LocalOperation" RENAME TO "LocalOperation";
CREATE INDEX "LocalOperation_projectId_createdAt_idx" ON "LocalOperation"("projectId", "createdAt");

CREATE TABLE "new_LocalConfig" (
  "projectId" TEXT NOT NULL DEFAULT 'football-troll-vault',
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  PRIMARY KEY ("projectId", "key")
);

INSERT INTO "new_LocalConfig" ("projectId", "key", "value", "updatedAt")
SELECT 'football-troll-vault', "key", "value", "updatedAt"
FROM "LocalConfig";

DROP TABLE "LocalConfig";
ALTER TABLE "new_LocalConfig" RENAME TO "LocalConfig";

PRAGMA foreign_keys=ON;
