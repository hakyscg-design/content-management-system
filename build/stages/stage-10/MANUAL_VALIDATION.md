# Stage-10 Manual Validation Guide

## Prerequisites

- Stage-1 is available for governance and audit.
- Stage-4, Stage-6, and Stage-8 owner services are frozen before workflow coordination.
- Stage-10 must not mutate target business records directly.

## Manual Trigger Flow

1. Build `GovernanceService` with `build_stage1_governance_service()`.
2. Build `WorkflowOrchestrationService` with `build_stage10_workflow_orchestration_service(governance)`.
3. Register a workflow with `WorkflowTriggerType.MANUAL`.
4. Include target commands for owner services only:
   - `FTV-SVC-02` media processing;
   - `FTV-SVC-05` human review;
   - `FTV-SVC-06` performance data.
5. Start the workflow with `StartWorkflowRunCommand`.
6. Verify the run completes and each step stores output summary from the dispatcher.

## Failure Visibility

1. Configure `RecordingWorkflowCommandDispatcher(fail_commands=("request_review",))`.
2. Register and start a workflow containing `request_review`.
3. Verify:
   - workflow run state is `failed`;
   - failed step state is `failed`;
   - failure reason is recorded;
   - history contains the failed `step_id`.

## Retry Coordination

1. Configure `RecordingWorkflowCommandDispatcher(fail_once_commands=("import_metrics",))`.
2. Start the workflow and verify the first run fails.
3. Submit `RetryWorkflowRunCommand` with a non-empty reason.
4. Verify the run returns to `requested`.
5. Start the workflow again and verify it completes.

## Scheduled Trigger Boundary

1. Register a workflow with `WorkflowTriggerType.SCHEDULED_BOUNDARY`.
2. Use a trigger source such as `scheduled-boundary:daily-performance-import`.
3. Verify the run remains `requested` until an explicit start command is issued.
4. Verify no autonomous scheduler or background job is created.

## Manual Fallback

1. Register a requested workflow run.
2. Cancel it with a reason such as `Continue manually`.
3. Verify the run state is `cancelled`.
4. Perform owner-service manual operations outside workflow.

