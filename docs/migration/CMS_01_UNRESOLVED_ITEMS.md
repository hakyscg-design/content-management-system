# CMS-01 Unresolved Items

## Unresolved Classification

| Item                                         | Status                    | Reason                                                                                                                              |
| -------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `reviews/` from source repository            | UNRESOLVED                | Appears to contain RAF/review outputs. Operator classification needed before including in CMS package.                              |
| `docs/repository-separation/`                | UNRESOLVED                | Repository separation material may be useful as migration evidence, but not required for CMS runtime core.                          |
| `targets/TKIC/`                              | EXCLUDED FROM CMS CORE    | TKIC remains a separate Decision / Intelligence Layer.                                                                              |
| `tkic-core*.zip`, `tkic-core/`, TKIC backups | EXCLUDED FROM CMS CORE    | Separate system artifacts, not CMS product source.                                                                                  |
| `.ftv-local/` runtime data                   | LOCAL DATA EXTERNALIZED   | Machine-local data must not be treated as source. Migration plan points toward `C:\cms-local-data`.                                 |
| Internal `@ftv/*` package names              | INTENTIONAL COMPATIBILITY | Broad rename was avoided to protect accepted contracts and service IDs.                                                             |
| `FTV_*` local environment variables          | INTENTIONAL COMPATIBILITY | Preserved to avoid breaking current Local Tool runtime; CMS alias can be added in a later approved phase.                           |
| Asset Library click-level smoke              | PARTIAL                   | Source/component behavior is present and page renders; no browser click automation was executed in CMS-01.                          |
| `C:\content-management-system.zip`           | UNRESOLVED                | Windows denied direct write to root `C:\`; ZIP was created at `C:\content-management-system\content-management-system.zip` instead. |

## Final Unresolved Status

CMS-01 is complete with unresolved items awaiting operator review.
