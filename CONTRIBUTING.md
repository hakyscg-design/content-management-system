# Contributing

Football Troll Vault v2 work must follow the active Build Execution step and frozen baseline.

## Build Slice Workflow

1. Confirm the active BE step and scope.
2. Read the required frozen canonical artifacts.
3. Implement only the approved slice.
4. Run validation before reporting completion.
5. Present results for human review.
6. Wait for explicit approval before Freeze or the next BE step.

## Definition of Ready

- Scope is traceable to frozen requirements, services, domains, components, or capabilities.
- No architecture, ownership, repository, capability, or dependency-direction change is required.
- Manual fallback and human-governed gates remain intact.
- Test approach is defined.

## Definition of Done

- Changes stay inside the active BE step.
- Validation has been run or any inability to run it is reported.
- Risks, limitations, deferred items, and Change Request status are explicit.
- No step is marked Frozen without human confirmation.

## Review Gates

- Scope review.
- Boundary review.
- Test review.
- Documentation review.
- Change Request review.
- Human approval gate.

## Dependency Policy

Do not add direct candidate repository code or new runtime dependencies without license, purpose, owner, replacement boundary, and approval status. Reference-only and rejected repositories must not be copied into the source tree.

## Documentation Policy

Documentation updates must preserve canonical technical names and frozen baseline meaning. Technical content is English. Vietnamese user-facing text must be correct, fully accented, UTF-8 encoded, and NFC normalized.
