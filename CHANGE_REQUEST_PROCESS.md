# Change Request Process

| Field | Value |
|---|---|
| Project | Football Troll Vault v2 |
| Baseline | FTV v2 MVP Baseline 1.0.0 |
| Status | Canonical |
| Scope | All changes after MVP baseline freeze |

## 1. Core Rule

Frozen artifacts MUST NOT be modified directly.

Every future change requires:

1. Change Request
2. Architecture Review
3. Approval
4. Version Update
5. Changelog
6. Review
7. Freeze

There is no exception to this process.

## 2. Frozen Artifact Protection

The following MUST NOT be changed without an approved change request:

- architecture;
- services;
- domains;
- repositories;
- components;
- capabilities;
- ownership;
- dependencies;
- frozen implementation behavior;
- canonical terminology;
- language and naming policy;
- MVP baseline status.

## 3. Change Request Requirements

A change request MUST include:

- change request ID;
- requester;
- date;
- affected frozen artifact or implementation area;
- proposed change;
- reason;
- expected benefit;
- affected services;
- affected domains;
- affected repositories;
- affected ownership records;
- affected capabilities and components;
- compatibility impact;
- risk assessment;
- rollback or reversal plan;
- validation plan;
- reviewer and approver.

## 4. Architecture Review

Architecture review MUST verify:

- no hidden ownership change;
- no service boundary drift;
- no domain overlap;
- no repository decision drift;
- no dependency cycle;
- no terminology or naming conflict;
- no language-policy violation;
- no regression against manual-first and human-governed principles.

If architecture review identifies a conflict with the frozen baseline, the change MUST NOT proceed until the conflict is resolved and approved.

## 5. Approval

Approval MUST be explicit. Silence, inferred consent, or implementation momentum MUST NOT count as approval.

Approved changes MUST identify the target version before implementation.

## 6. Version Update

Any accepted change MUST update the relevant version scope:

- patch version for corrections that do not alter architecture or behavior;
- minor version for compatible feature or capability evolution;
- major version for architecture, ownership, or service-boundary changes.

Version updates MUST preserve traceability to the approved change request.

## 7. Changelog

A changelog entry MUST record:

- change request ID;
- version;
- summary;
- affected artifacts;
- validation result;
- approval reference;
- freeze timestamp.

## 8. Review and Freeze

After implementation or documentation update:

1. Run validation defined by the change request.
2. Perform self review.
3. Perform architecture and ownership review if applicable.
4. Record remaining risks.
5. Freeze the approved new version.

No change MAY become canonical until review and freeze are complete.

## 9. Emergency Changes

Emergency changes MAY be expedited, but they still require:

- explicit change request record;
- explicit approval;
- post-change architecture review;
- validation;
- changelog;
- freeze.

Emergency status MUST NOT bypass traceability.

## 10. Stop Rule

If a proposed change conflicts with the frozen MVP baseline and does not have explicit approval, stop and report:

```text
CHANGE REQUEST REQUIRED
```

