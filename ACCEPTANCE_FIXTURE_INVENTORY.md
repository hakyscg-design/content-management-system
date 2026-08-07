# Acceptance Fixture Inventory

| Field                       | Value                   |
| --------------------------- | ----------------------- |
| Project                     | Football Troll Vault v2 |
| Release candidate           | FTV-v2-MVP-1.0.0-RC1    |
| Acceptance preparation step | AE-01                   |
| Status                      | FROZEN                  |
| Freeze status               | Frozen                  |
| User approval               | Confirmed               |
| Freeze date                 | 2026-07-30              |
| Implementation changed      | No                      |

## Fixture Inventory

| Fixture               | Purpose                                       | Object IDs                                                  | Valid Case                                          | Invalid Case                         | Expected Result                                                                  |
| --------------------- | --------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| Source reference      | Verify manual approved source intake          | `at01-source-001`                                           | Capture and approve fictional source URL            | Empty manual action actor/reason     | Valid source becomes approved; invalid manual action fails                       |
| Asset                 | Verify asset registration and owner reference | `at01-asset-001`                                            | Register asset from approved source                 | Duplicate asset ID `at01-asset-001`  | Valid asset registered; duplicate rejected                                       |
| Provenance            | Verify evidence capture                       | `at01-asset-001:provenance`                                 | Store fictional manual evidence                     | Missing evidence                     | Provenance available for asset; missing evidence rejected by acceptance criteria |
| Rights                | Verify rights readiness gate                  | `at01-asset-001`                                            | Rights status `approved` before ready               | Pending rights marked ready          | Approved rights allow ready state; pending rights blocks ready state             |
| Media processing      | Verify processing job lifecycle               | `at01-job-001`                                              | Create, start, complete manual processing job       | Start/complete missing job           | Completed job returns FTV-SVC-02 reference; missing job fails                    |
| Content brief         | Verify manual brief creation                  | `at01-brief-001`                                            | English concept text present                        | Missing title or concept             | Valid brief created; missing fields fail                                         |
| Content package       | Verify package creation with asset references | `at01-content-001`                                          | Package references `at01-asset-001`                 | Package with no asset references     | Valid package created; empty asset list rejected                                 |
| Content version       | Verify versioning with multilingual values    | `at01-content-001:v1`                                       | English and Vietnamese captions included            | Missing snapshot                     | Valid version created; missing content rejected by acceptance criteria           |
| Review                | Verify review assignment and decision path    | `at01-review-001`                                           | Request, assign, approve target owned by FTV-SVC-03 | Review target owned by FTV-SVC-05    | Approval status becomes approved; invalid ownership rejected                     |
| Approval              | Verify approval status reference              | `at01-review-001:approval`                                  | Approval reference owned by FTV-SVC-05              | Missing review assignment            | Approval reference available; missing assignment fails                           |
| Publishing package    | Verify manual publishing package              | `at01-publishing-001`                                       | Complete checklist and mark ready                   | Incomplete checklist                 | Ready/completed package; incomplete checklist rejected                           |
| Publishing completion | Verify manual completion reference            | `manual-post://at01-derby-reaction`                         | Record manual publishing reference                  | Complete before ready                | Completed state recorded; premature completion rejected                          |
| Performance import    | Verify manual import lifecycle                | `at01-import-001`                                           | Stage and complete manual CSV import                | Missing publishing package reference | Import becomes imported; missing reference fails acceptance criteria             |
| Performance fact      | Verify fact and metric ownership              | `at01-fact-001`, `at01-metric-views`                        | Record fact for import and metric                   | Missing metric definition            | Fact owned by FTV-SVC-06; missing metric rejected                                |
| Analytics report      | Verify read-oriented report                   | `at01-report-001`                                           | Report references performance fact                  | Report owns performance fact         | Report created; ownership violation rejected                                     |
| Workflow              | Verify run-state-only workflow                | `at01-workflow-001`                                         | Manual workflow run completes                       | Failed command/event path            | Completed or manual-recovery state visible                                       |
| Authorization         | Verify allow/deny rule evaluation             | `at01-role-001`, `at01-relation-001`, `at01-evaluation-001` | Matching relation allows approval                   | Missing relation denies approval     | Explicit allowed/denied result with reason                                       |
| Audit                 | Verify audit evidence fields                  | `at01-audit-001`                                            | Actor, action, target, reason, operation ID present | Missing actor or reason              | Audit record includes timestamp; missing required fields rejected                |

## Multilingual Fixture Values

| Field       | English Value                              | Vietnamese Value                           |
| ----------- | ------------------------------------------ | ------------------------------------------ |
| Asset title | Late derby equalizer clip                  | Pha gỡ hòa phút cuối trận derby            |
| Caption     | That equalizer changed the whole timeline. | Pha gỡ hòa này đổi luôn cục diện trận đấu. |

All fixture values are fictional and contain no production credentials or unnecessary personal information.
