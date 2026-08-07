# Acceptance Dataset Catalog

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

## Dataset Summary

| Dataset                                                    | Coverage                                                                                                                                                      | Status                         |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `acceptance/datasets/at-01-content-lifecycle-dataset.json` | Valid source-to-learning objects, invalid input cases, duplicate IDs, invalid ownership, invalid lifecycle transition, English and Vietnamese Unicode content | Complete for AT-01 preparation |

## Dataset Coverage

| Requirement                         | Covered | Evidence                                                 |
| ----------------------------------- | ------- | -------------------------------------------------------- |
| Valid objects                       | Yes     | `valid` object in dataset                                |
| Invalid objects                     | Yes     | `invalid` object in dataset                              |
| Missing fields                      | Yes     | `missingManualAction`, missing evidence/content criteria |
| Duplicate IDs                       | Yes     | `duplicateAssetId`                                       |
| Invalid ownership                   | Yes     | `invalidOwnership.reviewTargetOwnerServiceId`            |
| Invalid lifecycle transition        | Yes     | `invalidRightsTransition`, `invalidPublishingChecklist`  |
| Multilingual values                 | Yes     | English and Vietnamese title/caption values              |
| Unicode values                      | Yes     | Vietnamese UTF-8 accented text                           |
| Vietnamese content                  | Yes     | `title_vi`, `caption_vi`                                 |
| English content                     | Yes     | `title_en`, `caption_en`                                 |
| No production secrets               | Yes     | Fictional `example.test` URLs and manual references only |
| No unnecessary personal information | Yes     | Generic operator IDs only                                |

## Dataset Use Boundary

The dataset is prepared for later approved acceptance execution. AE-01 does not execute the end-to-end lifecycle and does not modify service logic.
