# CMS System Overview

CMS is a reusable local-first content production layer. It supports source and asset management, content production, media processing, human review, publishing preparation, performance data, analytics, workflow orchestration, governance, audit, configuration, and local operational administration.

CMS sits below TKIC and Research Engine:

```text
Research Engine -> TKIC -> CMS -> Platforms -> Performance -> Feedback to TKIC / Research Engine
```

TKIC remains the Decision / Intelligence Layer. Research Engine remains the Research Layer. CMS does not merge either system.

The current implementation inherits the accepted Football Troll Vault v2 architecture and service boundaries. The current local runtime is a browser operator console on `localhost`, a backend composition boundary, SQLite persistence through Prisma, local filesystem media storage, and manual backup/restore.

Known inherited FTV elements include FTV service IDs, historical reports, accepted behavior, and project-specific operational knowledge. These are preserved intentionally. New CMS-level docs describe the generalized product without rewriting historical evidence.

Known gaps: CMS naming is product-facing but internal compatibility package names still use `@ftv/*`; local data environment variables still use `FTV_*`; packaging is a zip/package candidate, not a frozen CMS baseline; TKIC and Research Engine integrations are boundaries only, not implemented connectors.
