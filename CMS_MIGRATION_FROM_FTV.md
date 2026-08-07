# CMS Migration From FTV

CMS-01 extracts a clean product package from the current local FTV working repository.

The migration preserves FTV v2 accepted architecture, business rules, service ownership, governance, audit behavior, local tool implementation, SQLite persistence, local media storage, backup/restore scripts, tests, and source code needed for continued development.

Generalization strategy:

- CMS becomes the product identity.
- Football Troll Vault becomes a project profile.
- Historical FTV canonical files and reports remain unchanged evidence.
- FTV service IDs and internal package names remain compatibility identifiers for now.
- RAF framework methodology and unrelated target material are excluded from CMS core unless explicitly required for product operation.

Source repository: `C:\repository-acquisition-framework`.
Source HEAD: `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3`.
Accepted FTV tag: `ftv-v2-mvp-accepted`.
