# L-03 Persistence Mapping

| Entity                           | Owning Service                                                                                                  | Prisma Model     | Main References                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| Accepted local record read model | Source-specific owner recorded per row, including FTV-SVC-01, FTV-SVC-03, FTV-SVC-05, FTV-SVC-08, FTV-SVC-11    | `LocalRecord`    | `ownerServiceId`, `entityType`, `payload`; created only after owning service public contract succeeds |
| Local media metadata             | FTV-SVC-02 Media Processing / local media responsibility                                                        | `LocalMedia`     | `relativePath`, `sha256`, `byteSize`; file bytes stored under `.ftv-local/media`                      |
| Local operator operation result  | FTV-SVC-08 Workflow Orchestration for owner-routed workflow actions; local runtime for transport result history | `LocalOperation` | `ok`, `title`, `message`, optional `code`, optional `category`, `payload.workflowRunId`               |
| Local runtime configuration      | FTV-SVC-11 Core Data Administration / local runtime configuration                                               | `LocalConfig`    | `schema.version`, `operation.sequence`, `l03.seeded`                                                  |

## Boundary Rule

Prisma models are local durability records only. They do not own business rules, lifecycle states, workflow transitions, approval decisions, publishing gates, or accepted service contracts. The Local Runtime calls accepted owner services first, then persists UI-safe local read models and storage metadata.
