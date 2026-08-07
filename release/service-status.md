# FTV v2 MVP Service Status

| Service                              | Runtime Status | Ownership                                        | Release Candidate Status |
| ------------------------------------ | -------------- | ------------------------------------------------ | ------------------------ |
| FTV-SVC-01 Source & Asset Registry   | Implemented    | Sources, assets, provenance, rights, duplicates  | Ready                    |
| FTV-SVC-02 Media Processing          | Implemented    | Processing jobs                                  | Ready                    |
| FTV-SVC-03 Content Production        | Implemented    | Briefs, packages, versions                       | Ready                    |
| FTV-SVC-04 Publishing Preparation    | Implemented    | Publishing packages                              | Ready                    |
| FTV-SVC-05 Human Review & Approval   | Implemented    | Review assignments, decisions, approval status   | Ready                    |
| FTV-SVC-06 Performance Data          | Implemented    | Imports, facts, metric definitions               | Ready                    |
| FTV-SVC-07 Analytics & Reporting     | Implemented    | Reports and learning summaries                   | Ready                    |
| FTV-SVC-08 Workflow Orchestration    | Implemented    | Workflow runs only                               | Ready                    |
| FTV-SVC-09 Governance & Rule         | Implemented    | Roles, relations, rule evaluations, audit events | Ready                    |
| FTV-SVC-10 Reference Pattern Library | Non-runtime    | Reference patterns only                          | Ready as reference-only  |
| FTV-SVC-11 Core Data Administration  | Implemented    | Admin metadata and non-authoritative inspection  | Ready                    |

## Ownership Rule

Each runtime service mutates only its authoritative records. Other services reference owner records by stable entity reference and owner service ID.
