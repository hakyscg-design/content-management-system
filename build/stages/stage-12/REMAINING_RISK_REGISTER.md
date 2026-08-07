# Remaining Risk Register

| Risk | Status | MVP handling |
|---|---|---|
| License blockers for repository-derived patterns | Open | Keep reference/adapt boundaries and manual fallback; do not embed unverified runtimes. |
| Directus source-available/commercial boundary | Open | Stage-11 uses internal admin visibility model, no Directus runtime. |
| ResourceSpace module/license boundary | Open | Stage-2/3/4 use internal small modules and patterns only. |
| PhotoPrism AGPL boundary | Open | Kept reference only. |
| Metabase AGPL/commercial boundary | Open | Stage-9 internal reports; Metabase pattern only. |
| Workflow automation overreach | Controlled | Workflow owns run visibility only; target state stays with owner services. |
| Admin ownership drift | Controlled | Admin rejects direct business mutation and redirects writes. |
| Platform metrics inconsistency | Controlled for MVP | CSV import, mapping, normalization, and import errors are manual-first. |

No risk was resolved by changing architecture.

