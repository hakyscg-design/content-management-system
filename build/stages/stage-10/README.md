# Stage-10 - Workflow Coordination

## Implementation Plan

Stage-10 implements `FTV-SVC-08 Workflow Orchestration` only. The service owns `Workflow run` records and coordinates owner-service commands for `FTV-SVC-02`, `FTV-SVC-05`, and `FTV-SVC-06`.

The implementation follows the frozen roadmap:

- Workflow run lifecycle: requested, running, completed, failed, retrying, cancelled.
- Manual trigger flow: operator registers and starts workflow runs explicitly.
- Optional scheduled trigger boundary: scheduled source can create a requested run, but no autonomous scheduler is implemented.
- Retry coordination: failed runs can be marked retrying and reset to requested.
- Failure visibility: failed step, failure reason, and history entry are recorded.
- Owner boundary: workflow dispatches target commands but does not own or directly mutate target business state.

## Folder Structure

```text
src/ftv/workflow_orchestration/
tests/ftv/workflow_orchestration/
build/stages/stage-10/
```

## Package Layout

```text
workflow_orchestration
|-- adapters.py
|-- config.py
|-- constants.py
|-- contracts.py
|-- errors.py
|-- governance.py
|-- interfaces.py
|-- models.py
|-- repository_adapters.py
|-- service.py
|-- state.py
|-- validators.py
`-- __init__.py
```

## Source Tree

```text
src/ftv/workflow_orchestration/adapters.py
src/ftv/workflow_orchestration/config.py
src/ftv/workflow_orchestration/constants.py
src/ftv/workflow_orchestration/contracts.py
src/ftv/workflow_orchestration/errors.py
src/ftv/workflow_orchestration/governance.py
src/ftv/workflow_orchestration/interfaces.py
src/ftv/workflow_orchestration/models.py
src/ftv/workflow_orchestration/repository_adapters.py
src/ftv/workflow_orchestration/service.py
src/ftv/workflow_orchestration/state.py
src/ftv/workflow_orchestration/validators.py
src/ftv/workflow_orchestration/__init__.py
tests/ftv/workflow_orchestration/test_service_integration.py
tests/ftv/workflow_orchestration/test_smoke.py
tests/ftv/workflow_orchestration/test_state.py
tests/ftv/workflow_orchestration/test_validators.py
```

## Interface Design

The service exposes these commands:

- `RegisterWorkflowCommand`
- `StartWorkflowRunCommand`
- `RetryWorkflowRunCommand`
- `CancelWorkflowRunCommand`

Ports:

- `WorkflowRunRepository`
- `WorkflowHistoryRepository`
- `WorkflowCommandDispatcher`

The dispatcher is the owner-service boundary. It accepts `WorkflowTargetCommand` records that identify the target owner service, command name, target record reference, and payload. It returns `WorkflowDispatchResult` only; it does not write target business state.

## Domain Models and DTOs

- `WorkflowRun`
- `WorkflowStep`
- `WorkflowTargetCommand`
- `WorkflowDispatchResult`
- `WorkflowHistoryEntry`

## Workflow Run Models

Run lifecycle:

```text
requested -> running -> completed
requested -> running -> failed -> retrying -> requested
requested -> cancelled
running -> cancelled
failed -> cancelled
```

Step lifecycle:

```text
pending -> running -> completed
pending -> running -> failed
```

## Audit Models

Audit remains owned by `FTV-SVC-09 Governance & Rule`. Stage-10 uses `WorkflowGovernanceGateway` to evaluate owner rules and record audit events for:

- workflow registration;
- workflow start;
- workflow retry;
- workflow cancellation.

Workflow-specific history is owned by `FTV-SVC-08` and stores trigger source, actor, timestamp, state transition, step id, and linked audit event id.

## Repository Adapter

Stage-10 uses in-memory adapters only:

- `InMemoryWorkflowRunRepository`
- `InMemoryWorkflowHistoryRepository`

This preserves repository independence and does not introduce a database or workflow platform.

## Internal Modules

- Workflow Run Tracker: implemented by `WorkflowOrchestrationService`, `WorkflowRun`, `WorkflowStep`, and repositories.
- Manual Trigger Flow: implemented by explicit register/start commands.
- Optional Scheduled Trigger Boundary: represented by `WorkflowTriggerType.SCHEDULED_BOUNDARY`; no scheduler is created.
- Retry/Failure Visibility: implemented by run state, step state, failure reason, and history entries.

## Configuration

`build_stage10_workflow_orchestration_service()` composes:

- in-memory run repository;
- in-memory history repository;
- `RecordingWorkflowCommandDispatcher`;
- `WorkflowGovernanceGateway`;
- `WorkflowValidator`.

Allowed MVP target owner services default to:

- `FTV-SVC-02`
- `FTV-SVC-05`
- `FTV-SVC-06`

## Repository Decisions Applied

- Activepieces: ADAPT as human-facing workflow automation pattern.
- Kestra: ADAPT as scheduled technical workflow boundary pattern.
- Camunda: REFERENCE ONLY for workflow/rule concepts.
- n8n: REJECT, not selected.
- Temporal: REJECT, not selected.

No third-party code was copied.

## Tests

```text
tests/ftv/workflow_orchestration/test_state.py
tests/ftv/workflow_orchestration/test_validators.py
tests/ftv/workflow_orchestration/test_service_integration.py
tests/ftv/workflow_orchestration/test_smoke.py
```

Coverage includes:

- workflow state transitions;
- manual trigger registration and start;
- scheduled trigger boundary without autonomous scheduling;
- failure visibility;
- retry coordination;
- cancellation/manual fallback;
- target owner-service validation.

## Known Limitations

- No durable workflow platform.
- No enterprise BPM.
- No autonomous scheduler.
- No business rule engine.
- No direct mutation of media, review, or performance state.
- Dispatcher is a boundary adapter suitable for MVP validation, not a production integration bus.

## Next Stage Dependency

Stage-11 can reference workflow run visibility after Stage-10 review/freeze. Stage-10 does not implement Stage-11 admin views.

