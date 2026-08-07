# Acceptance Traceability Matrix

| Field                       | Value                   |
| --------------------------- | ----------------------- |
| Project                     | Football Troll Vault v2 |
| Release candidate           | FTV-v2-MVP-1.0.0-RC1    |
| Acceptance preparation step | AE-01                   |
| Status                      | FROZEN                  |
| Freeze status               | Frozen                  |
| User approval               | Confirmed               |
| Freeze date                 | 2026-07-30              |

| AT-01 Step                   | Fixture                       | Dataset                                                                      | Expected Output                                 | Validation Criteria                                                  | Expected Evidence                             |
| ---------------------------- | ----------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------- |
| Source intake                | Source reference              | `valid.sourceReference`                                                      | Approved source reference                       | Source captured and approved with manual actor/reason                | Command output, source ID, status             |
| Asset registration           | Asset, provenance, rights     | `valid.asset`, `valid.provenance`, `valid.rights`                            | Ready asset with provenance and approved rights | FTV-SVC-01 owns asset and rights; ready transition succeeds          | Asset ID, rights status, provenance ID        |
| Media processing             | Media processing              | `valid.mediaProcessing`                                                      | Completed processing job                        | FTV-SVC-02 owns job; asset only references job                       | Job ID, status, derivative refs               |
| Content creation             | Content brief/package/version | `valid.contentBrief`, `valid.contentPackage`, `valid.contentVersion`         | Review-ready content package with v1            | FTV-SVC-03 owns brief/package/version; multilingual values preserved | Brief ID, content package ID, version ID      |
| Review and approval          | Review, approval              | `valid.review`                                                               | Approved review and approval status             | FTV-SVC-05 owns decision/status; target not mutated by review        | Review ID, approval reference, decision       |
| Publishing preparation       | Publishing package            | `valid.publishingPackage`                                                    | Ready publishing package                        | Checklist complete before ready                                      | Publishing package ID, checklist state        |
| Manual publishing completion | Publishing completion         | `valid.publishingPackage.manualPublishingReference`                          | Completed package with manual reference         | No autonomous publishing; manual reference recorded                  | Manual publishing reference, completed status |
| Performance import           | Performance import/fact       | `valid.performanceImport`, `valid.metricDefinition`, `valid.performanceFact` | Imported facts                                  | FTV-SVC-06 owns import/fact/metric                                   | Import ID, fact ID, metric ID                 |
| Analytics report             | Analytics report              | `valid.analyticsReport`                                                      | Report over performance fact                    | FTV-SVC-07 remains read-oriented                                     | Report ID, narrative                          |
| Workflow coordination        | Workflow                      | `valid.workflow`                                                             | Workflow run completed or failure visible       | FTV-SVC-08 owns run only                                             | Workflow run ID, state transitions            |
| Authorization and governance | Authorization                 | `valid.authorization`, `invalid.deniedAuthorization`                         | Allowed and denied evaluations                  | FTV-SVC-09 returns explicit allowed/reason                           | Evaluation IDs, allow/deny result             |
| Audit evidence               | Audit                         | `valid.audit`                                                                | Audit record with timestamp                     | Actor/action/target/reason/operation ID present                      | Audit ID, timestamp, target                   |
| Invalid input coverage       | Invalid cases                 | `invalid` dataset object                                                     | Visible validation failures                     | State not corrupted and owner boundaries preserved                   | Error message/code, command output            |

## Evidence Destinations

| Evidence Type             | Destination                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| Command output            | `acceptance/evidence/AT-01/commands/`                                 |
| Test output               | `acceptance/evidence/AT-01/tests/`                                    |
| Lifecycle state records   | `acceptance/evidence/AT-01/state/`                                    |
| Audit records             | `acceptance/evidence/AT-01/audit/`                                    |
| Failure/recovery evidence | `acceptance/evidence/AT-01/failures/`                                 |
| Logs                      | `acceptance/logs/AT-01/`                                              |
| Final report              | `acceptance/reports/AT-01_END_TO_END_CONTENT_LIFECYCLE_ACCEPTANCE.md` |

AE-01 defines destinations only. AT-01 has not been executed.
