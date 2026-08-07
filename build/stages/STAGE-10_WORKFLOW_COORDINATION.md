# Stage-10 - Workflow Coordination

## Stage Scope

| Field | Result |
|---|---|
| Stage | Stage-10 |
| Purpose | Add workflow run visibility, manual triggers, optional scheduled trigger boundary, and retry/failure coordination. |
| Service implemented | FTV-SVC-08 Workflow Orchestration |
| Referenced owner services | FTV-SVC-02; FTV-SVC-05; FTV-SVC-06; FTV-SVC-09 |
| Domain | Workflow Domain |
| Related domains by reference | Media Domain; Review Domain; Performance Domain; Governance Domain |
| Capability | CAP-08 |
| Components | FTV-COMP-019; FTV-COMP-020; FTV-COMP-022 |
| Repositories | Activepieces ADAPT pattern; Kestra ADAPT pattern; Camunda REFERENCE ONLY; n8n REJECT; Temporal REJECT |

## Dependency Validation

| Dependency | Status |
|---|---|
| Stage-1 Freeze | Present |
| Stage-4 Freeze | Present |
| Stage-6 Freeze | Present |
| Stage-8 Freeze | Present |
| Stage-9 Freeze and exit criteria | Present |

## Folder Structure

```text
src/ftv/workflow_orchestration/
tests/ftv/workflow_orchestration/
build/stages/stage-10/
```

## Package Structure

| Module | Purpose |
|---|---|
| `constants.py` | Service ids, entity name, allowed target owner services, audit outcomes. |
| `state.py` | Workflow run and step state machine. |
| `models.py` | Workflow run, step, target command, dispatch result, history entry. |
| `contracts.py` | Register/start/retry/cancel commands. |
| `interfaces.py` | Repository and dispatcher ports. |
| `validators.py` | Workflow, trigger, dependency, and retry/cancel validation. |
| `governance.py` | Stage-1 governance and audit gateway. |
| `repository_adapters.py` | In-memory run/history repositories. |
| `adapters.py` | Recording target command dispatcher. |
| `service.py` | Workflow orchestration facade. |
| `config.py` | Stage-10 composition helper. |

## Interface Design

Workflow commands:

- `RegisterWorkflowCommand`
- `StartWorkflowRunCommand`
- `RetryWorkflowRunCommand`
- `CancelWorkflowRunCommand`

Ports:

- `WorkflowRunRepository`
- `WorkflowHistoryRepository`
- `WorkflowCommandDispatcher`

`WorkflowCommandDispatcher` is the integration boundary. It dispatches a `WorkflowTargetCommand` to a target owner service id and returns a `WorkflowDispatchResult`. Stage-10 records dispatch status but does not write target business records.

## Repository Adapter

The stage uses in-memory adapters:

- `InMemoryWorkflowRunRepository`
- `InMemoryWorkflowHistoryRepository`

No database, queue, scheduler, durable engine, or external workflow runtime is introduced.

## Internal Modules

| Internal module | Implementation |
|---|---|
| Workflow Run Tracker | `WorkflowOrchestrationService`, `WorkflowRun`, repositories, and history. |
| Manual Trigger Flow | Register/start commands. |
| Optional Scheduled Trigger Boundary | `WorkflowTriggerType.SCHEDULED_BOUNDARY`; explicit start still required. |
| Retry/Failure Visibility | Failed step state, run failure reason, retry counter, and history. |

## Configuration

`build_stage10_workflow_orchestration_service()` wires:

- Stage-1 governance service;
- run/history repositories;
- recording dispatcher;
- workflow governance gateway;
- workflow validator.

Default target owner services are limited to `FTV-SVC-02`, `FTV-SVC-05`, and `FTV-SVC-06`.

## Tests

| Suite | Coverage |
|---|---|
| `test_state.py` | Valid and invalid workflow lifecycle transitions. |
| `test_validators.py` | Trigger, dependency, target owner, reason, and retry policy validation. |
| `test_service_integration.py` | Manual trigger, target command coordination, failure visibility, retry, cancellation, scheduled boundary. |
| `test_smoke.py` | Basic service composition and workflow registration. |

## Validation

Command executed:

```text
python -m unittest discover -s tests\ftv\workflow_orchestration -p "test_*.py"
```

Result:

```text
Ran 13 tests
OK
```

Package validation from Stage-1 through Stage-10 was also executed by stage directory. Result: 109 tests passed.

## Review

| Check | Result |
|---|---|
| Follows Build Roadmap Stage-10 | Pass |
| Uses frozen Stage-10 services, domains, components, and repositories | Pass |
| Does not change architecture, service ownership, domains, repository decisions, or roadmap | Pass |
| Keeps workflow ownership limited to `Workflow run` | Pass |
| Does not mutate media/review/performance business state | Pass |
| Uses Stage-1 governance for rule and audit checks | Pass |
| Does not build Stage-11 or Stage-12 | Pass |
| Keeps manual fallback valid | Pass |

## Known Limitations

- The dispatcher is a boundary adapter, not a production integration bus.
- Scheduled trigger is only represented as a trigger source/type and does not create timers.
- Retry policy is a configurable count only; no backoff or durable retry engine.
- Activepieces and Kestra are reflected as MVP patterns, not embedded runtimes.

## Next Stage Dependency

Stage-11 can consume `Workflow run` visibility after Stage-10 review/freeze. No Stage-11 admin visibility was implemented.

## Final Stage Status

READY FOR REVIEW
